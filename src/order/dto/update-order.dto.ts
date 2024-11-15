import { IsIn, IsOptional } from 'class-validator';
import { OrderStatusType, OrderStatusTypes } from '../../types/status.tpye';

export class UpdateOrderDto {
    @IsOptional()
    @IsIn(OrderStatusTypes, { message: "The status of order must be either UNSTARTED, STARTED, UNPAID, or FINISHED" })
    status?: OrderStatusType
}
