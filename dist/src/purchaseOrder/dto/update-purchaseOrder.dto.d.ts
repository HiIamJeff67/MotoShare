import { CreatePurchaseOrderDto } from './create-purchaseOrder.dto';
import { PostedStatusType } from '../../types/status.tpye';
declare const UpdatePurchaseOrderDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePurchaseOrderDto>>;
export declare class UpdatePurchaseOrderDto extends UpdatePurchaseOrderDto_base {
    status?: PostedStatusType;
}
export {};
