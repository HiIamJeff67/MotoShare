import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderInviteDto } from './create-ridderInvite.dto';
import { IsIn, IsOptional } from 'class-validator';
import { InviteStatusType, InviteStatusTypes, ReceiverStatusType, ReceiverStatusTypes } from '../../interfaces/status.interface';

export class UpdateRidderInviteDto extends PartialType(CreateRidderInviteDto) {
    @IsOptional()
    @IsIn(InviteStatusTypes, { message: "The status of PassengerInvite must be either CHECKING or CANCEL" })
    status: InviteStatusType
}

export class DecideRidderInviteDto extends PartialType(CreateRidderInviteDto) {
    @IsOptional()
    @IsIn(ReceiverStatusTypes, { message: "The status of PassengerInvite must be either ACCEPTED, REJECTED, or CHECKING" })
    status: ReceiverStatusType
}
