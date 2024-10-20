import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderDto } from './create-ridder.dto';

export class UpdateRidderDto extends PartialType(CreateRidderDto) {}
