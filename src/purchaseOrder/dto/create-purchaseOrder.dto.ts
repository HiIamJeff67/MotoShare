import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { PostedStatusType } from "src/interfaces/status.interface";

// longitude(經度) -> x
// latitude(緯度)  -> y

export class CreatePurchaseOrderDto {
    @IsNotEmpty()
    @IsString()
    creatorId: string

    @IsOptional()
    @IsString()
    description?: string

    @IsNotEmpty()
    @IsInt()
    initPrice: number

    @IsNotEmpty()
    @IsNumber()
    startCordLongitude: number

    @IsNotEmpty()
    @IsNumber()
    startCordLatitude: number

    @IsNotEmpty()
    @IsNumber()
    endCordLongitude: number

    @IsNotEmpty()
    @IsNumber()
    endCordLatitude: number

    @IsOptional()
    @IsDate()
    createdAt?: Date

    @IsOptional()
    @IsDate()
    updatedAt?: Date

    @IsOptional()
    @IsDate()
    startAfter?: Date // but at most case, should be specify

    @IsOptional()
    @IsBoolean()
    isUrgent?: boolean

    @IsOptional()
    @IsString()
    status?: PostedStatusType
}
