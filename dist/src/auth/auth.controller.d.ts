import { AuthService } from "./auth.service";
import { Response } from "express";
import { GoogleSignInDto, GoogleSignUpDto, SignInDto, SignUpDto } from "./dto/index";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpPassengerWithUserNameAndEmailAndPassword(signUpDto: SignUpDto, response: Response): Promise<void>;
    signUpPassengerWithGoogleAuth(googleSignUpDto: GoogleSignUpDto, response: Response): Promise<void>;
    signUpRidderWithUserNameAndEmailAndPassword(signUpDto: SignUpDto, response: Response): Promise<void>;
    signUpRidderWithGoogleAuth(googleSignUpDto: GoogleSignUpDto, response: Response): Promise<void>;
    signInPassengerWithAccountAndPassword(signInDto: SignInDto, response: Response): Promise<void>;
    signInPassengerWithGoogleAuth(googleSignInDto: GoogleSignInDto, response: Response): Promise<void>;
    signInRidderWithAccountAndPassword(signInDto: SignInDto, response: Response): Promise<void>;
    signInRidderWithGoogleAuth(googleSignInDto: GoogleSignInDto, response: Response): Promise<void>;
}
