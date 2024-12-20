import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { RidderRecordService } from './ridderRecord.service';
import { StoreRidderRecordDto } from './dto/store-ridderRecord.dto';
import { JwtRidderGuard } from '../auth/guard';
import { Ridder } from '../auth/decorator';
import { RidderType } from '../interfaces';
import { Response } from 'express';
import { ClientRidderRecordNotFoundException, ClientStoreSearchRecordsException, ClientUnknownException } from '../exceptions';
import { HttpStatusCode } from '../enums';

@Controller('ridderRecord')
export class RidderRecordController {
  constructor(private readonly ridderRecordService: RidderRecordService) {}

  /* ================================= Set operations (Setter) ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('storeSearchRecordByUserId')
  async storeSearchRecordByUserId(
    @Ridder() ridder: RidderType, 
    @Body() storeRidderRecordDto: StoreRidderRecordDto, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.ridderRecordService.storeSearchRecordByUserId(ridder.id, storeRidderRecordDto);

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
  @UseGuards(JwtRidderGuard)
  @Get('getSearchRecordsByUserId')
  async getSearchRecordsByUserId(
    @Ridder() ridder: RidderType, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.ridderRecordService.getSearchRecordsByUserId(ridder.id);

      if (!res || res.length === 0) throw ClientRidderRecordNotFoundException;

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
