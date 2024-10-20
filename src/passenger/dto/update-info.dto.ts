import { PartialType } from '@nestjs/mapped-types';
import { CreatePassengerInfoDto } from './create-info.dto';

export class UpdatePassengerInfoDto extends PartialType(CreatePassengerInfoDto) {}
