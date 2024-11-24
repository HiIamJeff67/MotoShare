import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RidderAuthService } from './ridderAuth.service';
import { CreateRidderAuthDto } from './dto/create-ridderAuth.dto';
import { UpdateRidderAuthDto } from './dto/update-ridderAuth.dto';

@Controller('ridder-auth')
export class RidderAuthController {
  constructor(private readonly ridderAuthService: RidderAuthService) {}

  @Post()
  create(@Body() createRidderAuthDto: CreateRidderAuthDto) {
    return this.ridderAuthService.create(createRidderAuthDto);
  }

  @Get()
  findAll() {
    return this.ridderAuthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ridderAuthService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRidderAuthDto: UpdateRidderAuthDto) {
    return this.ridderAuthService.update(+id, updateRidderAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ridderAuthService.remove(+id);
  }
}
