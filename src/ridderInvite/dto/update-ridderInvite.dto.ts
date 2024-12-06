import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderInviteDto } from './create-ridderInvite.dto';
import { IsIn, IsOptional, IsString, ValidateIf } from 'class-validator';
import { 
    InviteStatusType, 
    InviteStatusTypes, 
    ReceiverStatusType, 
    ReceiverStatusTypes, 
} from '../../types/status.tpye';

export class UpdateRidderInviteDto extends PartialType(CreateRidderInviteDto) {
    @IsOptional()
    @IsIn(InviteStatusTypes, { message: "The status of PassengerInvite must be either CHECKING or CANCEL" })
    status: InviteStatusType
}

export class DecideRidderInviteDto {
    @IsOptional()
    @IsIn(ReceiverStatusTypes, { message: "The status of PassengerInvite must be either ACCEPTED, REJECTED, or CHECKING" })
    status: ReceiverStatusType

    @ValidateIf(o => (o.status === "REJECT"))
    @IsString()
    rejectReason: string
}
