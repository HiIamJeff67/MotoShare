import { PartialType } from '@nestjs/mapped-types';
import { CreatePassengerBankDto } from './create-passengerBank.dto';

export class UpdatePassengerBankDto extends PartialType(CreatePassengerBankDto) {}
