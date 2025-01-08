import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Query } from '@nestjs/common';
import { RidderBankService } from './ridderBank.service';
import { JwtRidderGuard } from '../auth/guard';
import { Ridder } from '../auth/decorator';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { HttpStatusCode } from '../enums';
import { CreatePaymentIntentDto } from './dto/create-ridderBank.dto';
import { toNumber } from '../utils';
import { ApiNonPositiveAmountDetectedException, ApiPaymentIntentNotFinishedException, ClientRidderBankNotFoundException } from '../exceptions';

@Controller('ridderBank')
export class RidderBankController {
  constructor(
    private readonly ridderBankService: RidderBankService
  ) {}

  @UseGuards(JwtRidderGuard)
  @Get('/getMyBalance')
  async getMyBalance(
    @Ridder() ridder: RidderType, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.ridderBankService.getMyBalacne(ridder.id);

      if (!res || res.length === 0) throw ClientRidderBankNotFoundException;

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status(error.status).send({
        case: error.case, 
        message: error.message, 
      });
    }
  }

  @UseGuards(JwtRidderGuard)
  @Post('/createPaymentIntentForAddingBalanceByUserId')
  async createPaymentIntentForAddingBalanceByUserId(
    @Ridder() ridder: RidderType, 
    @Body() createPaymentIntentDto: CreatePaymentIntentDto, 
    @Res() response: Response, 
  ) {
    if (toNumber(createPaymentIntentDto.amount) <= 0) {
      throw ApiNonPositiveAmountDetectedException;
    }

    try {
      const res = await this.ridderBankService.createPaymentIntentForAddingBalance(
        ridder.id, 
        ridder.userName, 
        ridder.email, 
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
}
