import { PartialType } from '@nestjs/mapped-types';
import { CreatePassengerAuthDto } from './create-passengerAuth.dto';

export class UpdatePassengerAuthDto extends PartialType(CreatePassengerAuthDto) {}
