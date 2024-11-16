import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DrizzleDB } from "../../src/drizzle/types/drizzle";
import { AuthTokenType } from '../../src/interfaces/auth.interface';
import { SignInDto, SignUpDto } from "./dto/index";
export declare class AuthService {
    private config;
    private db;
    private jwt;
    constructor(config: ConfigService, db: DrizzleDB, jwt: JwtService);
    signUpPassengerWithUserNameAndEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType>;
    signUpRidderWithEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType>;
    signInPassengerEmailAndPassword(signInDto: SignInDto): Promise<AuthTokenType>;
    signInRidderByEmailAndPassword(signInDto: SignInDto): Promise<AuthTokenType>;
    signToken(userId: string, email: string): Promise<AuthTokenType>;
}
