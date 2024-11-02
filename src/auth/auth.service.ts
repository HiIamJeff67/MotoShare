import * as bcrypt from 'bcrypt';
import { ConflictException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DRIZZLE } from "../../src/drizzle/drizzle.module";
import { DrizzleDB } from "../../src/drizzle/types/drizzle";
import { SignInDto } from "./dto/signIn.dto";
import { SignUpDto } from "./dto/signUp.dto";

import { PassengerTable } from "../../src/drizzle/schema/passenger.schema";
import { PassengerInfoTable } from '../../src/drizzle/schema/passengerInfo.schema';
import { RidderTable } from '../../src/drizzle/schema/ridder.schema';
import { RidderInfoTable } from '../../src/drizzle/schema/ridderInfo.schema';

import { AuthTokenType } from '../../src/interfaces/auth.interface';

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

        if (!response) {
            throw new ConflictException(`Duplicate userName or email detected`)
        }

        const responseOfCreatingInfo = this.createPassengerInfoByUserId(response[0].id);
        
        if (!responseOfCreatingInfo) {
            throw new Error('Cannot create the info for current passenger')
        }

        return this.signToken(response[0].id, response[0].email);
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

        if (!response) {
            throw new ConflictException(`Duplicate userName or email detected`)
        }

        const responseOfCreatingInfo = this.createRidderInfoByUserId(response[0].id);
        
        if (!responseOfCreatingInfo) {
            throw new Error('Cannot create the info for current passenger')
        }

        return this.signToken(response[0].id, response[0].email);
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
        } else if (signInDto.email) {
            // find the user by email
            userResponse = await this.db.select({
                id: PassengerTable.id,
                email: PassengerTable.email,
                hash: PassengerTable.password,
            }).from(PassengerTable)
            .where(eq(PassengerTable.email, signInDto.email))
            .limit(1);
        }
            
        if (!userResponse || userResponse.length === 0) {
            throw new ForbiddenException('Credential incorrect');
        }

        const user = userResponse[0];
        const pwMatches = await bcrypt.compare(signInDto.password, user.hash);
        delete user.hash;

        if (!pwMatches) {
            throw new ForbiddenException('Credential incorrect');
        }

        return this.signToken(user.id, user.email);
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
            }).from(RidderTable)
            .where(eq(RidderTable.userName, signInDto.userName))
            .limit(1);
        } else if (signInDto.email) {
            // find the user by email
            userResponse = await this.db.select({
                id: RidderTable.id,
                email: RidderTable.email,
            }).from(RidderTable)
            .where(eq(RidderTable.email, signInDto.email))
            .limit(1);
        }
            
        if (!userResponse || userResponse.length === 0) {
            throw new ForbiddenException('Credential incorrect');
        }

        const user = userResponse[0];
        const pwMatches = await bcrypt.compare(signInDto.password, user.hash);

        if (!pwMatches) {
            throw new ForbiddenException('Credential incorrect');
        }

        return this.signToken(user.id, user.email);
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
    }
    /* ================================= Get Sign Token Operations ================================= */
}