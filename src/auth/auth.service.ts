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
} from '../exceptions';

import { PassengerTable } from "../../src/drizzle/schema/passenger.schema";
import { PassengerInfoTable } from '../../src/drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../../src/drizzle/schema/ridder.schema';

import { SignInDto, SignUpDto } from "./dto/index";
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';
import { PassengerAuthTable } from '../drizzle/schema/passengerAuth.schema';
import { RidderAuthTable } from '../drizzle/schema/ridderAuth.schema';

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
    async signUpRidderWithEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType> {
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
    async signInPassengerEmailAndPassword(signInDto: SignInDto): Promise<AuthTokenType> {
        return await this.db.transaction(async (tx) => {
            let userResponse: any = null
    
            if (signInDto.userName) {
                // find the user by userName
                userResponse = await tx.select({
                    id: PassengerTable.id,
                    email: PassengerTable.email,
                    hash: PassengerTable.password,
                }).from(PassengerTable)
                .where(eq(PassengerTable.userName, signInDto.userName))
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
                }).from(PassengerTable)
                .where(eq(PassengerTable.email, signInDto.email))
                .limit(1);

                if (!userResponse || userResponse.length === 0) {
                    throw ClientSignInEmailNotFoundException;
                }
            }

            const user = userResponse[0];
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
    /* ================================= Sign In Passenger operations ================================= */



    /* ================================= Sign In Ridder operations ================================= */
    async signInRidderByEmailAndPassword(signInDto: SignInDto): Promise<AuthTokenType> {
        return await this.db.transaction(async (tx) => {
            let userResponse: any = null
    
            if (signInDto.userName) {
                // find the user by userName
                userResponse = await tx.select({
                    id: RidderTable.id,
                    email: RidderTable.email,
                    hash: RidderTable.password,
                }).from(RidderTable)
                .where(eq(RidderTable.userName, signInDto.userName))
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
                }).from(RidderTable)
                .where(eq(RidderTable.email, signInDto.email))
                .limit(1);

                if (!userResponse || userResponse.length === 0) {
                    throw ClientSignInEmailNotFoundException;
                }
            }
            const user = userResponse[0];
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
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }
    /* ================================= Get Sign Token & Auth Code operations ================================= */
}