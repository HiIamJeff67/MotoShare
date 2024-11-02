import { Body, ConflictException, Controller, PayloadTooLargeException, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signUp.dto";
import { Response } from "express";
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { SignInDto } from "./dto/signIn.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signUpPassenger')
    async signUpPassengerWithEmailAndPassword(
        @Body() signUpDto: SignUpDto,
        @Res() response: Response,
    ) {
        try {
            if (signUpDto.userName && signUpDto.userName.length > 20) {
                throw new PayloadTooLargeException("User name cannot be longer than 20 characters")
            }

            const passengerResponse = await this.authService.signUpPassengerWithEmailAndPassword(signUpDto);

            response.status(HttpStatusCode.Created).send({
                ...passengerResponse,
            });
        } catch (error) {
                response.status(
                    error instanceof PayloadTooLargeException
                    ? HttpStatusCode.PayloadTooLarge
                    : (error instanceof ConflictException
                        ? HttpStatusCode.Conflict
                        : HttpStatusCode.UnknownError ?? 520
                    )
                ).send({
                    message: error.message,
                });
        }
    }

    @Post('signInPassenger')
    async signInPassengerWithAccountAndPassword(
        @Body() signInDto: SignInDto,
        @Res() response: Response,
    ) {
        try {
            if (signInDto.userName && signInDto.userName.length > 20) {
                throw new PayloadTooLargeException("User name cannot be longer than 20 characters")
            }

            const passengerRespose = await this.authService.signInPassengerEmailAndPassword(signInDto);

            response.status(HttpStatusCode.Ok).send({
                ...passengerRespose,
            })
        } catch (error) {
            response.status(
                error instanceof PayloadTooLargeException
                ? HttpStatusCode.PayloadTooLarge
                : (error instanceof ConflictException
                    ? HttpStatusCode.Conflict
                    : HttpStatusCode.UnknownError ?? 520
                )
            ).send({
                message: error.message,
            });
        }
    }
}