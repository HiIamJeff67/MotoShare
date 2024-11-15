import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

// import { PostedStatusType } from "src/interfaces/status.interface";

export class CreateSupplyOrderDto {
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

    @IsNotEmpty()
    @IsString()
    startAddress: string

    @IsNotEmpty()
    @IsString()
    endAddress: string

    // @IsOptional()
    // @IsDate()
    // createdAt?: Date    // not recommand to specify this field

    // @IsOptional()
    // @IsDate()
    // updatedAt?: Date    // not recommand to specify this field

    @IsOptional()
    @IsDateString()
    startAfter?: Date   // but at most case, should be specify

    @IsOptional()
    @IsNumberString()
    tolerableRDV?: number

    // @IsOptional()
    // @IsString()
    // status?: PostedStatusType
}
