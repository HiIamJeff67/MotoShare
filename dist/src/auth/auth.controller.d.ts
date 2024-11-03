import { AuthService } from "./auth.service";
import { Response } from "express";
import { SignInDto, SignUpDto } from "./dto/index";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpPassengerWithEmailAndPassword(signUpDto: SignUpDto, response: Response): Promise<void>;
    signUpRidderWithEmailAndPassword(signUpDto: SignUpDto, response: Response): Promise<void>;
    signInPassengerWithAccountAndPassword(signInDto: SignInDto, response: Response): Promise<void>;
    signInRidderWithAccountAndPassword(signInDto: SignInDto, response: Response): Promise<void>;
}
