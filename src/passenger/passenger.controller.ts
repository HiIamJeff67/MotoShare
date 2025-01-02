import { 
  Controller, UseGuards, 
  Get, Body, Delete, Query, Res, 
  NotFoundException, 
  ConflictException, 
  UnauthorizedException, 
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Post,
  NotAcceptableException,
  Patch,
  InternalServerErrorException
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { 
  ApiMissingParameterException, 
  ClientUnknownException, 
  ClientPassengerNotFoundException, 
  ClientCollectionNotFoundException, 
  ApiSearchingLimitTooLargeException,
  ApiSearchingLimitLessThanZeroException,
  ServerAllowedPhoneNumberException
} from '../exceptions';

import { JwtPassengerGuard } from '../../src/auth/guard/jwt-passenger.guard';
import { PassengerType, RidderType } from '../../src/interfaces/auth.interface';
import { Passenger, Ridder } from '../auth/decorator';

import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeletePassengerDto } from './dto/delete-passenger.dto';
import { toNumber } from '../utils/stringParser';
import { MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from '../constants';
import { AnyGuard, JwtRidderGuard } from '../auth/guard';
import { AllowedPhoneNumberTypes, PhoneNumberRegex } from '../types';

@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}
  
  /* ================================= Get operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Get('getMe')
  getMe(
    @Passenger() passenger: PassengerType,  // mainly the method to get the id of current passenger
    @Res() response: Response,
  ) {  
    // will throw "401, unauthorized" if the bearer token is invalid or expired
    try {
      response.status(HttpStatusCode.Ok).send({
        userName: passenger.userName, 
        email: passenger.email, 
      });
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response
      });
    }
  }

  @UseGuards(new AnyGuard([JwtRidderGuard, JwtPassengerGuard]))
  @Get('getPassengerWithInfoByUserName')
  async getPassengerWithInfoByUserName(
    // @Passenger() passenger: PassengerType,
    // @Ridder() ridder: RidderType, 
    @Query('userName') userName: string,
    @Res() response: Response,
  ) {
    try {
      if (!userName) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerService.getPassengerWithInfoByUserName(userName);

      if (!res) throw ClientPassengerNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof BadRequestException 
        || error instanceof UnauthorizedException 
        || error instanceof NotFoundException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @UseGuards(new AnyGuard([JwtPassengerGuard, JwtRidderGuard]))
  @Get('getPassengerWithInfoByPhoneNumber')
  async getPassengerWithInfoByPhoneNumber(
    // @Passenger() passenger: PassengerType,
    // @Ridder() ridder: RidderType, 
    @Query('phoneNumber') phoneNumber: string,
    @Res() response: Response,
  ) {
    try {
      if (!phoneNumber) {
        throw ApiMissingParameterException;
      }
      for (const allowedPhoneNumber of AllowedPhoneNumberTypes) {
        if (PhoneNumberRegex[allowedPhoneNumber].test(phoneNumber)) break;
        throw ServerAllowedPhoneNumberException;
      }

      const res = await this.passengerService.getPassengerWithInfoByPhoneNumber(phoneNumber);

      if (!res) throw ClientPassengerNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      if (!(error instanceof BadRequestException 
        || error instanceof UnauthorizedException 
        || error instanceof NotFoundException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @UseGuards(JwtPassengerGuard)
  @Get('getMyInfo')
  async getMyInfo(
    @Passenger() passenger: PassengerType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.getPassengerWithInfoByUserId(passenger.id);

      if (!res) throw ClientPassengerNotFoundException; // since the info of user is one-to-one relative to the user

      response.status(HttpStatusCode.Ok).send(res);
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

  @UseGuards(JwtPassengerGuard)
  @Get('getMyCollection')
  async getMyCollection(
    @Passenger() passenger: PassengerType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.getPassengerWithCollectionByUserId(passenger.id);

      if (!res) throw ClientCollectionNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
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

  /* ================= Search operations ================= */
  @UseGuards(new AnyGuard([JwtPassengerGuard, JwtRidderGuard]))
  @Get('searchPaginationPassengers')
  async searchPaginationPassengers(
    // @Passenger() passenger: PassengerType, 
    // @Ridder() ridder: RidderType, 
    @Query('userName') userName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
      throw ApiSearchingLimitTooLargeException
    }
    if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
      throw ApiSearchingLimitLessThanZeroException;
    }

    try {
      const res = await this.passengerService.searchPaginationPassengers(
        userName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
      );

      if (!res || res.length == 0) throw ClientPassengerNotFoundException;

      response.status(HttpStatusCode.Ok).send(res);
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
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */



  /* ================================= Update operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Patch('updateMe')
  async updateMe(
    @Passenger() passenger: PassengerType,
    @Body() updatePassengerDto: UpdatePassengerDto,
    @Res() response: Response
  ) {
    try {
      const res = await this.passengerService.updatePassengerById(passenger.id, updatePassengerDto);

      if (!res || res.length === 0) throw ClientPassengerNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
        ...res[0],
      });
    } catch (error) {
      if (!(error instanceof UnauthorizedException
        || error instanceof NotFoundException
        || error instanceof ConflictException)) {
          error = ClientUnknownException;
      }
      
      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @UseGuards(JwtPassengerGuard)
  @UseInterceptors(FileInterceptor('avatorFile'))
  @Patch('updateMyInfo')
  async updateMyInfo(
    @Passenger() passenger: PassengerType,
    @Body() updatePassengerInfoDto: UpdatePassengerInfoDto,
    @UploadedFile() avatorFile: Express.Multer.File | undefined = undefined,
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.updatePassengerInfoByUserId(
        passenger.id, 
        updatePassengerInfoDto, 
        avatorFile
      );

      if (!res) throw ClientPassengerNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
      });
    } catch (error) {
      if (!(error instanceof UnauthorizedException
        || error instanceof NotFoundException
        || error instanceof InternalServerErrorException
        || error instanceof NotAcceptableException)) {
          error = ClientUnknownException;
      }
      
      response.status(error.status).send({
        ...error.response,
      });
    }
  }

  @UseGuards(JwtPassengerGuard)
  @Patch('resetAccessTokenToLogout')
  async resetAccessTokenToLogout(
    @Passenger() passenger: PassengerType, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.passengerService.resetPassengerAccessTokenById(
        passenger.id
      );

      if (!res) throw ClientPassengerNotFoundException;

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
  /* ================================= Update operations ================================= */



  /* ================================= Delete operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Delete('deleteMe')
  async deleteMe(
    @Passenger() passenger: PassengerType, 
    @Body() deletePassengerDto: DeletePassengerDto, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.passengerService.deletePassengerById(passenger.id, deletePassengerDto);

      if (!res || res.length === 0) throw ClientPassengerNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        deletedAt: new Date(),
        ...res[0],
      });
    } catch (error) {
      if (!(error instanceof UnauthorizedException
        || error instanceof NotFoundException
        || error instanceof NotAcceptableException)) {
          error = ClientUnknownException;
      }
      
      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================================= Delete operations ================================= */

  

  /* ================================= Other operations ================================= */
  @Get('test')
  getTest(@Res() response: Response) {
    console.log("test")
    response.status(HttpStatusCode.Ok).send({
      alert: "This route is currently only for debugging",
      message: "test",
    });
  }

  @Get('getAllPassengers')
  async getAllPassengers(@Res() response: Response) {
    try {
      const res = await this.passengerService.getAllPassengers();

      response.status(HttpStatusCode.Ok).send({
        alert: "This route is currently only for debugging",
        ...res
      });
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        alert: "This route is currently only for debugging",
        message: "Cannot find any passengers",
      });
    }
  }
  /* ================================= Other operations ================================= */
}
