import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

// longitude(經度) -> x
// latitude(緯度)  -> y

export class CreatePurchaseOrderDto {
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

    // @IsOptional()
    // @IsDate()
    // createdAt?: Date    // not recommand to specify this field

    // @IsOptional()
    // @IsDate()
    // updatedAt?: Date    // not recommand to specify this field

    @IsOptional()
    @IsDate()
    startAfter?: Date   // but at most case, should be specify

    @IsOptional()
    @IsBoolean()
    isUrgent?: boolean

    // @IsOptional()
    // @IsString()
    // status?: PostedStatusType
}
