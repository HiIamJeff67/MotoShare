import { Body, ConflictException, Controller, NotFoundException, PayloadTooLargeException, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { SignInDto, SignUpDto } from "./dto/index";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /* ================================= Sign Up Passenger Operations ================================= */
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
    /* ================================= Sign Up Passenger Operations ================================= */



    /* ================================= Sign Up Ridder Operations ================================= */
    @Post('signUpRidder')
    async signUpRidderWithEmailAndPassword(
        @Body() signUpDto: SignUpDto,
        @Res() response: Response,
    ) {
        try {
            if (signUpDto.userName && signUpDto.userName.length > 20) {
                throw new PayloadTooLargeException("User name cannot be longer than 20 characters")
            }

            const passengerResponse = await this.authService.signUpRidderWithEmailAndPassword(signUpDto);

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
    /* ================================= Sign Up Ridder Operations ================================= */



    /* ================================= Sign In Passenger Operations ================================= */
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
                    : (error instanceof NotFoundException
                        ? HttpStatusCode.NotFound
                        : HttpStatusCode.UnknownError ?? 520
                    )
                )
            ).send({
                message: error.message,
            });
        }
    }
    /* ================================= Sign In Passenger Operations ================================= */



    /* ================================= Sign In Ridder Operations ================================= */
    @Post('signInRidder')
    async signInRidderWithAccountAndPassword(
        @Body() signInDto: SignInDto,
        @Res() response: Response,
    ) {
        try {
            if (signInDto.userName && signInDto.userName.length > 20) {
                throw new PayloadTooLargeException("User name cannot be longer than 20 characters")
            }

            const ridderResponse = await this.authService.signInRidderByEmailAndPassword(signInDto);

            response.status(HttpStatusCode.Ok).send({
                ...ridderResponse,
            })
        } catch (error) {
            response.status(
                error instanceof PayloadTooLargeException
                ? HttpStatusCode.PayloadTooLarge
                : (error instanceof ConflictException
                    ? HttpStatusCode.Conflict
                    : (error instanceof NotFoundException
                        ? HttpStatusCode.NotFound
                        : HttpStatusCode.UnknownError ?? 520
                    )
                )
            ).send({
                message: error.message,
            });
        }
    }
    /* ================================= Sign In Ridder Operations ================================= */
}