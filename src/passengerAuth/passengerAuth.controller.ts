import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassengerAuthService } from './passengerAuth.service';
import { CreatePassengerAuthDto } from './dto/create-passengerAuth.dto';
import { UpdatePassengerAuthDto } from './dto/update-passengerAuth.dto';

@Controller('passenger-auth')
export class PassengerAuthController {
  constructor(private readonly passengerAuthService: PassengerAuthService) {}

  @Post()
  create(@Body() createPassengerAuthDto: CreatePassengerAuthDto) {
    return this.passengerAuthService.create(createPassengerAuthDto);
  }

  @Get()
  findAll() {
    return this.passengerAuthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passengerAuthService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePassengerAuthDto: UpdatePassengerAuthDto) {
    return this.passengerAuthService.update(+id, updatePassengerAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passengerAuthService.remove(+id);
  }
}
