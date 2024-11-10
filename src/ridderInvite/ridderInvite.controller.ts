import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RidderInviteService } from './ridderInvite.service';
import { CreateRidderInviteDto } from './dto/create-ridderInvite.dto';
import { UpdateRidderInviteDto } from './dto/update-ridderInvite.dto';

@Controller('ridder-invite')
export class RidderInviteController {
  constructor(private readonly ridderInviteService: RidderInviteService) {}

  @Post()
  create(@Body() createRidderInviteDto: CreateRidderInviteDto) {
    return this.ridderInviteService.create(createRidderInviteDto);
  }

  @Get()
  findAll() {
    return this.ridderInviteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ridderInviteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRidderInviteDto: UpdateRidderInviteDto) {
    return this.ridderInviteService.update(+id, updateRidderInviteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ridderInviteService.remove(+id);
  }
}
