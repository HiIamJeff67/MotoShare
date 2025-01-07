import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { PassengerBankService } from './passengerBank.service';
import { CreatePaymentIntentDto } from './dto/create-passengerBank.dto';
import { Passenger } from '../auth/decorator';
import { PassengerType } from '../interfaces';
import { JwtPassengerGuard } from '../auth/guard';
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
  @Get('/createPaymentIntentForAddingBalanceByUserId')
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

  @UseGuards(JwtPassengerGuard)
  @Post('/payToFinishOrderById')
  async payToFinishOrderById(
    @Passenger() passenger: PassengerType, 
    @Body() createPaymentIntentDto: CreatePaymentIntentDto, 
    @Res() response: Response, 
  ) {
    if (toNumber(createPaymentIntentDto.amount) <= 0) {
      throw ApiNonPositiveAmountDetectedException;
    }

    try {
      const res = await this.passengerBankService.payToFinishOrderById(
        passenger.id, 
        passenger.userName, 
        passenger.email, 
        toNumber(createPaymentIntentDto.amount), 
      );

      if (!res || res.length === 0) throw ApiPaymentIntentNotFinishedException;

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status(error.status).send({
        case: error.case, 
        message: error.message, 
      });
    }
  }
}
