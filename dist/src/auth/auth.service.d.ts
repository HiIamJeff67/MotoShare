import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DrizzleDB } from "../../src/drizzle/types/drizzle";
import { SignInDto } from "./dto/signIn.dto";
import { SignUpDto } from "./dto/signUp.dto";
import { AuthTokenType } from '../../src/interfaces/auth.interface';
export declare class AuthService {
    private config;
    private db;
    private jwt;
    constructor(config: ConfigService, db: DrizzleDB, jwt: JwtService);
    signUpPassengerWithEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType>;
    createPassengerInfoByUserId(userId: string): Promise<import("pg").QueryResult<never>>;
    signUpRidderWithEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType>;
    createRidderInfoByUserId(userId: string): Promise<import("pg").QueryResult<never>>;
    signInPassengerEmailAndPassword(signInDto: SignInDto): Promise<AuthTokenType>;
    signInRidderByEmailAndPassword(signInDto: SignInDto): Promise<AuthTokenType>;
    signToken(userId: string, email: string): Promise<AuthTokenType>;
}
