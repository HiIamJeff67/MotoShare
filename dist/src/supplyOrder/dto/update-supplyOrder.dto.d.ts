import { CreateSupplyOrderDto } from './create-supplyOrder.dto';
import { PostedStatusType } from '../../../src/interfaces/status.interface';
declare const UpdateSupplyOrderDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateSupplyOrderDto>>;
export declare class UpdateSupplyOrderDto extends UpdateSupplyOrderDto_base {
    status?: PostedStatusType;
}
export {};
