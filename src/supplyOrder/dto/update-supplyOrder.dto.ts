import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { CreateSupplyOrderDto } from './create-supplyOrder.dto';

import { PostedStatusType, PostedStatusTypes } from '../../../src/interfaces/status.interface';

export class UpdateSupplyOrderDto extends PartialType(CreateSupplyOrderDto) {
    @IsOptional()
    @IsIn(PostedStatusTypes, { message: "The status of SupplyOrder must be either POSTED, EXPIRED, or CANCEL" })
    status?: PostedStatusType
}
