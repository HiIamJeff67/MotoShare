import { Controller, Get, Body, Patch, Delete, Query, Res, UseGuards, Req, NotFoundException, ConflictException } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';

import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { JwtPassengerGuard } from '../../src/auth/guard/jwt-passenger.guard';
import { User } from '../../src/interfaces/auth.interface';
import { TokenExpiredError } from '@nestjs/jwt';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}
  
  /* ================================= Get operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Get('getMe')
  getMe(
    @Req() request: Request, // mainly the method to get the id of current passenger
    @Res() response: Response,
  ) {  
    // will throw "401, unauthorized" if the bearer token is invalid or expired
    try {
      response.status(HttpStatusCode.Ok).send(request.user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtPassengerGuard)
  @Get('getMyInfo')
  async getPassengerInfo(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!request || !request.user) {
        throw new TokenExpiredError(
          "access token has expired, please try to login again", 
          new Date()
        );
      }
      const user = request.user as User;

      const res = await this.passengerService.getPassengerWithInfoByUserId(user.id);

      if (!res) throw new Error("Cannot find the passenger with given id");

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof TokenExpiredError 
        ? HttpStatusCode.Unauthorized 
        : (error instanceof NotFoundException
          ? HttpStatusCode.NotFound
          : HttpStatusCode.UnknownError ?? 520
        )
      ).send({
        message: error.message,
      });
    }
  }

  @UseGuards(JwtPassengerGuard)
  @Get('getMyCollection')
  async getPassengerCollection(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!request.user || !request.user) {
        throw new TokenExpiredError(
          "access token has expired, please try to login again", 
          new Date()
        );
      }
      const user = request.user as User;

      const res = await this.passengerService.getPassengerWithCollectionByUserId(user.id);

      if (!res) throw new NotFoundException("Cannot find the passenger with given id");

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof TokenExpiredError 
        ? HttpStatusCode.Unauthorized 
        : (error instanceof NotFoundException
          ? HttpStatusCode.NotFound
          : HttpStatusCode.UnknownError ?? 520
        )
      ).send({
        message: error.message,
      });
    }
  }

  /* ================= Search operations ================= */
  @Get('searchPassengersByUserName')
  async searchPassengersByUserName(
    @Query('userName') userName: string,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.searchPassengersByUserName(userName, +limit, +offset);

      if (!res || res.length == 0) {
        throw new NotFoundException("Cannot find any passengers")
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof NotFoundException 
        ? HttpStatusCode.NotFound 
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
      });
    }
  }

  @Get('getPaginationPassengers')
  async getPaginationPassengers(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.getPaginationPassengers(+limit, +offset);

      if (!res || res.length == 0) {
        throw new NotFoundException("Cannot find any passengers")
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof NotFoundException 
        ? HttpStatusCode.NotFound 
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
      });
    }
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Patch('updateMe')
  async updateMe(
    @Req() request: Request,
    @Body() updatePassengerDto: UpdatePassengerDto,
    @Res() response: Response
  ) {
    try {
      if (!request || !request.user) {
        throw new TokenExpiredError(
          "access token has expired, please try to login again", 
          new Date()
        );
      }

      const user = request.user as User;

      const res = await this.passengerService.updatePassengerById(user.id, updatePassengerDto);

      if (!res) {
        throw new NotFoundException("Cannot find the passenger with given id to update")
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof TokenExpiredError 
        ? HttpStatusCode.Unauthorized
        : (error instanceof NotFoundException
          ? HttpStatusCode.NotFound
          : (error instanceof ConflictException
            ? HttpStatusCode.Conflict
            : HttpStatusCode.UnknownError ?? 520
          )
        )
      ).send({
        message: error.message,
      });
    }
  }

  @UseGuards(JwtPassengerGuard)
  @Patch('updateMyInfo')
  async updateMyInfo(
    @Req() request: Request,
    @Body() updatePassengerInfoDto: UpdatePassengerInfoDto,
    @Res() response: Response,
  ) {
    try {
      if (!request || !request.user) {
        throw new TokenExpiredError(
          "access token has expired, please try to login again", 
          new Date()
        );
      }

      const user = request.user as User;

      const res = await this.passengerService.updatePassengerInfoByUserId(user.id, updatePassengerInfoDto);

      if (!res) {
        throw new NotFoundException("Cannot find the passenger with given id to update")
      }

      response.status(HttpStatusCode.Ok).send({});
    } catch (error) {
      response.status(error instanceof TokenExpiredError
        ? HttpStatusCode.Unauthorized
        : (error instanceof NotFoundException
          ? HttpStatusCode.NotFound
          : HttpStatusCode.UnknownError ?? 520
        )
      ).send({
        message: error.message,
      });
    }
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Delete('deleteMe')
  async deleteMe(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      if (!request || !request.user) {
        throw new TokenExpiredError(
          "access token has expired, please try to login again", 
          new Date()
        );
      }

      const user = request.user as User;

      const res = await this.passengerService.deletePassengerById(user.id);

      if (!res) {
        throw new NotFoundException("Cannot find the passenger with given id to update")
      }

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error instanceof TokenExpiredError
        ? HttpStatusCode.Unauthorized
        : (error instanceof NotFoundException
          ? HttpStatusCode.NotFound
          : HttpStatusCode.UnknownError ?? 520
        )
      ).send({
        message: error.message,
      });
    }
  }
  /* ================================= Delete operations ================================= */


  /* ================================= Other operations ================================= */
  @Get('test')
  getTest() {
    console.log("test")
    // response.status(HttpStatusCode.Ok).send({
    //   alert: "This route is currently only for debugging",
    //   message: "test",
    // });
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
        message: "Cannot find any passengers",
      });
    }
  }
  /* ================================= Other operations ================================= */
}
