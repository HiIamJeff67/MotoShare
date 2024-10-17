import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Controller('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post('createPassenger')
  createPassenger(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengerService.createPassenger(createPassengerDto);
  }

  @Get('getPassengerById/:id')
  getPassengerById(@Param('id') id: string) {
    return this.passengerService.getPassengerById(id);
  }

  @Get('getAllPassengers')
  getAllPassengers() {
    return this.passengerService.getAllPassengers();
  }

  @Patch('updatePassengerById/:id')
  updatePassengerById(@Param('id') id: string, @Body() updatePassengerDto: UpdatePassengerDto) {
    return this.passengerService.updatePassengerById(id, updatePassengerDto);
  }

  @Delete('deletePassengerById/:id')
  deletePassengerById(@Param('id') id: string) {
    return this.passengerService.deletePassengerById(id);
  }

  @Get('test')
  getTest() {
    console.log("test")
    return 'test';
  }
}
