import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderDto } from './create-purchaseOrder.dto';
import { IsOptional, IsString } from 'class-validator';

import { PostedStatusType } from '../../../src/interfaces/status.interface';

export class UpdatePurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {
    @IsOptional()
    @IsString()
    status?: PostedStatusType
}
