import { IsOptional, IsString } from "class-validator";

export class AcceptAutoAcceptSupplyOrderDto {
    @IsOptional()
    @IsString()
    description?: string
}