import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderInviteDto } from './create-ridderInvite.dto';

export class UpdateRidderInviteDto extends PartialType(CreateRidderInviteDto) {}
