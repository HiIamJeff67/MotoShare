import { CreateRidderInviteDto } from './create-ridderInvite.dto';
import { InviteStatusType, ReceiverStatusType } from '../../interfaces/status.interface';
declare const UpdateRidderInviteDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRidderInviteDto>>;
export declare class UpdateRidderInviteDto extends UpdateRidderInviteDto_base {
    status: InviteStatusType;
}
declare const DecideRidderInviteDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRidderInviteDto>>;
export declare class DecideRidderInviteDto extends DecideRidderInviteDto_base {
    status: ReceiverStatusType;
}
export {};
