import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassengerInviteService } from './passengerInvite.service';
import { CreatePassengerInviteDto } from './dto/create-passengerInvite.dto';
import { UpdatePassengerInviteDto } from './dto/update-passengerInvite.dto';

@Controller('passengerInvite')
export class PassengerInviteController {
  constructor(private readonly passengerInviteService: PassengerInviteService) {}

  
  
}
