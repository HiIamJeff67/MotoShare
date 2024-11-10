import { PartialType } from '@nestjs/mapped-types';
import { CreatePassengerInviteDto } from './create-passengerInvite.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { 
    InviterStatusType, 
    InviterStatusTypes,
    ReceiverStatusType,
    ReceiverStatusTypes,
} from '../../interfaces/status.interface'

export class UpdatePassengerInviteDto extends PartialType(CreatePassengerInviteDto) {
    @IsOptional()
    @IsIn(InviterStatusTypes, { message: "The status of PassengerInvite should be either CHECKING or CANCEL" })
    status: InviterStatusType
}

export class DecidePassengerInviteDto {
    @IsOptional()
    @IsIn(ReceiverStatusTypes, { message: "The status of PassengerInvite should be either ACCEPTED, REJECTED, or CHECKING" })
    status: ReceiverStatusType
}
