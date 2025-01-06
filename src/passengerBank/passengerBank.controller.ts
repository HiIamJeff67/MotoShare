import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassengerBankService } from './passengerBank.service';
import { CreatePassengerBankDto } from './dto/create-passengerBank.dto';
import { UpdatePassengerBankDto } from './dto/update-passengerBank.dto';

@Controller('passengerBank')
export class PassengerBankController {
  constructor(private readonly passengerBankService: PassengerBankService) {}

  @Get('/')
  listCostomers() {
    return this.passengerBankService.listStripeCostomers();
  }
}
