import { BadRequestException, Controller, 
  Delete, 
  ForbiddenException, 
  Get, NotAcceptableException, NotFoundException, Post, Query, Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtPassengerGuard, JwtRidderGuard } from '../auth/guard';
import { PassengerType, RidderType } from '../interfaces/auth.interface';
import { Passenger, Ridder } from '../auth/decorator';
import { Response } from 'express';
import { 
  ApiMissingParameterException, 
  ApiSearchingLimitTooLarge, 
  ClientOrderNotFoundException, 
  ClientUnknownException 
} from '../exceptions';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';
import { MAX_SEARCH_LIMIT } from '../constants';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /* ================================= Get operations ================================= */
  @UseGuards(JwtPassengerGuard)
  @Get('passenger/getOrderById')
  async getOrderForPassengerById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }
  
      const res = await this.orderService.getOrderById(id, passenger.id);
  
      if (!res || res.length === 0) throw ClientOrderNotFoundException;
  
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

  @UseGuards(JwtRidderGuard)
  @Get('ridder/getOrderById')
  async getOrderForRidderById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }
  
      const res = await this.orderService.getOrderById(id, ridder.id);
  
      if (!res || res.length === 0) throw ClientOrderNotFoundException;
  
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

  /* ================= Search operations ================= */
  @UseGuards(JwtPassengerGuard)
  @Get('passenger/searchPaginationOrders')
  async searchPaginationOrdersByPassengerId(
    @Passenger() passenger: PassengerType,
    @Query('ridderName') ridderName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      if (+limit > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
      }

      const res = await this.orderService.searchPaginationOrderByPassengerId(passenger.id, ridderName, +limit, +offset);

      if (!res || res.length === 0) throw ClientOrderNotFoundException;

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
  @Get('ridder/searchPaginationOrders')
  async searchPaginationOrdersByRidderId(
    @Ridder() ridder: RidderType,
    @Query('passengerName') passengerName: string | undefined = undefined,
    @Query('limit') limit: string = "10",
    @Query('offset') offset: string = "0",
    @Res() response: Response,
  ) {
    try {
      if (+limit > MAX_SEARCH_LIMIT) {
        throw ApiSearchingLimitTooLarge(MAX_SEARCH_LIMIT);
      }

      const res = await this.orderService.searchPaginationOrderByRidderId(ridder.id, passengerName, +limit, +offset);

      if (!res || res.length === 0) throw ClientOrderNotFoundException;

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


  /* ================================= Update and Transact operations for Passengers ================================= */
  @UseGuards(JwtPassengerGuard)
  @Post('passenger/toStartedStatusById')
  async toStartedPassengerStatusById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.orderService.toStartedPassengerStatusById(id, passenger.id);

      if (!res || res.length === 0) throw ClientOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
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

  @UseGuards(JwtPassengerGuard)
  @Post('passenger/toUnpaidStatusById')
  async toUnpaidPassengerStatusById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.orderService.toUnpaidPassengerStatusById(id, passenger.id);

      if (!res || res.length === 0) throw ClientOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
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

  @UseGuards(JwtPassengerGuard)
  @Post('passenger/toFinishedStatusById')
  async toFinishedPassengerStatusById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.orderService.toFinishedPassengerStatusById(id, passenger.id);

      if (!res || res.length === 0) throw ClientOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
        ...res[0],
      });
    } catch (error) {
      if (!(error instanceof BadRequestException
        || error instanceof NotAcceptableException
        || error instanceof UnauthorizedException
        || error instanceof NotFoundException
        || error instanceof ForbiddenException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================================= Update and Transact operations for Passengers ================================= */


  /* ================================= Update and Transact operations for Ridders ================================= */
  @UseGuards(JwtRidderGuard)
  @Post('ridder/toStartedStatusById')
  async toStartedRidderStatusById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.orderService.toStartedRidderStatusById(id, ridder.id);

      if (!res || res.length === 0) throw ClientOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updateAt: new Date(),
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

  @UseGuards(JwtRidderGuard)
  @Post('ridder/toUnpaidStatusById')
  async toUnpaidRidderStatusById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.orderService.toUnpaidRidderStatusById(id, ridder.id);

      if (!res || res.length === 0) throw ClientOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        updatedAt: new Date(),
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

  @UseGuards(JwtRidderGuard)
  @Post('ridder/toFinishedStatusById')
  async toFinishedRidderStatusById(
    @Ridder() ridder: RidderType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.orderService.toFinishedRidderStatusById(id, ridder.id);

      if (!res || res.length === 0) throw ClientOrderNotFoundException;

      response.status(HttpStatusCode.Ok).send({
        prevOrderDeletedAt: new Date(),
        ...res[0],
      });
    } catch (error) {
      if (!(error instanceof BadRequestException
        || error instanceof NotAcceptableException
        || error instanceof UnauthorizedException
        || error instanceof NotFoundException
        || error instanceof ForbiddenException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================================= Update and Transact operations for Ridders ================================= */


  /* ================================= Delete operation ================================= */
  @UseGuards(JwtPassengerGuard)
  @Delete('passenger/cancelAndDeleteOrderById')
  async cancelAndDeleteOrderForPassengerById(
    @Passenger() passenger: PassengerType,
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (!id) {
        throw ApiMissingParameterException;
      }

      const res = await this.orderService.cancelAndDeleteOrderById(id, passenger.id);

      if (!res || res.length === 0) throw ClientOrderNotFoundException; 

      response.status(HttpStatusCode.Ok).send({
        prevOrderDeletedAt: new Date(),
        ...res[0],
      });
    } catch (error) {
      if (!(error instanceof BadRequestException
        || error instanceof UnauthorizedException
        || error instanceof NotFoundException
        || error instanceof ForbiddenException)) {
          error = ClientUnknownException;
      }

      response.status(error.status).send({
        ...error.response,
      });
    }
  }
  /* ================================= Delete operation ================================= */
}
