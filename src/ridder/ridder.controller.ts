import { 
  Controller, UseGuards, 
  Get, Body, Patch, Delete, Query, Res, 
  UnauthorizedException, NotFoundException, ConflictException 
} from '@nestjs/common';
import { RidderService } from './ridder.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { TokenExpiredError } from '@nestjs/jwt';

import { JwtRidderGuard } from '../auth/guard';
import { RidderType } from '../interfaces/auth.interface';
import { Ridder } from '../auth/decorator';

import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdateRidderInfoDto } from './dto/update-info.dto';

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
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
        ? HttpStatusCode.Unauthorized
        : HttpStatusCode.UnknownError ?? 520
      ).send({
        message: error.message,
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
      const res = await this.ridderService.getRidderWithInfoByUserName(userName);

      if (!res) throw new NotFoundException("Cannot find the ridder with the given userName");

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

  @UseGuards(JwtRidderGuard)
  @Get('getMyInfo')
  async getMyInfo(
    @Ridder() ridder: RidderType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.getRidderWithInfoByUserId(ridder.id);

      if (!res) throw new NotFoundException("Cannot find the ridder with the given id");

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

  @UseGuards(JwtRidderGuard)
  @Get('getMyCollection')
  async getMyCollection(
    @Ridder() ridder: RidderType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.getRidderWithCollectionByUserId(ridder.id);
      
      if (!res) throw new NotFoundException("Cannot find the ridder with the given id");

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
  @Get('searchRiddersByUserName')
  async searchRiddersByUserName(
    @Query('userName') userName: string,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.searchRiddersByUserName(userName, +limit, +offset);

      if (!res || res.length == 0) {
        throw new NotFoundException("Cannot find any ridders");
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

  @Get('searchPaginationRidders')
  async searchPaginationRidders(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Res() response: Response,
  ) {
    // !important : note that if you want to get the parameter as number from the url route,
    //              you must first make sure the type of parameters are all string,
    //              for each variable you want to read it as a number, add '+' when you passing it to the services
    try {
      const res = await this.ridderService.searchPaginationRidders(+limit, +offset);

      if (!res || res.length == 0) {
        throw new NotFoundException("Cannot find any ridders");
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
  @UseGuards(JwtRidderGuard)
  @Patch('updateMe')
  async updateMe(
    @Ridder() ridder: RidderType,
    @Body() updateRidderDto: UpdateRidderDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.updateRidderById(ridder.id, updateRidderDto);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find the ridder with the given id to update")
      }

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      response.status((error instanceof UnauthorizedException || error instanceof TokenExpiredError)
        ? HttpStatusCode.Unauthorized
        : (error instanceof NotFoundException
          ? HttpStatusCode.NotFound
          : (error instanceof ConflictException // passing the same password as previous to update
            ? HttpStatusCode.Conflict
            : HttpStatusCode.UnknownError ?? 520
          )
        )
      ).send({
        message: error.message,
      });
    }
  }

  @UseGuards(JwtRidderGuard)
  @Patch('updateMyInfo')
  async updateMyInfo(
    @Ridder() ridder: RidderType,
    @Body() updateRidderInfoDto: UpdateRidderInfoDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.updateRidderInfoByUserId(ridder.id, updateRidderInfoDto);

      if (!res) {
        throw new NotFoundException("Cannot find the ridder with the given id to update")
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
  @UseGuards(JwtRidderGuard)
  @Delete('deleteMe')
  async deleteMe(
    @Ridder() ridder: RidderType,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.deleteRiddderById(ridder.id);

      if (!res || res.length === 0) {
        throw new NotFoundException("Cannot find the ridder with the given id to update")
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
        message: "Cannot find any ridders",
      });
    }
  }
  /* ================================= Test operations ================================= */
}
