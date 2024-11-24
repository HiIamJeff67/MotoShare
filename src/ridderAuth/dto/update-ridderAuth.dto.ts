import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderAuthDto } from './create-ridderAuth.dto';

export class UpdateRidderAuthDto extends PartialType(CreateRidderAuthDto) {}
