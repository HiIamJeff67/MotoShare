import { CreateSupplyOrderDto } from './create-supplyOrder.dto';
import { PostedStatusType } from '../../types/status.tpye';
declare const UpdateSupplyOrderDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateSupplyOrderDto>>;
export declare class UpdateSupplyOrderDto extends UpdateSupplyOrderDto_base {
    status?: PostedStatusType;
}
export {};
