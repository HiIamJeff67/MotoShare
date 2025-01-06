import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderBankDto } from './create-ridderBank.dto';

export class UpdateRidderBankDto extends PartialType(CreateRidderBankDto) {}
