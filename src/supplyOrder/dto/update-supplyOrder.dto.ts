import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateSupplyOrderDto } from './create-supplyOrder.dto';

import { PostedStatusType } from '../../../src/interfaces/status.interface';

export class UpdateSupplyOrderDto extends PartialType(CreateSupplyOrderDto) {
    @IsOptional()
    @IsString()
    status?: PostedStatusType
}
