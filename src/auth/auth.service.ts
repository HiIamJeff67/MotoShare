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
    ClientSignInEmailNotFoundException, 
    ClientSignInPasswordNotMatchException, 
    ClientSignInUserNameNotFoundException, 
    ClientSignUpUserException, 
} from '../exceptions';

import { PassengerTable } from "../../src/drizzle/schema/passenger.schema";
import { PassengerInfoTable } from '../../src/drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../../src/drizzle/schema/ridder.schema';

import { SignInDto, SignUpDto } from "./dto/index";
import { RidderInfoTable } from '../drizzle/schema/ridderInfo.schema';

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        @Inject(DRIZZLE) private db: DrizzleDB,
        private jwt: JwtService,
    ) {}

    /* ================================= Sign Up Passenger Operations ================================= */
    async signUpPassengerWithUserNameAndEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType> {
        // hash the password, then provide hash value to create the user
        // const hash = await bcrypt.hash(createPassengerDto.password, Number(this.config.get("SALT_OR_ROUND")));
        return await this.db.transaction(async (tx) => {
            const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")));

            const responseOfCreatingPassenger = await tx.insert(PassengerTable).values({
                userName: signUpDto.userName,
                email: signUpDto.email,
                password: hash,
            }).returning({
                id: PassengerTable.id,
                email: PassengerTable.email,
            });
            if (!responseOfCreatingPassenger) throw ClientSignUpUserException;

            const responseOfCreatingInfo = await tx.insert(PassengerInfoTable).values({
                userId: responseOfCreatingPassenger[0].id,
            });
            if (!responseOfCreatingInfo) throw ClientCreatePassengerInfoException;

            const result = await this.signToken(responseOfCreatingPassenger[0].id, responseOfCreatingPassenger[0].email);
            return result;
        });
    }
    /* ================================= Sign Up Passenger Operations ================================= */


    /* ================================= Sign Up Ridder Operations ================================= */
    async signUpRidderWithEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType> {
        // hash the password, then provide hash value to create the user
        // const hash = await bcrypt.hash(createPassengerDto.password, Number(this.config.get("SALT_OR_ROUND")));
        return await this.db.transaction(async (tx) => {
            const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")));

            const responseOfCreatingRidder = await tx.insert(RidderTable).values({
                userName: signUpDto.userName,
                email: signUpDto.email,
                password: hash,
            }).returning({
                id: RidderTable.id,
                email: RidderTable.email,
            });
            if (!responseOfCreatingRidder) throw ClientSignUpUserException;

            const responseOfCreatingInfo = await tx.insert(RidderInfoTable).values({
                userId: responseOfCreatingRidder[0].id,
            });
            if (!responseOfCreatingInfo) throw ClientCreatePassengerInfoException;

            const result = await this.signToken(responseOfCreatingRidder[0].id, responseOfCreatingRidder[0].email);
            return result;
        });
    }
    /* ================================= Sign Up Ridder Operations ================================= */



    /* ================================= Sign In Passenger Operations ================================= */
    async signInPassengerEmailAndPassword(signInDto: SignInDto): Promise<AuthTokenType> {
        let userResponse: any = null
    
        if (signInDto.userName) {
            // find the user by userName
            userResponse = await this.db.select({
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
            userResponse = await this.db.select({
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

        const result = await this.signToken(user.id, user.email);
        if (!result) throw ApiGeneratingBearerTokenException;
        return result;
    }
    /* ================================= Sign In Passenger Operations ================================= */



    /* ================================= Sign In Ridder Operations ================================= */
    async signInRidderByEmailAndPassword(signInDto: SignInDto): Promise<AuthTokenType> {
        let userResponse: any = null
    
        if (signInDto.userName) {
            // find the user by userName
            userResponse = await this.db.select({
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
            userResponse = await this.db.select({
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

        const result = await this.signToken(user.id, user.email);
        if (!result) throw ApiGeneratingBearerTokenException;
        return result;
    }
    /* ================================= Sign In Ridder Operations ================================= */



    /* ================================= Get Sign Token Operations ================================= */
    // using userId and email to generate a token,
    // so that user can login without providing password
    // once they have provided before
    // (the token will be expired in the future)
    async signToken(
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
    /* ================================= Get Sign Token Operations ================================= */
}