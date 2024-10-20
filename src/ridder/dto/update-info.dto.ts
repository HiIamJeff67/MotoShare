import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderInfoDto } from './create-info.dto';

export class UpdateRidderInfoDto extends PartialType(CreateRidderInfoDto) {}
