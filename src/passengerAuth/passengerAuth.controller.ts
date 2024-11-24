import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassengerAuthService } from './passengerAuth.service';
import { CreatePassengerAuthDto } from './dto/create-passengerAuth.dto';
import { UpdatePassengerAuthDto } from './dto/update-passengerAuth.dto';

@Controller('passenger-auth')
export class PassengerAuthController {
    constructor(private readonly passengerAuthService: PassengerAuthService) {}

    
}
