import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RidderService } from './ridder.service';
import { CreateRidderDto } from './dto/create-ridder.dto';
import { UpdateRidderDto } from './dto/update-ridder.dto';
import { UpdatePassengerInfoDto } from 'src/passenger/dto/update-info.dto';
import { SignInRidderDto } from './dto/signIn-ridder.dto';

@Controller('ridder')
export class RidderController {
  constructor(private readonly ridderService: RidderService) {}

  /* ================================= Create operations ================================= */
  @Post('createRidderWithInfoAndCollection')
  async createRidderWithInfoAndCollection(@Body() createRidderDto: CreateRidderDto) {
    const ridderReponse = await this.ridderService.createRidder(createRidderDto);
    const infoResponse = await this.ridderService.createRidderInfoByUserId(ridderReponse[0].id);
    const collectionResponse = await this.ridderService.createRidderCollectionByUserId(ridderReponse[0].id);
    return {
      ridderId: ridderReponse[0].id,
      infoId: infoResponse[0].id,
      collectionId: collectionResponse[0].id,
    }
  }
  /* ================================= Create operations ================================= */


  /* ================================= Auth validate operations ================================= */
  @Post('signInRidderByEamilAndPassword')
  signInRidderByEamilAndPassword(@Body() signInRidderDto: SignInRidderDto) {
    return this.ridderService.signInRidderByEamilAndPassword(signInRidderDto);
  }
  /* ================================= Auth validate operations ================================= */


  /* ================================= Get operations ================================= */
  @Get('getRidderById')
  getRidderById(@Query('id') id: string) {
    return this.ridderService.getRidderById(id);
  }

  @Get('getRidderWithInfoByUserId')
  getRidderWithInfoByUserId(@Query('id') id: string) {
    return this.ridderService.getRidderWithInfoByUserId(id);
  }

  @Get('getRidderWithCollectionByUserId')
  getRidderWithCollectionByUserId(@Query('id') id: string) {
    return this.ridderService.getRidderWithCollectionByUserId(id);
  }

  @Get('getPaginationRidders')
  getPaginationRidders(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    // !important : note that if you want to get the parameter as number from the url route,
    //              you must first make sure the type of parameters are all string,
    //              for each variable you want to read it as a number, add '+' when you passing it to the services
    return this.ridderService.getPaginationRidders(+limit, +offset);  // <- notice the '+' sign of limit and offset
  }

  @Get('getAllRidders')
  getAllRidders() {
    return this.ridderService.getAllRidders();
  }
  /* ================================= Get operations ================================= */


  /* ================================= Update operations ================================= */
  @Patch('updateRidderById')
  updateRidderById(
    @Query('id') id: string, 
    @Body() updateRidderDto: UpdateRidderDto,
  ) {
    return this.ridderService.updateRidderById(id, updateRidderDto);
  }

  @Patch('updateRidderInfoByUserId')
  updateRidderInfoByUserId(
    @Query('id') id: string,
    @Body() updatePassengerInfoDto: UpdatePassengerInfoDto,
  ) {
    return this.ridderService.updateRidderInfoByUserId(id, updatePassengerInfoDto);
  }
  /* ================================= Update operations ================================= */


  /* ================================= Delete operations ================================= */
  @Delete('deleteRidderById')
  deleteRidderById(@Query('id') id: string) {
    return this.ridderService.deleteRiddderById(id);
  }
  /* ================================= Delete operations ================================= */
}
