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
    ClientCreateRidderInfoException, 
    ClientSignInEmailNotFoundException, 
    ClientSignInPasswordNotMatchException, 
    ClientSignInUserNameNotFoundException, 
    ClientSignUpUserException, 
} from '../exceptions';

import { PassengerTable } from "../../src/drizzle/schema/passenger.schema";
import { PassengerInfoTable } from '../../src/drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../../src/drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../../src/drizzle/schema/ridderInfo.schema';

import { SignInDto, SignUpDto } from "./dto/index";

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        @Inject(DRIZZLE) private db: DrizzleDB,
        private jwt: JwtService,
    ) {}

    /* ================================= Sign Up Passenger Operations ================================= */
    async signUpPassengerWithEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType> {
        // hash the password, then provide hash value to create the user
        // const hash = await bcrypt.hash(createPassengerDto.password, Number(this.config.get("SALT_OR_ROUND")));
        const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")))

        const response = await this.db.insert(PassengerTable).values({
            userName: signUpDto.userName,
            email: signUpDto.email,
            password: hash,
        }).returning({
            id: PassengerTable.id,  // require a token
            email: PassengerTable.email,
        });
        if (!response) throw ClientSignUpUserException;

        const responseOfCreatingInfo = this.createPassengerInfoByUserId(response[0].id);
        if (!responseOfCreatingInfo) throw ClientCreatePassengerInfoException;

        const result = await this.signToken(response[0].id, response[0].email);
        if (!result) throw ApiGeneratingBearerTokenException;
        return result;
    }
    async createPassengerInfoByUserId(userId: string) {
        return await this.db.insert(PassengerInfoTable).values({
            userId: userId
        })
        // we don't return anything here, since we don't have to
        //   .returning({
        //     id: PassengerInfoTable.id,
        //     userId: PassengerInfoTable.userId,
        //   });
    }
    /* ================================= Sign Up Passenger Operations ================================= */



    /* ================================= Sign Up Ridder Operations ================================= */
    async signUpRidderWithEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType> {
        // hash the password, then provide hash value to create the user
        // const hash = await bcrypt.hash(createPassengerDto.password, Number(this.config.get("SALT_OR_ROUND")));
        const hash = await bcrypt.hash(signUpDto.password, Number(this.config.get("SALT_OR_ROUND")))

        const response = await this.db.insert(RidderTable).values({
            userName: signUpDto.userName,
            email: signUpDto.email,
            password: hash,
        }).returning({
            id: RidderTable.id,  // require a token
            email: RidderTable.email,
        });
        if (!response) throw ClientSignUpUserException;

        const responseOfCreatingInfo = this.createRidderInfoByUserId(response[0].id);
        if (!responseOfCreatingInfo) throw ClientCreateRidderInfoException;

        const result = await this.signToken(response[0].id, response[0].email);
        if (!result) throw ApiGeneratingBearerTokenException;
        return result;
    }
    async createRidderInfoByUserId(userId: string) {
        return await this.db.insert(RidderInfoTable).values({
            userId: userId
        })
        // we don't return anything here, since we don't have to
        //   .returning({
        //     id: RidderInfoTable.id,
        //     userId: RidderInfoTable.userId,
        //   });
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