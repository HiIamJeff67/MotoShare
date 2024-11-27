import { IsOptional, IsString } from "class-validator";

export class AcceptAutoAcceptPurchaseOrderDto {
    @IsOptional()
    @IsString()
    description?: string
}