import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { UpdatePassengerInfoDto } from './dto/update-info.dto';
import { SignInPassengerDto } from './dto/signin-passenger.dto';

@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  /* ================================= Create operations ================================= */
  @Post('createPassengerWithInfoAndCollection')
  async createPassengerWithInfoAndCollection(@Body() createPassengerDto: CreatePassengerDto) {
    const passengerReponse = await this.passengerService.createPassenger(createPassengerDto);
    const infoReponse = await this.passengerService.createPassengerInfoByUserId(passengerReponse[0].id);
    const collectionReponse = await this.passengerService.createPassengerCollectionByUserId(passengerReponse[0].id);
    return {
      passengerId: passengerReponse[0].id,
      infoId: infoReponse[0].id,
      collectionId: collectionReponse[0].id,
    };
  }
  /* ================================= Create operations ================================= */


  /* ================================= Auth validate operations ================================= */
  @Get('signInPassengerByEamilAndPassword')
  signInPassengerByEamilAndPassword(@Body() signInPassengerDto: SignInPassengerDto) {
    return this.passengerService.signInPassengerByEamilAndPassword(signInPassengerDto);
  }
  /* ================================= Auth validate operations ================================= */


  /* ================================= Get operations ================================= */
  @Get('getPassengerById')
  getPassengerById(@Query('id') id: string) {
    return this.passengerService.getPassengerById(id);
  }

  @Get('getPassengerWithInfoByUserId')
  getPassengerWithInfoByUserId(@Query('id') id: string) {
    return this.passengerService.getPassengerWithInfoByUserId(id);
  }

  @Get('getPassengerWithCollectionByUserId')
  getPassengerWithCollectionByUserId(@Query('id') id: string) {
    return this.passengerService.getPassengerWithCollectionByUserId(id);
  }

  @Get('getPaginationPassengers')
  getPaginationPassengers(
    @Query('limit') limit: string,
    @Query('offset') offset: string
  ) {
    return this.passengerService.getPaginationPassengers(+limit, +offset);
  }

  @Get('getAllPassengers')
  getAllPassengers() {
    return this.passengerService.getAllPassengers();
  }
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  @Patch('updatePassengerById')
  updatePassengerById(
    @Query('id') id: string, 
    @Body() updatePassengerDto: UpdatePassengerDto
  ) {
    return this.passengerService.updatePassengerById(id, updatePassengerDto);
  }

  @Patch('updatePassengerInfoByUserId')
  updatePassengerInfoByUserId(
    @Query('id') id: string,
    @Body() updatePassengerInfoDto: UpdatePassengerInfoDto
  ) {
    return this.passengerService.updatePassengerInfoByUserId(id, updatePassengerInfoDto);
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @Delete('deletePassengerById')
  deletePassengerById(@Query('id') id: string) {
    return this.passengerService.deletePassengerById(id);
  }
  /* ================================= Delete operations ================================= */


  /* ================================= Other operations ================================= */
  @Get('test')
  getTest() {
    console.log("test")
    return 'test';
  }
  /* ================================= Other operations ================================= */
}
