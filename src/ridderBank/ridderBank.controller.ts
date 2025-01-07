import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { RidderBankService } from './ridderBank.service';
import { CreateRidderBankDto } from './dto/create-ridderBank.dto';
import { UpdateRidderBankDto } from './dto/update-ridderBank.dto';
import { JwtRidderGuard } from '../auth/guard';
import { Ridder } from '../auth/decorator';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { HttpStatusCode } from '../enums';

@Controller('ridderBank')
export class RidderBankController {
  constructor(
    private readonly ridderBankService: RidderBankService
  ) {}

  @UseGuards(JwtRidderGuard)
  @Get('/getCustomerId')
  async getCustomerId(
    @Ridder() ridder: RidderType, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.ridderBankService.getRidderBankByUserId(
        ridder.id, 
        ridder.userName, 
        ridder.email, 
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
