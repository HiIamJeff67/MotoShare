import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RidderBankService } from './ridderBank.service';
import { CreateRidderBankDto } from './dto/create-ridderBank.dto';
import { UpdateRidderBankDto } from './dto/update-ridderBank.dto';

@Controller('ridderBank')
export class RidderBankController {
  constructor(
    private readonly ridderBankService: RidderBankService
  ) {}

  
}
