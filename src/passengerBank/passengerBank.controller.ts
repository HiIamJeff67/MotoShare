import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Query } from '@nestjs/common';
import { PassengerBankService } from './passengerBank.service';
import { CreatePaymentIntentDto } from './dto/create-passengerBank.dto';
import { Passenger } from '../auth/decorator';
import { PassengerType } from '../interfaces';
import { AnyGuard, JwtPassengerGuard } from '../auth/guard';
import { Response } from 'express';
import { HttpStatusCode } from '../enums';
import { toNumber } from '../utils';
import { ApiNonPositiveAmountDetectedException, ApiPaymentIntentNotFinishedException, ClientPassengerBankNotFoundException } from '../exceptions';

@Controller('passengerBank')
export class PassengerBankController {
  constructor(private readonly passengerBankService: PassengerBankService) {}

  @UseGuards(JwtPassengerGuard)
  @Get('/getMyBalance')
  async getMyBalance(
    @Passenger() passenger: PassengerType, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.passengerBankService.getMyBalacne(passenger.id);

      if (!res || res.length === 0) throw ClientPassengerBankNotFoundException;

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status(error.status).send({
        case: error.case, 
        message: error.message, 
      });
    }
  }

  @UseGuards(JwtPassengerGuard)
  @Post('/createPaymentIntentForAddingBalanceByUserId')
  async createPaymentIntentForAddingBalanceByUserId(
    @Passenger() passenger: PassengerType, 
    @Body() createPaymentIntentDto: CreatePaymentIntentDto, 
    @Res() response: Response, 
  ) {
    if (toNumber(createPaymentIntentDto.amount) <= 0) {
      throw ApiNonPositiveAmountDetectedException;
    }

    try {
      const res = await this.passengerBankService.createPaymentIntentForAddingBalance(
        passenger.id, 
        passenger.userName, 
        passenger.email, 
        toNumber(createPaymentIntentDto.amount), 
      );

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(error.status).send({
        case: error.case, 
        message: error.message, 
      });
    }
  }

  @UseGuards(new AnyGuard([JwtPassengerGuard]))
  @Post('/payToFinishOrderById')
  async payToFinishOrderById(
    @Passenger() passenger: PassengerType, 
    @Query('id') id: string, 
    @Body() createPaymentIntentDto: CreatePaymentIntentDto, 
    @Res() response: Response, 
  ) {
    if (toNumber(createPaymentIntentDto.amount) <= 0) {
      throw ApiNonPositiveAmountDetectedException;
    }

    try {
      const res = await this.passengerBankService.payToFinishOrderById(
        id, 
        passenger.id, 
        passenger.userName, 
        toNumber(createPaymentIntentDto.amount), 
      );

      if (!res || res.length === 0) throw ApiPaymentIntentNotFinishedException;

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      console.log(error);
      response.status(error.status).send({
        case: error.case, 
        message: error.message, 
      });
    }
  }
}
