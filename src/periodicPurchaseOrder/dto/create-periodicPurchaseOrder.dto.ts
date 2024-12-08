import { IsBooleanString, IsDateString, IsIn, IsLatitude, IsLongitude, IsNotEmpty, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsAfterNow, IsEndAfterStart, IsIntString, IsStartBeforeEnd, MaxNumberString, MinNumberString } from "../../validator";
import { MAX_INIT_PRICE, MIN_INIT_PRICE } from "../../constants";
import { DaysOfWeekType, DaysOfWeekTypes } from "../../types";

export class CreatePeriodicPurchaseOrderDto {
    @IsNotEmpty()
    @IsIn(DaysOfWeekTypes, { message: "The scheduled day should be either Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday"})
    scheduledDay: DaysOfWeekType

    @IsNotEmpty()
    @IsIntString()
    @MaxNumberString(MAX_INIT_PRICE)
    @MinNumberString(MIN_INIT_PRICE)
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

    @IsNotEmpty()
    @IsStartBeforeEnd('endedAt')
    @IsAfterNow()
    @IsDateString()
    startAfter: string

    @IsNotEmpty()
    @IsEndAfterStart('startAfter')
    @IsAfterNow()
    @IsDateString()
    endedAt: string

    @IsOptional()
    @IsBooleanString()
    isUrgent?: boolean

    @IsOptional()
    @IsBooleanString()
    autoAccept?: boolean
}
