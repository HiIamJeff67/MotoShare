import { IsNotEmpty, IsNumber } from "class-validator";

export class GetAdjacentPurchaseOrdersDto {
    @IsNotEmpty()
    @IsNumber()
    cordLongitude: number

    @IsNotEmpty()
    @IsNumber()
    cordLatitude: number
}

export class GetSimilarRoutePurchaseOrdersDto {
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