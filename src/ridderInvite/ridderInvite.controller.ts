import { Controller, 
  Get, Post, Body, Delete, UseGuards, Query, Res, 
  BadRequestException, 
  UnauthorizedException, 
  ForbiddenException, 
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { RidderInviteService } from './ridderInvite.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { 
  ApiMissingParameterException, 
  ClientCreateRidderInviteException, 
  ClientInviteNotFoundException, 
  ClientUnknownException 
} from '../exceptions';

import { JwtPassengerGuard, JwtRidderGuard } from '../auth/guard';
import { Passenger, Ridder } from '../auth/decorator';
import { PassengerType, RidderType } from '../interfaces/auth.interface';


import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { 
  DecideRidderInviteDto, 
  UpdateRidderInviteDto 
} from './dto/update-ridderInvite.dto';

@Controller('ridderInvite')
export class RidderInviteController {
  constructor(private readonly ridderInviteService: RidderInviteService) {}

  /* ================================= Create operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('ridder/createRidderInviteByOrderId')
  async createRidderInviteByOrderId(
    @Ridder() ridder: RidderType,
    @Query('orderId') orderId: string,
    @Body() createRidderInviteDto: CreateRidderInviteDto,
    @Res() response: Response,
  ) {
    try {
      if (!orderId) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderInviteService.createRidderInviteByOrderId(ridder.id, orderId, createRidderInviteDto);

      if (!res || res.length === 0) throw ClientCreateRidderInviteException;

      response.status(HttpStatusCode.Created).send(res[0])
    } catch (error) {
      if (!(error instanceof BadRequestException 
        || error instanceof UnauthorizedException 
        || error instanceof ForbiddenException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================================= Create operations ================================= */
  

  /* ================================= Get operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Get('ridder/getMyRidderInviteById')
  async getRidderInviteOfRidderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderInviteService.getRidderInviteById(id, ridder.id);

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      if (!(error instanceof BadRequestException 
        || error instanceof UnauthorizedException 
        || error instanceof NotFoundException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response
      });
    }
  }

  @UseGuards(JwtPassengerGuard)
  @Get('passenger/getMyRidderInviteById')
  async getRidderInviteOfPassengerById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderInviteService.getRidderInviteById(id, passenger.id);

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res[0])
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

  /* ================= Search RidderInvite operations used by Ridders ================= */
  @UseGuards(JwtRidderGuard)
  @Get('ridder/searchMyPaginationRidderInvites')
  async searchPaginationRidderInvitesByInviterId(
    @Ridder() ridder: RidderType,
    @Query('receiverName') receiverName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderInviteService.searchPaginationRidderInvitesByInviterId(
        ridder.id, 
        receiverName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res)
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
  @Get('ridder/searchMyCurAdjacentRidderInvites')
  async searchCurAdjacentRidderInvitesByInviterId(
    @Ridder() ridder: RidderType,
    @Query('receiverName') receiverName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderInviteService.searchCurAdjacentRidderInvitesByInviterId(
        ridder.id, 
        receiverName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res)
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
  @Get('ridder/searchMyDestAdjacentRidderInvites')
  async searchDestAdjacentRidderInvitesByInviterId(
    @Ridder() ridder: RidderType,
    @Query('receiverName') receiverName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderInviteService.searchDestAdjacentRidderInvitesByInviterId(
        ridder.id, 
        receiverName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res)
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
  @Get('ridder/searchMySimilarRouteRidderInvites')
  async searchSimilarRouteRidderInvitesByInviterId(
    @Ridder() ridder: RidderType,
    @Query('receiverName') receiverName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderInviteService.searchSimilarRouteRidderInvitesByInviterId(
        ridder.id, 
        receiverName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res)
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
  /* ================= Search RidderInvite operations used by Ridders ================= */


  /* ================= Search RidderInvite operations used by Passengers ================= */
  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchMyPaginationRidderInvites')
  async searchPaginationRidderInvitesByReceiverId(
    @Passenger() passenger: PassengerType,
    @Query('inviterName') inviterName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderInviteService.searchPaginationRidderInvitesByReceiverId(
        passenger.id, 
        inviterName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res)
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

  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchMyCurAdjacentRidderInvites')
  async searchCurAdjacentRidderInvitesByReceiverId(
    @Passenger() passenger: PassengerType,
    @Query('inviterName') inviterName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderInviteService.searchCurAdjacentRidderInvitesByReceiverId(
        passenger.id, 
        inviterName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res)
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

  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchMyDestAdjacentRidderInvites')
  async searchDestAdjacentRidderInvitesByReceiverId(
    @Passenger() passenger: PassengerType,
    @Query('inviterName') inviterName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderInviteService.searchDestAdjacentRidderInvitesByReceiverId(
        passenger.id, 
        inviterName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res)
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

  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchMySimilarRouteRidderInvites')
  async searchMySimilarRouteRidderInvitesByReceverId(
    @Passenger() passenger: PassengerType,
    @Query('inviterName') inviterName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderInviteService.searchSimilarRouteRidderInvitesByReceverId(
        passenger.id, 
        inviterName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res)
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
  /* ================= Search RidderInvite operations used by Passengers ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */

  /* ================= Update detail operations used by Ridder ================= */
  @UseGuards(JwtRidderGuard)
  @Post('ridder/updateMyRidderInviteById')
  async updateMyRidderInviteById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Body() updateRidderInviteDto: UpdateRidderInviteDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderInviteService.updateRidderInviteById(id, ridder.id, updateRidderInviteDto);

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res[0]);
    } catch (error) {
      if (!(error instanceof BadRequestException 
        || error instanceof UnauthorizedException 
        || error instanceof NotFoundException
        || error instanceof ConflictException
        || error instanceof NotFoundException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================= Update detail operations used by Passenger ================= */

  /* ================= Accept or Reject operations used by Ridder ================= */
  @UseGuards(JwtPassengerGuard)
  @Post('passenger/decideRidderInviteById')
  async decidePassengerInviteById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Body() decideRidderInviteDto: DecideRidderInviteDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderInviteService.decideRidderInviteById(id, passenger.id, decideRidderInviteDto);

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send(res[0]);
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
  /* ================= Accept or Reject operations used by Ridder ================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @UseGuards(JwtRidderGuard)
  @Delete('ridder/deleteMyRidderInviteById')
  async deleteMyRidderInviteById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.ridderInviteService.deleteRidderInviteById(id, ridder.id);

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        deletedAt: new Date(),
        ...res[0],
      });
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
  /* ================================= Delete operations ================================= */
}
