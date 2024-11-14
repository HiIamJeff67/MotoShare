import { Controller, 
  Get, Post, Body, Patch, Delete, UseGuards, Query, Res, 
  BadRequestException, 
  UnauthorizedException, 
  ForbiddenException, 
  NotFoundException
} from '@nestjs/common';
import { PassengerInviteService } from './passengerInvite.service';
import { Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { ApiMissingParameterException, 
  ClientCreatePassengerInviteException, 
  ClientInviteNotFoundException, 
  ClientUnknownException 
} from '../exceptions';

import { JwtPassengerGuard, JwtRidderGuard } from '../auth/guard';
import { Passenger, Ridder } from '../auth/decorator';
import { PassengerType, RidderType } from '../interfaces/auth.interface';

import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { 
  DecidePassengerInviteDto, 
  UpdatePassengerInviteDto 
} from './dto/update-passengerInvite.dto';

@Controller('passengerInvite')
export class PassengerInviteController {
  constructor(private readonly passengerInviteService: PassengerInviteService) {}

  /* ================================= Create operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Post('passenger/createPassengerInviteByOrderId')
  async createPassengerInviteByOrderId(
    @Passenger() passenger: PassengerType,
    @Query('orderId') orderId: string,
    @Body() createPassengerInviteDto: CreatePassengerInviteDto,
    @Res() response: Response,
  ) {
    try {
      if (!orderId) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerInviteService.createPassengerInviteByOrderId(passenger.id, orderId, createPassengerInviteDto);

      if (!res || res.length === 0) throw ClientCreatePassengerInviteException;

      response.status(HttpStatusCode.Created).send(res);
    } catch (error) {
      if (!(error instanceof BadRequestException 
        || error instanceof UnauthorizedException 
        || error instanceof ForbiddenException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        message: error.message,
      });
    }
  }
  /* ================================= Create operations ================================= */
  

  /* ================================= Get operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Get('passenger/getMyPassengerInviteById')
  async getPassengerInviteOfPassengerById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerInviteService.getPassengerInviteById(id, passenger.id);

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

  @UseGuards(JwtRidderGuard)
  @Get('/ridder/getMyPassengerInviteById')
  async getPassengerInviteOfRidderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerInviteService.getPassengerInviteById(id, ridder.id);

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

  /* ================= Search PassengerInvite operations used by Passengers ================= */
  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchMyPaginationPassengerInvites')
  async searchPaginationPassengerInvitesByInviterId(
    @Passenger() passenger: PassengerType,
    @Query('receiverName') receiverName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerInviteService.searchPaginationPassengerInvitesByInviterId(
        passenger.id, 
        receiverName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

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

  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchMyCurAdjacentPassengerInvites')
  async searchCurAdjacentPassengerInvitesByInviterId(
    @Passenger() passenger: PassengerType,
    @Query('receiverName') receiverName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerInviteService.searchCurAdjacentPassengerInvitesByInviterId(
        passenger.id, 
        receiverName, 
        +limit, 
        +offset,
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

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

  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchMyDestAdjacentPassengerInvites')
  async searchDestAdjacentPassengerInvitesByInviterId(
    @Passenger() passenger: PassengerType,
    @Query('receiverName') receiverName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerInviteService.searchDestAdjacentPassengerInvitesByInviterId(
        passenger.id, 
        receiverName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

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

  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchMySimilarRoutePassengerInvites')
  async searchSimilarRoutePassengerInvitesByInviterId(
    @Passenger() passenger: PassengerType,
    @Query('receiverName') receiverName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerInviteService.searchSimilarRoutePassengerInvitesByInviterId(
        passenger.id, 
        receiverName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

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
  /* ================= Search PassengerInvite operations used by Passengers ================= */


  /* ================= Search PassengerInvite operations used by Ridders ================= */
  @UseGuards(JwtRidderGuard)
  @Get('ridder/searchMyPaginationPasssengerInvites')
  async searchPaginationPasssengerInvitesByReceiverId(
    @Ridder() ridder: RidderType,
    @Query('inviterName') inviterName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerInviteService.searchPaginationPasssengerInvitesByReceiverId(
        ridder.id, 
        inviterName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

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
  @Get('ridder/searchMyCurAdjacentPassengerInvites')
  async searchCurAdjacentPassengerInvitesByReceiverId(
    @Ridder() ridder: RidderType,
    @Query('inviterName') inviterName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerInviteService.searchCurAdjacentPassengerInvitesByReceiverId(
        ridder.id, 
        inviterName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

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
  @Get('ridder/searchMyDestAdjacentPassengerInvites')
  async searchDestAdjacentPassengerInvitesByReceiverId(
    @Ridder() ridder: RidderType,
    @Query('inviterName') inviterName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerInviteService.searchDestAdjacentPassengerInvitesByReceiverId(
        ridder.id, 
        inviterName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

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
  @Get('ridder/searchMySimilarRoutePassengerInvites')
  async searchMySimilarRoutePassengerInvitesByReceverId(
    @Ridder() ridder: RidderType,
    @Query('inviterName') inviterName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      const res = await this.passengerInviteService.searchSimilarRoutePassengerInvitesByReceverId(
        ridder.id, 
        inviterName, 
        +limit, 
        +offset
      );

      if (!res || res.length === 0) throw ClientInviteNotFoundException;

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
  /* ================= Search PassengerInvite operations used by Ridders ================= */

  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */

  /* ================= Update detail operations used by Passenger ================= */
  @UseGuards(JwtPassengerGuard)
  @Patch('passenger/updateMyPassengerInviteById')
  async updateMyPassengerInviteById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Body() updatePassengerInviteDto: UpdatePassengerInviteDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerInviteService.updatePassengerInviteById(id, passenger.id, updatePassengerInviteDto);

      if (!res) throw ClientInviteNotFoundException;

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
  /* ================= Update detail operations used by Passenger ================= */

  /* ================= Accept or Reject operations used by Ridder ================= */
  @UseGuards(JwtRidderGuard)
  @Patch('ridder/decidePassengerInviteById')
  async decidePassengerInviteById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Body() decidePassengerInviteDto: DecidePassengerInviteDto,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerInviteService.decidePassengerInviteById(id, ridder.id, decidePassengerInviteDto);

      if (!res) throw ClientInviteNotFoundException;

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
  /* ================= Accept or Reject operations used by Ridder ================= */

  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Delete('passenger/deleteMyPassengerInviteById')
  async deleteMyPassengerInviteById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.passengerInviteService.deletePassengerInviteById(id, passenger.id);

      if (!res) throw ClientInviteNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        deletedAt: new Date(),
        ...res,
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
