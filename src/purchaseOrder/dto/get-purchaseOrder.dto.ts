import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";
import { IsAfterNow, IsEndAfterStart, IsStartBeforeEnd } from "../../validator";

export class GetSimilarTimePurchaseOrderDto {
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
}

export class GetAdjacentPurchaseOrdersDto {
    @IsNotEmpty()
    @IsLongitude()
    cordLongitude: number

    @IsNotEmpty()
    @IsLatitude()
    cordLatitude: number
}

export class GetSimilarRoutePurchaseOrdersDto {
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
}