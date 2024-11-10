import { CreatePassengerInviteDto } from './create-passengerInvite.dto';
import { InviterStatusType, ReceiverStatusType } from '../../interfaces/status.interface';
declare const UpdatePassengerInviteDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePassengerInviteDto>>;
export declare class UpdatePassengerInviteDto extends UpdatePassengerInviteDto_base {
    status: InviterStatusType;
}
export declare class DecidePassengerInviteDto {
    status: ReceiverStatusType;
}
export {};
