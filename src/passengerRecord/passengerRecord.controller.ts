import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassengerRecordService } from './passengerRecord.service';
import { StorePassengerRecordDto } from './dto/store-passengerRecord.dto';
import { JwtPassengerGuard } from '../auth/guard';
import { Passenger } from '../auth/decorator';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
import { ClientPassengerRecordNotFoundException, ClientStoreSearchRecordsException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';

@Controller('passengerRecord')
export class PassengerRecordController {
  constructor(private readonly passengerRecordService: PassengerRecordService) {}

  /* ================================= Set operations (Setter) ================================= */
  @UseGuards(JwtPassengerGuard)
  @Post('storeSearchRecordByUserId')
  async storeSearchRecordByUserId(
    @Passenger() passenger: PassengerType, 
    @Body() storePassengerRecordDto: StorePassengerRecordDto, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.passengerRecordService.storeSearchRecordByUserId(passenger.id, storePassengerRecordDto);

      if (!res || res.length === 0) throw ClientStoreSearchRecordsException;

      response.status(HttpStatusCode.Ok).send({
        storedAt: new Date(), 
        ...res[0], 
      });
    } catch (error) {
      if (!(error instanceof UnauthorizedException
          || error instanceof ForbiddenException)) {
              error = ClientUnknownException;
      }

      response.status(error.status).send({
          ...error.response,
      });
    }
  }
  /* ================================= Set operations (Setter) ================================= */

  
  /* ================================= Get operations (Getter) ================================= */
  @UseGuards(JwtPassengerGuard)
  @Get('getSearchRecordsByUserId')
  async getSearchRecordsByUserId(
    @Passenger() passenger: PassengerType, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.passengerRecordService.getSearchRecordsByUserId(passenger.id);

      if (!res || res.length === 0) throw ClientPassengerRecordNotFoundException;

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      console.log(error)
      if (!(error instanceof UnauthorizedException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
          ...error.response,
      });
    }
  }
  /* ================================= Get operations (Getter) ================================= */
}
