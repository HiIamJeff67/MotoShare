import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassengerInfoService } from './passengerInfo.service';
import { CreatePassengerInfoDto } from './dto/create-passengerInfo.dto';
import { UpdatePassengerInfoDto } from './dto/update-passengerInfo.dto';

@Controller('passenger-info')
export class PassengerInfoController {
  constructor(private readonly passengerInfoService: PassengerInfoService) {}

  @Post('createPassengerInfoById')
  create(@Body() createPassengerInfoDto: CreatePassengerInfoDto) {
    return this.passengerInfoService.createPassengerInfo(createPassengerInfoDto);
  }

  @Get()
  findAll() {
    return this.passengerInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengerInfoService.findOne(+id);
  }

  @Patch('updatePassengerInfoById/:id')
  updatePassengerInfoyById(@Param('id') id: string, @Body() updatePassengerInfoDto: UpdatePassengerInfoDto) {
    return this.passengerInfoService.updatePassengerInfoById(id, updatePassengerInfoDto);
  }

  @Patch('updatePassengerInfoByUserId/:id')
  updatePassengerInfoByUserId(@Param('id') id: string, @Body() updatePassengerInfoDto: UpdatePassengerInfoDto) {
    return this.passengerInfoService.updatePassengerInfoByUserId(id,updatePassengerInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passengerInfoService.remove(+id);
  }
}
