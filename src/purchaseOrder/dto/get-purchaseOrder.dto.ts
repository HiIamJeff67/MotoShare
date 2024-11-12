import { IsLatitude, IsLongitude, IsNotEmpty } from "class-validator";

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