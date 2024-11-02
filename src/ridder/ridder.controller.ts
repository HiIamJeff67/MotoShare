import { Controller, Get, Post, Body, Patch, Delete, Query, Res } from '@nestjs/common';
import { RidderService } from './ridder.service';
import { response, Response } from 'express';
import { HttpStatusCode } from '../enums/HttpStatusCode.enum';

import { CreateRidderDto } from './dto/create-ridder.dto';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdatePassengerInfoDto } from '../../src/passenger/dto/update-info.dto';

@Controller('ridder')
export class RidderController {
  constructor(private readonly ridderService: RidderService) {}

  /* ================================= Create operations ================================= */
  @Post('createRidderWithInfoAndCollection')
  async createRidderWithInfoAndCollection(
    @Body() createRidderDto: CreateRidderDto,
    @Res() response: Response
  ) {
    try {
      if (createRidderDto.userName.length > 20) {
        throw {
          name: "userNameTooLong",
          message: "User name cannot be longer than 20 characters"
        }
      }

      const ridderReponse = await this.ridderService.createRidder(createRidderDto);
      const infoResponse = await this.ridderService.createRidderInfoByUserId(ridderReponse[0].id);

      response.status(HttpStatusCode.Created).send({
        ridderId: ridderReponse[0].id,
        ridderName: ridderReponse[1].id,
        infoId: infoResponse[0].id,
      })
    } catch (error) {
      if (!error.constraint) {
        response.status(HttpStatusCode.BadRequest).send({
          message: "Unknown error",
        })
      }

      const duplicateField = error.constraint.split("_")[1];
      response.status(HttpStatusCode.Conflict).send({
        message: `Duplicate ${duplicateField} detected`,
      })
    }
  }
  /* ================================= Create operations ================================= */


  /* ================================= Get operations ================================= */
  @Get('getRidderById')
  async getRidderById(
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.getRidderById(id)

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        message: "Cannot find the ridder with given id",
      });
    }
  }

  @Get('getRidderWithInfoByUserId')
  async getRidderWithInfoByUserId(
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.getRidderWithInfoByUserId(id);

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        message: "Cannot find the ridder with given id",
      });
    }
  }

  @Get('getRidderWithCollectionByUserId')
  async getRidderWithCollectionByUserId(
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.getRidderWithCollectionByUserId(id);

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        message: "Cannot find the ridder with given id",
      });
    }
  }

  @Get('getPaginationRidders')
  async getPaginationRidders(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Res() response: Response,
  ) {
    // !important : note that if you want to get the parameter as number from the url route,
    //              you must first make sure the type of parameters are all string,
    //              for each variable you want to read it as a number, add '+' when you passing it to the services
    try {  
      const res = await this.ridderService.getPaginationRidders(+limit, +offset);  // <- notice the '+' sign of limit and offset

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        message: "Cannot find any ridders",
      });
    }
  }

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
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  @Patch('updateRidderById')
  async updateRidderById(
    @Query('id') id: string, 
    @Body() updateRidderDto: UpdateRidderDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.updateRidderById(id, updateRidderDto);

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        message: "Cannot find the ridder with given id to update",
      });
    }
  }

  @Patch('updateRidderInfoByUserId')
  async updateRidderInfoByUserId(
    @Query('id') id: string,
    @Body() updatePassengerInfoDto: UpdatePassengerInfoDto,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.updateRidderInfoByUserId(id, updatePassengerInfoDto);

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        message: "Cannot find the ridder with given id to update",
      });
    }
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @Delete('deleteRidderById')
  async deleteRidderById(
    @Query('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const res = await this.ridderService.deleteRiddderById(id);

      response.status(HttpStatusCode.Ok).send(res);
    } catch (error) {
      response.status(HttpStatusCode.NotFound).send({
        message: "Cannot find the ridder with given id to delete",
      });
    }
  }
  /* ================================= Delete operations ================================= */

  
  /* ================================= Test operations ================================= */

  /* ================================= Test operations ================================= */
}
