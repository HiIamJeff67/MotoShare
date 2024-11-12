import { IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";

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