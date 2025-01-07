import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { PassengerBankService } from './passengerBank.service';
import { CreatePassengerBankDto } from './dto/create-passengerBank.dto';
import { UpdatePassengerBankDto } from './dto/update-passengerBank.dto';
import { Passenger } from '../auth/decorator';
import { PassengerType } from '../interfaces';
import { JwtPassengerGuard } from '../auth/guard';
import { Response } from 'express';
import { HttpStatusCode } from '../enums';

@Controller('passengerBank')
export class PassengerBankController {
  constructor(private readonly passengerBankService: PassengerBankService) {}

  @UseGuards(JwtPassengerGuard)
  @Get('/getCustomerId')
  async getCustomerId(
    @Passenger() passenger: PassengerType, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.passengerBankService.getPassengerBankByUserId(
        passenger.id, 
        passenger.userName, 
        passenger.email, 
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
