import { PartialType } from '@nestjs/mapped-types';
import { CreatePassengerInfoDto } from './create-passengerInfo.dto';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePassengerInfoDto extends PartialType(CreatePassengerInfoDto) {}
