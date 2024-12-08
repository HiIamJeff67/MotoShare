import { IsBooleanString, IsDateString, IsIn, IsLatitude, IsLongitude, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"
import { DaysOfWeekType, DaysOfWeekTypes } from "../../types"
import { IsAfterNow, IsEndAfterStart, IsIntString, IsStartBeforeEnd, MaxNumberString, MinNumberString } from "../../validator"
import { MAX_INIT_PRICE, MAX_TOLERABLE_RDV, MIN_INIT_PRICE, MIN_TOLERABLE_RDV } from "../../constants"

export class CreatePeriodicSupplyOrderDto {
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
    @MinNumberString(MIN_TOLERABLE_RDV)
    @MaxNumberString(MAX_TOLERABLE_RDV)
    @IsNumberString()
    tolerableRDV?: number

    @IsOptional()
    @IsBooleanString()
    autoAccept?: boolean
}
