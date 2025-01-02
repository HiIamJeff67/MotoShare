import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, UnauthorizedException, NotFoundException, InternalServerErrorException, NotAcceptableException, ConflictException, BadRequestException } from '@nestjs/common';
import { RidderAuthService } from './ridderAuth.service';
import { JwtRidderGuard } from '../auth/guard';
import { Ridder } from '../auth/decorator';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { ClientRidderAuthNotFoundException, ClientRidderNotFoundException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';
import { BindRidderDefaultAuthDto, BindRidderGoogleAuthDto, ResetRidderPasswordDto, UpdateRidderEmailPasswordDto, ValidateRidderInfoDto } from './dto/update-ridderAuth.dto';
import { SendAuthCodeByEmailDto } from './dto/create-ridderAuth.dto';

@Controller('ridderAuth')
export class RidderAuthController {
  constructor(private readonly ridderAuthService: RidderAuthService) {}

  /* ================================= Send AuthCode ================================= */
  @UseGuards(JwtRidderGuard)
  @Get('sendAuthCodeForEmail')
  async sendAuthCodeForEmail(
      @Ridder() ridder: RidderType, 
      @Res() response: Response, 
  ) {
      try {
          const res = await this.ridderAuthService.sendAuthenticationCodeById(
              ridder.id, 
              "Vaildate Your Email", 
          );
          
          if (!res || res.length === 0) throw ClientRidderNotFoundException;

          response.status(HttpStatusCode.Ok).send(res[0]);
      } catch (error) {
          if (!(error instanceof UnauthorizedException
              || error instanceof NotFoundException
              || error instanceof InternalServerErrorException)) {
                  error = ClientUnknownException;
          }

          response.status(error.status).send({
              ...error.response, 
          });
      }
  }

  @Get('sendAuthCodeToResetForgottenPassword')
  async sendAuthCodeToResetForgottenPassword(
      @Body() sendAuthCodeByEmailDto: SendAuthCodeByEmailDto, 
      @Res() response: Response, 
  ) {
      try {
          const res = await this.ridderAuthService.sendAuthenticationCodeById(
                sendAuthCodeByEmailDto.email, 
              "Reset Your Password", 
          );
          
          if (!res || res.length === 0) throw ClientRidderNotFoundException;

          response.status(HttpStatusCode.Ok).send(res[0]);
      } catch (error) {
          if (!(error instanceof NotFoundException
              || error instanceof InternalServerErrorException)) {
                  error = ClientUnknownException;
          }

          response.status(error.status).send({
              ...error.response, 
          });
      }
  }

  @UseGuards(JwtRidderGuard)
  @Get('sendAuthCodeToResetEmailOrPassword')
  async sendAuthCodeToResetEmailOrPassword(
      @Ridder() ridder: RidderType, 
      @Res() response: Response, 
  ) {
      try {
          const res = await this.ridderAuthService.sendAuthenticationCodeById(
              ridder.id, 
              "Reset Your Email or Password"
          );
          
          if (!res || res.length === 0) throw ClientRidderNotFoundException;

          response.status(HttpStatusCode.Ok).send(res[0]);
      } catch (error) {
          if (!(error instanceof UnauthorizedException
              || error instanceof NotFoundException
              || error instanceof InternalServerErrorException)) {
                  error = ClientUnknownException;
          }

          response.status(error.status).send({
              ...error.response, 
          });
      }
  }
  /* ================================= Send AuthCode ================================= */


  /* ================================= Get Operations ================================= */
      @UseGuards(JwtRidderGuard)
      @Get('getMyAuth')
      async getMyAuth(
          @Ridder() ridder: RidderType, 
          @Res() response: Response, 
      ) {
          try {
              const res = await this.ridderAuthService.getRidderAuthByUserId(ridder.id);
  
              if (!res || res.length === 0) throw ClientRidderAuthNotFoundException;
  
              response.status(HttpStatusCode.Ok).send(res[0]);
          } catch (error) {
              if (!(error instanceof UnauthorizedException
                  || error instanceof NotFoundException)) {
                      error = ClientUnknownException;
              }
  
              response.status(error.status).send({
                  ...error.response, 
              });
          }
      }
      /* ================================= Get Operations ================================= */


  /* ================================= Validate AuthCode ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('validateAuthCodeForEmail')
  async validateAuthCodeForEmail(
      @Ridder() ridder: RidderType, 
      @Body() validateRidderInfoDto: ValidateRidderInfoDto, 
      @Res() response: Response, 
  ) {
      try {
          const res = await this.ridderAuthService.validateAuthCodeForEmail(
              ridder.id, 
              validateRidderInfoDto, 
          );

          if (!res || res.length === 0) throw ClientRidderNotFoundException;

          response.status(HttpStatusCode.Ok).send(res[0]);
      } catch (error) {
          if (!(error instanceof UnauthorizedException
              || error instanceof NotFoundException
              || error instanceof NotAcceptableException
              || error instanceof InternalServerErrorException)) {
                  error = ClientUnknownException;
          }

          response.status(error.status).send({
              ...error.response, 
          });
      }
  }

  @Post('validateAuthCodeToResetForgottenPassword')
  async validateAuthCodeToResetForgottenPassword(
      @Body() resetRidderPasswordDto: ResetRidderPasswordDto, 
      @Res() response: Response, 
  ) {
      try {
          const res = await this.ridderAuthService.validateAuthCodeToResetForgottenPassword(
              resetRidderPasswordDto, 
          );

          if (!res || res.length === 0) throw ClientRidderNotFoundException;

          response.status(HttpStatusCode.Ok).send(res[0]);
      } catch (error) {
          if (!(error instanceof NotFoundException
              || error instanceof NotAcceptableException
              || error instanceof ConflictException)) {
                  error = ClientUnknownException;
          }

          response.status(error.status).send({
              ...error.response, 
          });
      }
  }

  @UseGuards(JwtRidderGuard)
  @Post('validateAuthCodeToResetEmailOrPassword')
  async validateAuthCodeToResetEmailOrPassword(
      @Ridder() ridder: RidderType, 
      @Body() updateRidderEmailPasswordDto: UpdateRidderEmailPasswordDto, 
      @Res() response: Response, 
  ) {
      try {
          const res = await this.ridderAuthService.validateAuthCodeToResetEmailOrPassword(
              ridder.id, 
              updateRidderEmailPasswordDto, 
          );

          if (!res || res.length === 0) throw ClientRidderNotFoundException;

          response.status(HttpStatusCode.Ok).send(res[0]);
      } catch (error) {
          if (!(error instanceof UnauthorizedException
              || error instanceof NotFoundException
              || error instanceof NotAcceptableException
              || error instanceof ConflictException
              || error instanceof BadRequestException)) {
                  error = ClientUnknownException;
          }

          response.status(error.status).send({
              ...error.response, 
          });
      }
  }
  /* ================================= Validate AuthCode ================================= */


  /* ================================= Binding Operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('bindDefaultAuth')
  async bindDefaultAuth(
      @Ridder() ridder: RidderType, 
      @Body() bindRidderDefaultAuthDto: BindRidderDefaultAuthDto, 
      @Res() response: Response, 
  ) {
      try {
          const res = await this.ridderAuthService.bindDefaultAuth(
              ridder.id, 
              bindRidderDefaultAuthDto, 
          );

          if (!res || res.length === 0) throw ClientRidderNotFoundException;

          response.status(HttpStatusCode.Ok).send(res[0]);
      } catch (error) {
          if (!(error instanceof UnauthorizedException
              || error instanceof NotFoundException
              || error instanceof NotAcceptableException
              || error instanceof ConflictException)) {
                  error = ClientUnknownException;
          }

          response.status(error.status).send({
              ...error.response, 
          });
      }
  }

  @UseGuards(JwtRidderGuard)
  @Post('bindGoogleAuth')
  async bindGoogleAuth(
      @Ridder() ridder: RidderType, 
      @Body() bindRidderGoogleAuthDto: BindRidderGoogleAuthDto, 
      @Res() response: Response, 
  ) {
      try {
          const res = await this.ridderAuthService.bindGoogleAuth(
              ridder.id, 
              bindRidderGoogleAuthDto, 
          );

          if (!res || res.length === 0) throw ClientRidderNotFoundException;

          response.status(HttpStatusCode.Ok).send(res[0]);
      } catch (error) {
          if (!(error instanceof UnauthorizedException
              || error instanceof NotFoundException
              || error instanceof NotAcceptableException
              || error instanceof ConflictException)) {
                  error = ClientUnknownException;
          }

          response.status(error.status).send({
              ...error.response, 
          });
      }
  }
  /* ================================= Binding Operations ================================= */
}
