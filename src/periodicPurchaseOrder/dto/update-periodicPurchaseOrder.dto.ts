import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodicPurchaseOrderDto } from './create-periodicPurchaseOrder.dto';

export class UpdatePeriodicPurchaseOrderDto extends PartialType(CreatePeriodicPurchaseOrderDto) {}
