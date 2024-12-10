import { 
  Controller, UseGuards, 
  Get, Body, Delete, Query, Res, 
  UnauthorizedException, 
  NotFoundException, 
  ConflictException, 
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Post,
  NotAcceptableException,
  Patch,
  UploadedFiles,
  InternalServerErrorException
} from '@nestjs/common';
import { RidderService } from './ridder.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { 
  ApiMissingParameterException, 
  ClientUnknownException, 
  ClientCollectionNotFoundException, 
  ClientRidderNotFoundException,
  ApiSearchingLimitTooLargeException,
  ApiSearchingLimitLessThanZeroException
} from '../exceptions';

import { AnyGuard, JwtPassengerGuard, JwtRidderGuard } from '../auth/guard';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { Passenger, Ridder } from '../auth/decorator';

import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { DeleteRidderDto } from './dto/delete-ridder.dto';
import { toNumber } from '../utils/stringParser';
import { FileInterceptorMegaBytes, MAX_SEARCH_LIMIT, MIN_SEARCH_LIMIT } from '../constants';

@Controller('ridder')
export class RidderController {
  constructor(private readonly ridderService: RidderService) {}

  /* ================================= Get operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Get('getMe')
  async getMe(
    @Ridder() ridder: RidderType,
    @Res() response: Response,
  ) {
    try {
      response.status(HttpStatusCode.Ok).send(ridder);
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response
      });
    }
  }

  @UseGuards(new AnyGuard([JwtPassengerGuard, JwtRidderGuard]))
  @Get('getRidderWithInfoByUserName')
  async getRidderWithInfoByUserName(
    // @Passenger() passenger: PassengerType, 
    // @Ridder() ridder: RidderType,
    @Query('userName') userName: string,
    @Res() response: Response,
  ) {
    try {
      if (!userName) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderService.getRidderWithInfoByUserName(userName);

      if (!res) throw ClientRidderNotFoundException;

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

  @UseGuards(JwtRidderGuard)
  @Get('getMyInfo')
  async getMyInfo(
    @Ridder() ridder: RidderType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.getRidderWithInfoByUserId(ridder.id);

      if (!res) throw ClientRidderNotFoundException;

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

  @UseGuards(JwtRidderGuard)
  @Get('getMyCollection')
  async getMyCollection(
    @Ridder() ridder: RidderType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.getRidderWithCollectionByUserId(ridder.id);
      
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
  @Get('searchPaginationRidders')
  async searchPaginationRidders(
    // @Passenger() passenger: PassengerType, 
    // @Ridder() ridder: RidderType, 
    @Query('userName') userName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    if (toNumber(limit, true) > MAX_SEARCH_LIMIT) {
      throw ApiSearchingLimitTooLargeException;
    }
    if (toNumber(limit, true) < MIN_SEARCH_LIMIT) {
      throw ApiSearchingLimitLessThanZeroException;
    }
    
    try {
      const res = await this.ridderService.searchPaginationRidders(
        userName, 
        toNumber(limit, true), 
        toNumber(offset, true), 
      );

      if (!res || res.length == 0) throw ClientRidderNotFoundException;

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
  @UseGuards(JwtRidderGuard)
  @Patch('updateMe')
  async updateMe(
    @Ridder() ridder: RidderType,
    @Body() updateRidderDto: UpdateRidderDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.updateRidderById(ridder.id, updateRidderDto);

      if (!res || res.length === 0) throw ClientRidderNotFoundException;

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

  @UseGuards(JwtRidderGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatorFile', maxCount: 1 }, 
    { name: 'motocyclePhotoFile', maxCount: 1 }, 
  ]))
  @Patch('updateMyInfo')
  async updateMyInfo(
    @Ridder() ridder: RidderType,
    @Body() updateRidderInfoDto: UpdateRidderInfoDto,
    @UploadedFiles() files: { avatorFile?: Express.Multer.File[], motocyclePhotoFile?: Express.Multer.File[] }, 
    @Res() response: Response,
  ) {
    try {

      const res = await this.ridderService.updateRidderInfoByUserId(
        ridder.id, 
        updateRidderInfoDto, 
        (files.avatorFile ? files.avatorFile[0] : undefined), 
        (files.motocyclePhotoFile ? files.motocyclePhotoFile[0] : undefined), 
      );

      if (!res) throw ClientRidderNotFoundException;

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
  /* ================================= Update operations ================================= */



  /* ================================= Delete operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Delete('deleteMe')
  async deleteMe(
    @Ridder() ridder: RidderType, 
    @Body() deleteRidderDto: DeleteRidderDto, 
    @Res() response: Response, 
  ) {
    try {
      const res = await this.ridderService.deleteRiddderById(ridder.id, deleteRidderDto);

      if (!res || res.length === 0) throw ClientRidderNotFoundException;

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

  
  
  /* ================================= Test operations ================================= */
  @Get('getAllRidders')
  async getAllRidders(@Res() response: Response) {
    try {
      const res = await this.ridderService.getAllRidders();

      response.status(HttpStatusCode.Ok).send({
        alert: "This route is currently only for debugging",
        ...res
      });
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        alert: "This route is currently only for debugging",
        message: "Cannot find any ridders",
      });
    }
  }
  /* ================================= Test operations ================================= */
}
