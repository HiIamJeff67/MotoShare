import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderDto } from './create-purchaseOrder.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PostedStatusType, PostedStatusTypes } from '../../../src/interfaces/status.interface';

export class UpdatePurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {
    @IsOptional()
    @IsIn(PostedStatusTypes, { message: "The status of PurchaseOrder must be either POSTED, EXPIRED, or CANCEL" })
    status?: PostedStatusType
}
