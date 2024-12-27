import { BadRequestException, Body, ConflictException, Controller, ForbiddenException, InternalServerErrorException, NotFoundException, PayloadTooLargeException, Post, Res, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { GoogleSignInDto, GoogleSignUpDto, SignInDto, SignUpDto } from "./dto/index";
import { ClientDuplicateFieldDetectedException, ClientSignInUserException, ClientSignUpUserException, ClientUnknownException } from "../exceptions";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /* ================================= Sign Up Passenger Operations ================================= */
    @Post('signUpPassengerWithUserNameAndEmailAndPassword')
    async signUpPassengerWithUserNameAndEmailAndPassword(
        @Body() signUpDto: SignUpDto,
        @Res() response: Response,
    ) {
        try {
            const res = await this.authService.signUpPassengerWithUserNameAndEmailAndPassword(signUpDto);

            if (!res) throw ClientSignUpUserException;

            response.status(HttpStatusCode.Created).send(res);
        } catch (error) {
            if (error.status === undefined) {  // conflict from database
                error = ClientDuplicateFieldDetectedException(error.message);
            } else if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof UnauthorizedException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }

    @Post('signUpPassengerWithGoogleAuth')
    async signUpPassengerWithGoogleAuth(
        @Body() googleSignUpDto: GoogleSignUpDto, 
        @Res() response: Response, 
    ) {
        try {
            const res = await this.authService.signUpPassengerWithGoogleAuth(googleSignUpDto);

            if (!res) throw ClientSignUpUserException;

            response.status(HttpStatusCode.Created).send(res);
        } catch (error) {
            if (error.status === undefined) {  // conflict from database
                error = ClientDuplicateFieldDetectedException(error.message);
            } else if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof UnauthorizedException
                || error instanceof InternalServerErrorException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    /* ================================= Sign Up Passenger Operations ================================= */


    /* ================================= Sign Up Ridder Operations ================================= */
    @Post('signUpRidderWithUserNameAndEmailAndPassword')
    async signUpRidderWithUserNameAndEmailAndPassword(
        @Body() signUpDto: SignUpDto,
        @Res() response: Response,
    ) {
        try {
            const res = await this.authService.signUpRidderWithUserNameAndEmailAndPassword(signUpDto);

            if (!res) throw ClientSignUpUserException;

            response.status(HttpStatusCode.Created).send(res);
        } catch (error) {
            if (error.status === undefined) {  // conflict from database
                error = ClientDuplicateFieldDetectedException(error.message);
            } else if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof UnauthorizedException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }

    @Post('signUpRidderWithGoogleAuth')
    async signUpRidderWithGoogleAuth(
        @Body() googleSignUpDto: GoogleSignUpDto,
        @Res() response: Response,
    ) {
        try {
            const res = await this.authService.signUpRidderWithGoogleAuth(googleSignUpDto);

            if (!res) throw ClientSignUpUserException;

            response.status(HttpStatusCode.Created).send(res);
        } catch (error) {
            if (error.status === undefined) {  // conflict from database
                error = ClientDuplicateFieldDetectedException(error.message);
            } else if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof UnauthorizedException
                || error instanceof InternalServerErrorException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    /* ================================= Sign Up Ridder Operations ================================= */


    /* ================================= Sign In Passenger Operations ================================= */
    @Post('signInPassengerWithAccountAndPassword')
    async signInPassengerWithAccountAndPassword(
        @Body() signInDto: SignInDto,
        @Res() response: Response,
    ) {
        try {
            const res = await this.authService.signInPassengerWithAccountAndPassword(signInDto);

            if (!res) throw ClientSignInUserException;

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof NotFoundException
                || error instanceof UnauthorizedException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }

    @Post('signInPassengerWithGoogleAuth')
    async signInPassengerWithGoogleAuth(
        @Body() googleSignInDto: GoogleSignInDto,
        @Res() response: Response,
    ) {
        try {
            const res = await this.authService.signInPassengerWithGoogleAuth(googleSignInDto);

            if (!res) throw ClientSignInUserException;

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof NotFoundException
                || error instanceof UnauthorizedException
                || error instanceof InternalServerErrorException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    /* ================================= Sign In Passenger Operations ================================= */


    /* ================================= Sign In Ridder Operations ================================= */
    @Post('signInRidderWithAccountAndPassword')
    async signInRidderWithAccountAndPassword(
        @Body() signInDto: SignInDto,
        @Res() response: Response,
    ) {
        try {
            const res = await this.authService.signInRidderWithAccountAndPassword(signInDto);

            if (!res) throw ClientSignInUserException;

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            console.log(error)
            if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof NotFoundException
                || error instanceof UnauthorizedException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }

    @Post('signInRidderWithGoogleAuth')
    async signInRidderWithGoogleAuth(
        @Body() googleSignInDto: GoogleSignInDto,
        @Res() response: Response,
    ) {
        try {
            const res = await this.authService.signInRidderWithGoogleAuth(googleSignInDto);

            if (!res) throw ClientSignInUserException;

            response.status(HttpStatusCode.Ok).send(res);
        } catch (error) {
            if (!(error instanceof BadRequestException
                || error instanceof ForbiddenException
                || error instanceof NotFoundException
                || error instanceof UnauthorizedException
                || error instanceof InternalServerErrorException)) {
                    error = ClientUnknownException;
            }

            response.status(error.status).send({
                ...error.response,
            });
        }
    }
    /* ================================= Sign In Ridder Operations ================================= */
}