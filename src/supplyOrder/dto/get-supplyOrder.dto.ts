import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";
import { IsAfterNow, IsEndAfterStart, IsStartBeforeEnd } from "../../validator";

export class GetSimilarTimeSupplyOrderDto {
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

export class GetAdjacentSupplyOrdersDto {
    @IsNotEmpty()
    @IsLongitude()
    cordLongitude: number

    @IsNotEmpty()
    @IsLatitude()
    cordLatitude: number
}

export class GetSimilarRouteSupplyOrdersDto {
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