import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, Validate, ValidateIf } from "class-validator";
import { IsAfterNow, IsEndAfterStart, IsStartBeforeEnd } from "../../validator";
import { BetterFirstSearchFieldsValidation } from "../../validator/BetterFirstSearchFieldsValidation.validator";

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

export class GetBetterPurchaseOrderDto {
    @IsOptional()
    @ValidateIf(o => o.endedAt)
    @IsStartBeforeEnd('endedAt')
    @IsAfterNow()
    @IsDateString()
    startAfter: string

    @IsOptional()
    @ValidateIf(o => o.startAfter)
    @IsEndAfterStart('startAfter')
    @IsAfterNow()
    @IsDateString()
    endedAt: string

    @IsOptional()
    @IsLongitude()
    startCordLongitude: number

    @IsOptional()
    @IsLatitude()
    startCordLatitude: number

    @IsOptional()
    @IsLongitude()
    endCordLongitude: number
    
    @IsOptional()
    @IsLatitude()
    endCordLatitude: number

    @Validate(BetterFirstSearchFieldsValidation)
    get _validateWholeObject() {
        return this;
    }
}