import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderDto } from './create-purchaseOrder.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PostedStatusType, PostedStatusTypes } from '../../types/status.tpye';

export class UpdatePurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {
    @IsOptional()
    @IsIn(PostedStatusTypes, { message: "The new status of PurchaseOrder must be only POSTED" })
    status?: PostedStatusType
}
