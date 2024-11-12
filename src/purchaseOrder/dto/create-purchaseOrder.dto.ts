import { IsBoolean, IsDate, IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

// longitude(經度) -> x
// latitude(緯度)  -> y

export class CreatePurchaseOrderDto {
    @IsOptional()
    @IsString()
    description?: string

    @IsNotEmpty()
    @IsNumberString()
    initPrice: number

    @IsNotEmpty()
    @IsLongitude()
    startCordLongitude: number

    @IsNotEmpty()
    @IsLatitude()
    startCordLatitude: number

    @IsNotEmpty()
    @IsLongitude()
    endCordLongitude: number

    @IsNotEmpty()
    @IsLatitude()
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
