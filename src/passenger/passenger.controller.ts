import { 
  Controller, UseGuards, 
  Get, Body, Patch, Delete, Query, Res, 
  NotFoundException, ConflictException, UnauthorizedException 
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { TokenExpiredError } from '@nestjs/jwt';

import { JwtPassengerGuard } from '../../src/auth/guard/jwt-passenger.guard';
import { PassengerType } from '../../src/interfaces/auth.interface';
import { Passenger } from '../auth/decorator';

import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

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
      response.status(HttpStatusCode.Ok).send(passenger);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
        ? HttpStatusCode.Unauthorized
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
      });
    }
  }

  @UseGuards(JwtPassengerGuard)
  @Get('getPassengerWithInfoByUserName')
  async getPassengerWithInfoByUserName(
    @Passenger() passenger: PassengerType,  // still require to provide the bearer token
    @Query('userName') userName: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.getPassengerWithInfoByUserName(userName);

      if (!res) throw new NotFoundException("Cannot find the passenger with the given userName");

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
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
  @Get('getMyInfo')
  async getMyInfo(
    @Passenger() passenger: PassengerType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.getPassengerWithInfoByUserId(passenger.id);

      if (!res) throw new NotFoundException("Cannot find the passenger with the given id");

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
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
  async getMyCollection(
    @Passenger() passenger: PassengerType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.getPassengerWithCollectionByUserId(passenger.id);

      if (!res) throw new NotFoundException("Cannot find the passenger with the given id");

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
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
        throw new NotFoundException("Cannot find any passengers");
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

  @Get('searchPaginationPassengers')
  async searchPaginationPassengers(
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.searchPaginationPassengers(+limit, +offset);

      if (!res || res.length == 0) {
        throw new NotFoundException("Cannot find any passengers");
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
    @Passenger() passenger: PassengerType,
    @Body() updatePassengerDto: UpdatePassengerDto,
    @Res() response: Response
  ) {
    try {
      const res = await this.passengerService.updatePassengerById(passenger.id, updatePassengerDto);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find the passenger with the given id to update")
      }

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
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
    @Passenger() passenger: PassengerType,
    @Body() updatePassengerInfoDto: UpdatePassengerInfoDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.updatePassengerInfoByUserId(passenger.id, updatePassengerInfoDto);

      if (!res) {
        throw new NotFoundException("Cannot find the passenger with the given id to update")
      }

      response.status(HttpStatusCode.Ok).send({});
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
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
    @Passenger() passenger: PassengerType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerService.deletePassengerById(passenger.id);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find the passenger with the given id to update")
      }

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
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
