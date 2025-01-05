import { CreatePassengerInviteDto } from './create-passengerInvite.dto';
import { InviterStatusType, ReceiverStatusType } from '../../types/status.tpye';
declare const UpdatePassengerInviteDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePassengerInviteDto>>;
export declare class UpdatePassengerInviteDto extends UpdatePassengerInviteDto_base {
    status: InviterStatusType;
}
export declare class DecidePassengerInviteDto {
    status: ReceiverStatusType;
    rejectReason: string;
}
export {};
