import { BadRequestException, Body, ConflictException, Controller, ForbiddenException, InternalServerErrorException, NotFoundException, PayloadTooLargeException, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { SignInDto, SignUpDto } from "./dto/index";
import { ClientDuplicateFieldDetectedException, ClientSignInUserException, ClientSignUpUserException, ClientUnknownException } from "../exceptions";

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
            const res = await this.authService.signUpPassengerWithEmailAndPassword(signUpDto);

            if (!res) throw ClientSignUpUserException;

            response.status(HttpStatusCode.Created).send(res);
        } catch (error) {
            if (error.status === undefined) {  // conflict from database
                error = ClientDuplicateFieldDetectedException(error.message);
            } else if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
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
            const res = await this.authService.signUpRidderWithEmailAndPassword(signUpDto);

            if (!res) throw ClientSignUpUserException;

            response.status(HttpStatusCode.Created).send(res);
        } catch (error) {
            if (error.status === undefined) {  // conflict from database
                error = ClientDuplicateFieldDetectedException(error.message);
            } else if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
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
            const res = await this.authService.signInPassengerEmailAndPassword(signInDto);

            if (!res) throw ClientSignInUserException;

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof NotFoundException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
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
            const res = await this.authService.signInRidderByEmailAndPassword(signInDto);

            if (!res) throw ClientSignInUserException;

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof NotFoundException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    /* ================================= Sign In Ridder Operations ================================= */
}