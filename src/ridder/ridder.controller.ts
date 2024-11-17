import { 
  Controller, UseGuards, 
  Get, Body, Delete, Query, Res, 
  UnauthorizedException, 
  NotFoundException, 
  ConflictException, 
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Post
} from '@nestjs/common';
import { RidderService } from './ridder.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { 
  ApiMissingParameterException, 
  ClientUnknownException, 
  ClientCollectionNotFoundException, 
  ClientRidderNotFoundException
} from '../exceptions';

import { JwtRidderGuard } from '../auth/guard';
import { RidderType } from '../interfaces/auth.interface';
import { Ridder } from '../auth/decorator';

import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @UseGuards(JwtRidderGuard)
  @Get('getRidderWithInfoByUserName')
  async getRidderWithInfoByUserName(
    @Ridder() ridder: RidderType,
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
  @Get('searchPaginationRidders')
  async searchPaginationRidders(
    @Query('userName') userName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    // !important : note that if you want to get the parameter as number from the url route,
    //              you must first make sure the type of parameters are all string,
    //              for each variable you want to read it as a number, add '+' when you passing it to the services
    try {
      const res = await this.ridderService.searchPaginationRidders(userName, +limit, +offset);

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
  @Post('updateMe')
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
  @UseInterceptors(FileInterceptor('file'))
  @Post('updateMyInfo')
  async updateMyInfo(
    @Ridder() ridder: RidderType,
    @Body() updateRidderInfoDto: UpdateRidderInfoDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.updateRidderInfoByUserId(ridder.id, updateRidderInfoDto, file);

      if (!res) throw ClientRidderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
        ...res[0],
      });
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
  /* ================================= Update operations ================================= */



  /* ================================= Delete operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Delete('deleteMe')
  async deleteMe(
    @Ridder() ridder: RidderType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.deleteRiddderById(ridder.id);

      if (!res || res.length === 0) throw ClientRidderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        deletedAt: new Date(),
        ...res[0],
      });
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
