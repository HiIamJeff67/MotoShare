import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodicSupplyOrderDto } from './create-periodicSupplyOrder.dto';

export class UpdatePeriodicSupplyOrderDto extends PartialType(CreatePeriodicSupplyOrderDto) {}
