import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signUp.dto";
import { Response } from "express";
import { SignInDto } from "./dto/signIn.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpPassengerWithEmailAndPassword(signUpDto: SignUpDto, response: Response): Promise<void>;
    signInPassengerWithAccountAndPassword(signInDto: SignInDto, response: Response): Promise<void>;
    signUpRidderWithEmailAndPassword(signUpDto: SignUpDto, response: Response): Promise<void>;
}
