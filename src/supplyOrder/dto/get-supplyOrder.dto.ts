import { IsNotEmpty, IsNumber } from "class-validator";

export class GetAdjacentSupplyOrdersDto {
    @IsNotEmpty()
    @IsNumber()
    cordLongitude: number

    @IsNotEmpty()
    @IsNumber()
    cordLatitude: number
}

export class GetSimilarRouteSupplyOrdersDto {
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
}