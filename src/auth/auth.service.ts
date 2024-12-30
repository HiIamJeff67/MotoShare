import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DRIZZLE } from "../../src/drizzle/drizzle.module";
import { DrizzleDB } from "../../src/drizzle/types/drizzle";
import { AuthTokenType } from '../../src/interfaces/auth.interface';
import { ApiGeneratingBearerTokenException, 
    ClientCreatePassengerInfoException, 
    ClientCreatePassengerAuthException, 
    ClientSignInEmailNotFoundException, 
    ClientSignInPasswordNotMatchException, 
    ClientSignInUserNameNotFoundException, 
    ClientSignUpUserException,
    ClientSignInUserException,
    ServerExtractGoogleAuthUrlEnvVariableException,
    ClientUserAuthenticatedMethodNotAllowedException,
    ClientInvalidGoogleIdTokenException,
    ClientCreatePassengerRecordException,
    ClientCreateRidderRecordException, 
} from '../exceptions';

import { PassengerTable } from "../../src/drizzle/schema/passenger.schema";
import { PassengerInfoTable } from '../../src/drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../../src/drizzle/schema/ridder.schema';

import { GoogleSignInDto, GoogleSignUpDto, SignInDto, SignUpDto } from "./dto/index";
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { PassengerAuthTable } from '../drizzle/schema/passengerAuth.schema';
import { RidderAuthTable } from '../drizzle/schema/ridderAuth.schema';
import { PassengerRecordTable } from '../drizzle/schema/passengerRecord.schema';
import { RidderRecordTable } from '../drizzle/schema/ridderRecord.schema';

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        @Inject(DRIZZLE) private db: DrizzleDB,
        private jwt: JwtService,
    ) {}

    /* ================================= Sign Up Passenger operations ================================= */
    async signUpPassengerWithUserNameAndEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType> {
        // hash the password, then provide hash value to create the user
        // const hash = await bcrypt.hash(createPassengerDto.password, Number(this.config.get("SALT_OR_ROUND")));
        return await this.db.transaction(async (tx) => {
            const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")));
            const tempAccessToken = await this._tempSignToken(signUpDto.userName, signUpDto.email);

            const responseOfCreatingPassenger = await tx.insert(PassengerTable).values({
                userName: signUpDto.userName, 
                email: signUpDto.email, 
                password: hash, 
                accessToken: tempAccessToken.accessToken, 
            }).returning({
                id: PassengerTable.id,
                email: PassengerTable.email,
            });
            if (!responseOfCreatingPassenger || responseOfCreatingPassenger.length === 0) {
                throw ClientSignUpUserException;
            }

            const responseOfCreatingPassengerInfo = await tx.insert(PassengerInfoTable).values({
                userId: responseOfCreatingPassenger[0].id,
            }).returning();
            if (!responseOfCreatingPassengerInfo || responseOfCreatingPassengerInfo.length === 0) {
                throw ClientCreatePassengerInfoException;
            }

            const responseOfCreatingPassengerRecord = await tx.insert(PassengerRecordTable).values({
                userId: responseOfCreatingPassenger[0].id,  
            }).returning();
            if (!responseOfCreatingPassengerRecord || responseOfCreatingPassengerRecord.length === 0) {
                throw ClientCreatePassengerRecordException;
            }

            const result = await this._signToken(responseOfCreatingPassenger[0].id, responseOfCreatingPassenger[0].email);
            if (!result) throw ApiGeneratingBearerTokenException;

            const responseOfUpdatingAccessToken = await tx.update(PassengerTable).set({
                accessToken: result.accessToken, 
            }).where(eq(PassengerTable.id, responseOfCreatingPassenger[0].id))
              .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw ClientSignUpUserException;
            }

            const responseOfCreatingPassengerAuth = await tx.insert(PassengerAuthTable).values({
                userId: responseOfCreatingPassenger[0].id, 
                isDefaultAuthenticated: true, 
                authCode: this._getRandomAuthCode(), // generate 6 digits auth code (100000~999999)
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000), // * 60000 since the unit is minutes
            }).returning();
            if (!responseOfCreatingPassengerAuth || responseOfCreatingPassengerAuth.length === 0) {
                throw ClientCreatePassengerAuthException;
            }

            return result;
        });
    }
    
    async signUpPassengerWithGoogleAuth(googleSignUpDto: GoogleSignUpDto) {
        return await this.db.transaction(async (tx) => {
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl) throw ServerExtractGoogleAuthUrlEnvVariableException;

            const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + googleSignUpDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();

            const userName = await bcrypt.hash(googleSignUpDto.email.split('@')[0], Number(this.config.get("SALT_OR_ROUND_GOOGLE_USER_NAME")));
            const tempAccessToken = await this._tempSignToken(userName, googleSignUpDto.email);

            const responseOfCreatingPassenger = await tx.insert(PassengerTable).values({
                userName: userName, 
                email: googleSignUpDto.email, 
                password: "",   // we don't set password for google user
                accessToken: tempAccessToken.accessToken, 
            }).returning({
                id: PassengerTable.id,
                email: PassengerTable.email,
            });
            if (!responseOfCreatingPassenger || responseOfCreatingPassenger.length === 0) {
                throw ClientSignUpUserException;
            }

            const responseOfCreatingPassengerInfo = await tx.insert(PassengerInfoTable).values({
                userId: responseOfCreatingPassenger[0].id,
            }).returning();
            if (!responseOfCreatingPassengerInfo || responseOfCreatingPassengerInfo.length === 0) {
                throw ClientCreatePassengerInfoException;
            }

            const responseOfCreatingPassengerRecord = await tx.insert(PassengerRecordTable).values({
                userId: responseOfCreatingPassenger[0].id,  
            }).returning();
            if (!responseOfCreatingPassengerRecord || responseOfCreatingPassengerRecord.length === 0) {
                throw ClientCreatePassengerRecordException;
            }

            const result = await this._signToken(responseOfCreatingPassenger[0].id, responseOfCreatingPassenger[0].email);
            if (!result) throw ApiGeneratingBearerTokenException;

            const responseOfUpdatingAccessToken = await tx.update(PassengerTable).set({
                accessToken: result.accessToken, 
            }).where(eq(PassengerTable.id, responseOfCreatingPassenger[0].id))
              .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw ClientSignUpUserException;
            }

            const responseOfCreatingPassengerAuth = await tx.insert(PassengerAuthTable).values({
                userId: responseOfCreatingPassenger[0].id, 
                googleId: parseDataFromGoogleToken["sub"], 
                authCode: this._getRandomAuthCode(), // generate 6 digits auth code (100000~999999)
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000), // * 60000 since the unit is minutes
            }).returning();
            if (!responseOfCreatingPassengerAuth || responseOfCreatingPassengerAuth.length === 0) {
                throw ClientCreatePassengerAuthException;
            }

            return result;
        });
    }
    /* ================================= Sign Up Passenger operations ================================= */


    /* ================================= Sign Up Ridder operations ================================= */
    async signUpRidderWithUserNameAndEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType> {
        // hash the password, then provide hash value to create the user
        // const hash = await bcrypt.hash(createPassengerDto.password, Number(this.config.get("SALT_OR_ROUND")));
        return await this.db.transaction(async (tx) => {
            const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")));
            const tempAccessToken = await this._tempSignToken(signUpDto.userName, signUpDto.email);

            const responseOfCreatingRidder = await tx.insert(RidderTable).values({
                userName: signUpDto.userName, 
                email: signUpDto.email, 
                password: hash, 
                accessToken: tempAccessToken.accessToken, 
            }).returning({
                id: RidderTable.id,
                email: RidderTable.email,
            });
            if (!responseOfCreatingRidder || responseOfCreatingRidder.length === 0) {
                throw ClientSignUpUserException;
            }

            const responseOfCreatingRidderInfo = await tx.insert(RidderInfoTable).values({
                userId: responseOfCreatingRidder[0].id,
            }).returning();
            if (!responseOfCreatingRidderInfo || responseOfCreatingRidderInfo.length === 0) {
                throw ClientCreatePassengerInfoException;
            }

            const responseOfCreatingRidderRecord = await tx.insert(RidderRecordTable).values({
                userId: responseOfCreatingRidder[0].id, 
            }).returning()
            if (!responseOfCreatingRidderRecord || responseOfCreatingRidderRecord.length === 0) {
                throw ClientCreateRidderRecordException;
            }

            const result = await this._signToken(responseOfCreatingRidder[0].id, responseOfCreatingRidder[0].email);
            if (!result) throw ApiGeneratingBearerTokenException;

            const responseOfUpdatingAccessToken = await tx.update(RidderTable).set({
                accessToken: result.accessToken, 
            }).where(eq(RidderTable.id, responseOfCreatingRidder[0].id))
              .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw ClientSignUpUserException;
            }

            const responseOfCreatingRidderAuth = await tx.insert(RidderAuthTable).values({
                userId: responseOfCreatingRidder[0].id, 
                isDefaultAuthenticated: true, 
                authCode: this._getRandomAuthCode(), 
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000), 
            }).returning();
            if (!responseOfCreatingRidderAuth || responseOfCreatingRidderAuth.length === 0) {
                throw ClientCreatePassengerAuthException;
            }

            return result;
        });
    }
    
    async signUpRidderWithGoogleAuth(googleSignUpDto: GoogleSignUpDto) {
        return await this.db.transaction(async (tx) => {
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl) throw ServerExtractGoogleAuthUrlEnvVariableException;

            const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + googleSignUpDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();

            const userName = await bcrypt.hash(googleSignUpDto.email.split('@')[0], Number(this.config.get("SALT_OR_ROUND_GOOGLE_USER_NAME")));
            const tempAccessToken = await this._tempSignToken(userName, googleSignUpDto.email);

            const responseOfCreatingRidder = await tx.insert(RidderTable).values({
                userName: userName, 
                email: googleSignUpDto.email, 
                password: "", 
                accessToken: tempAccessToken.accessToken, 
            }).returning({
                id: RidderTable.id, 
                email: RidderTable.email, 
            });
            if (!responseOfCreatingRidder || responseOfCreatingRidder.length === 0) {
                throw ClientSignUpUserException;
            }

            const responseOfCreatingRidderInfo = await tx.insert(RidderInfoTable).values({
                userId: responseOfCreatingRidder[0].id,
            }).returning();
            if (!responseOfCreatingRidderInfo || responseOfCreatingRidderInfo.length === 0) {
                throw ClientCreatePassengerInfoException;
            }

            const responseOfCreatingRidderRecord = await tx.insert(RidderRecordTable).values({
                userId: responseOfCreatingRidder[0].id, 
            }).returning()
            if (!responseOfCreatingRidderRecord || responseOfCreatingRidderRecord.length === 0) {
                throw ClientCreateRidderRecordException;
            }

            const result = await this._signToken(responseOfCreatingRidder[0].id, responseOfCreatingRidder[0].email);
            if (!result) throw ApiGeneratingBearerTokenException;

            const responseOfUpdatingAccessToken = await tx.update(RidderTable).set({
                accessToken: result.accessToken, 
            }).where(eq(RidderTable.id, responseOfCreatingRidder[0].id))
              .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw ClientSignUpUserException;
            }

            const responseOfCreatingRidderAuth = await tx.insert(RidderAuthTable).values({
                userId: responseOfCreatingRidder[0].id, 
                googleId: parseDataFromGoogleToken["sub"], 
                authCode: this._getRandomAuthCode(), 
                authCodeExpiredAt: new Date((new Date()).getTime() + Number(this.config.get("AUTH_CODE_EXPIRED_IN")) * 60000), 
            }).returning();
            if (!responseOfCreatingRidderAuth || responseOfCreatingRidderAuth.length === 0) {
                throw ClientCreatePassengerAuthException;
            }

            return result;
        });
    }
    /* ================================= Sign Up Ridder operations ================================= */


    /* ================================= Sign In Passenger operations ================================= */
    async signInPassengerWithAccountAndPassword(signInDto: SignInDto): Promise<AuthTokenType> {
        return await this.db.transaction(async (tx) => {
            let userResponse: any = null;
    
            if (signInDto.userName) {
                // find the user by userName
                userResponse = await tx.select({
                    id: PassengerTable.id,
                    email: PassengerTable.email,
                    hash: PassengerTable.password,
                    isDefaultAuthenticated: PassengerAuthTable.isDefaultAuthenticated, 
                }).from(PassengerTable)
                  .where(eq(PassengerTable.userName, signInDto.userName))
                  .leftJoin(PassengerAuthTable, eq(PassengerAuthTable.userId, PassengerTable.id))
                  .limit(1);

                if (!userResponse || userResponse.length === 0) {
                    throw ClientSignInUserNameNotFoundException;
                }
            } else if (signInDto.email) {
                // find the user by email
                userResponse = await tx.select({
                    id: PassengerTable.id,
                    email: PassengerTable.email,
                    hash: PassengerTable.password,
                    isDefaultAuthenticated: PassengerAuthTable.isDefaultAuthenticated, 
                }).from(PassengerTable)
                  .where(eq(PassengerTable.email, signInDto.email))
                  .leftJoin(PassengerAuthTable, eq(PassengerAuthTable.userId, PassengerTable.id))
                  .limit(1);

                if (!userResponse || userResponse.length === 0) {
                    throw ClientSignInEmailNotFoundException;
                }
            }

            const user = userResponse[0];
            if (!user.isDefaultAuthenticated) throw ClientUserAuthenticatedMethodNotAllowedException;

            const pwMatches = await bcrypt.compare(signInDto.password, user.hash);
            delete user.hash;

            if (!pwMatches) {
                throw ClientSignInPasswordNotMatchException;
            }

            const result = await this._signToken(user.id, user.email);
            if (!result) throw ApiGeneratingBearerTokenException;

            const responseOfUpdatingAccessToken = await tx.update(PassengerTable).set({
                accessToken: result.accessToken, 
            }).where(eq(PassengerTable.id, user.id))
              .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw ClientSignInUserException;
            }

            return result;
        })
    }

    async signInPassengerWithGoogleAuth(googleSignInDto: GoogleSignInDto) {
        return await this.db.transaction(async (tx) => {
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl) throw ServerExtractGoogleAuthUrlEnvVariableException;

            const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + googleSignInDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();
    
            // find the user by email which is parsed from google id token
            const userResponse = await tx.select({
                id: PassengerTable.id,
                email: PassengerTable.email,
                googleId: PassengerAuthTable.googleId, 
            }).from(PassengerTable)
                .where(eq(PassengerTable.email, parseDataFromGoogleToken["email"]))
                .leftJoin(PassengerAuthTable, eq(PassengerAuthTable.userId, PassengerTable.id))
                .limit(1);

            if (!userResponse || userResponse.length === 0) {
                throw ClientSignInEmailNotFoundException;
            }

            const user = userResponse[0];
            if (!user.googleId || user.googleId === null || parseDataFromGoogleToken["sub"] !== user.googleId) {
                throw ClientUserAuthenticatedMethodNotAllowedException;
            }

            const result = await this._signToken(user.id, user.email);
            if (!result) throw ApiGeneratingBearerTokenException;

            const responseOfUpdatingAccessToken = await tx.update(PassengerTable).set({
                accessToken: result.accessToken, 
            }).where(eq(PassengerTable.id, user.id))
              .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw ClientSignInUserException;
            }

            return result;
        });
    }
    /* ================================= Sign In Passenger operations ================================= */


    /* ================================= Sign In Ridder operations ================================= */
    async signInRidderWithAccountAndPassword(signInDto: SignInDto): Promise<AuthTokenType> {
        return await this.db.transaction(async (tx) => {
            let userResponse: any = null
    
            if (signInDto.userName) {
                // find the user by userName
                userResponse = await tx.select({
                    id: RidderTable.id,
                    email: RidderTable.email,
                    hash: RidderTable.password,
                    isDefaultAuthenticated: RidderAuthTable.isDefaultAuthenticated, 
                }).from(RidderTable)
                  .where(eq(RidderTable.userName, signInDto.userName))
                  .leftJoin(RidderAuthTable, eq(RidderAuthTable.userId, RidderTable.id))
                  .limit(1);

                if (!userResponse || userResponse.length === 0) {
                    throw ClientSignInUserNameNotFoundException;
                }
            } else if (signInDto.email) {
                // find the user by email
                userResponse = await tx.select({
                    id: RidderTable.id,
                    email: RidderTable.email,
                    hash: RidderTable.password,
                    isDefaultAuthenticated: RidderAuthTable.isDefaultAuthenticated, 
                }).from(RidderTable)
                  .where(eq(RidderTable.email, signInDto.email))
                  .leftJoin(RidderAuthTable, eq(RidderAuthTable.userId, RidderTable.id))
                  .limit(1);

                if (!userResponse || userResponse.length === 0) {
                    throw ClientSignInEmailNotFoundException;
                }
            }
            const user = userResponse[0];
            if (!user.isDefaultAuthenticated) throw ClientUserAuthenticatedMethodNotAllowedException;

            const pwMatches = await bcrypt.compare(signInDto.password, user.hash);
            delete user.hash;

            if (!pwMatches) {
                throw ClientSignInPasswordNotMatchException;
            }

            const result = await this._signToken(user.id, user.email);
            if (!result) throw ApiGeneratingBearerTokenException;

            const responseOfUpdatingAccessToken = await tx.update(RidderTable).set({
                accessToken: result.accessToken, 
            }).where(eq(RidderTable.id, user.id))
              .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw ClientSignUpUserException;
            }

            return result;
        });
    }

    async signInRidderWithGoogleAuth(googleSignInDto: GoogleSignInDto) {
        return await this.db.transaction(async (tx) => {
            const googleAuthUrl = this.config.get("GOOGLE_AUTH_URL");
            if (!googleAuthUrl) throw ServerExtractGoogleAuthUrlEnvVariableException;

            const parseDataFromGoogleTokenResponse = await fetch(googleAuthUrl + googleSignInDto.idToken);
            if (!parseDataFromGoogleTokenResponse.ok) {
                throw ClientInvalidGoogleIdTokenException;
            }
            const parseDataFromGoogleToken = await parseDataFromGoogleTokenResponse.json();

            const userResponse = await tx.select({
                id: RidderTable.id, 
                email: RidderTable.email, 
                googleId: RidderAuthTable.googleId, 
            }).from(RidderTable)
              .where(eq(RidderTable.email, parseDataFromGoogleToken["email"]))
              .leftJoin(RidderAuthTable, eq(RidderAuthTable.userId, RidderTable.id))
              .limit(1);

            if (!userResponse || userResponse.length === 0) {
                throw ClientSignInEmailNotFoundException;
            }

            const user = userResponse[0];
            if (!user.googleId || user.googleId === null || parseDataFromGoogleToken["sub"] !== user.googleId) {
                throw ClientUserAuthenticatedMethodNotAllowedException;
            }

            const result = await this._signToken(user.id, user.email);
            if (!result) throw ApiGeneratingBearerTokenException;

            const responseOfUpdatingAccessToken = await tx.update(RidderTable).set({
                accessToken: result.accessToken, 
            }).where(eq(RidderTable.id, user.id))
              .returning();
            if (!responseOfUpdatingAccessToken || responseOfUpdatingAccessToken.length === 0) {
                throw ClientSignInUserException;
            }

            return result;
        });
    }
    /* ================================= Sign In Ridder operations ================================= */


    /* ================================= Get Sign Token & Auth Code operations ================================= */
    // using userId and email to generate a token,
    // so that user can login without providing password
    // once they have provided before
    // (the token will be expired in the future)
    private async _signToken(
        userId: string,
        email: string,
    ): Promise<AuthTokenType> {
        try {
            const payload = {
                sub: userId,
                email: email,
            };
            const secret = this.config.get("JWT_SECRET");
    
            const token = await this.jwt.signAsync(payload, {
                expiresIn: this.config.get("JWT_TOKEN_EXPIRED_TIME") ?? '60m',
                secret: secret,
            })
    
            return {
                accessToken: token,
                expiredIn: this.config.get("JWT_TOKEN_EXPIRED_TIME") ?? '60m',
            }
        } catch (error) {
            throw error;
        }
    }

    // since we build a accessToken field for every users, 
    // and we mark it as not null and unique in our database, 
    // for the first time creating the user, 
    // we need to use something to make a random stuff just like the real token, 
    // this is for temporary, bcs we'll update the actual accessToken later
    private async _tempSignToken(
        userName: string, 
        email: string
    ): Promise<AuthTokenType> {
        try {
            const payload = {
                sub: userName, 
                email: email, 
            };
            const secret = this.config.get("JWT_TEMP_SECRET");

            const token = await this.jwt.signAsync(payload, {
                expiresIn: this.config.get("JWT_TEMP_TOKEN_EXPIRED_TIME") ?? '5m', 
                secret: secret, 
            });

            return {
                accessToken: token, 
                expiredIn: this.config.get("JWT_TEMP_TOKEN_EXPIRED_TIME") ?? '5m', 
            }
        } catch (error) {
            throw error;
        }
    }

    private _getRandomAuthCode(): string {
        let randomAuthCode = Math.floor(Math.random() * 1000000).toString()
		while (randomAuthCode.length < 6) randomAuthCode = "0" + randomAuthCode;
		return randomAuthCode;
    }
    /* ================================= Get Sign Token & Auth Code operations ================================= */
}