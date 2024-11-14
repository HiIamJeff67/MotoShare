import { CreateRidderInviteDto } from './create-ridderInvite.dto';
import { InviteStatusType, ReceiverStatusType } from '../../interfaces/status.interface';
declare const UpdateRidderInviteDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRidderInviteDto>>;
export declare class UpdateRidderInviteDto extends UpdateRidderInviteDto_base {
    status: InviteStatusType;
}
export declare class DecideRidderInviteDto {
    status: ReceiverStatusType;
}
export {};
