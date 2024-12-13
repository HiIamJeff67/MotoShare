import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { DrizzleDB } from "../../src/drizzle/types/drizzle";
import { AuthTokenType } from '../../src/interfaces/auth.interface';
import { GoogleSignInDto, GoogleSignUpDto, SignInDto, SignUpDto } from "./dto/index";
export declare class AuthService {
    private config;
    private db;
    private jwt;
    constructor(config: ConfigService, db: DrizzleDB, jwt: JwtService);
    signUpPassengerWithUserNameAndEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType>;
    signUpPassengerWithGoogleAuth(googleSignUpDto: GoogleSignUpDto): Promise<AuthTokenType>;
    signUpRidderWithUserNameAndEmailAndPassword(signUpDto: SignUpDto): Promise<AuthTokenType>;
    signUpRidderWithGoogleAuth(googleSignUpDto: GoogleSignUpDto): Promise<AuthTokenType>;
    signInPassengerWithAccountAndPassword(signInDto: SignInDto): Promise<AuthTokenType>;
    signInPassengerWithGoogleAuth(googleSignInDto: GoogleSignInDto): Promise<AuthTokenType>;
    signInRidderWithAccountAndPassword(signInDto: SignInDto): Promise<AuthTokenType>;
    signInRidderWithGoogleAuth(googleSignInDto: GoogleSignInDto): Promise<AuthTokenType>;
    private _signToken;
    private _tempSignToken;
    private _getRandomAuthCode;
}
