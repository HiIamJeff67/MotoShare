import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateSupplyOrderDto } from './create-supplyOrder.dto';

import { PostedStatusType, PostedStatusTypes } from '../../types/status.tpye';

export class UpdateSupplyOrderDto extends PartialType(CreateSupplyOrderDto) {
    @IsOptional()
    @IsIn(PostedStatusTypes, { message: "The new status of SupplyOrder must be POSTED" })
    status?: PostedStatusType
}
