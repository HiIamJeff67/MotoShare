import { 
    IsBooleanString, 
    IsDateString, 
    IsLatitude, 
    IsLongitude, 
    IsNotEmpty, 
    IsNumberString, 
    IsOptional, 
    IsString, 
    MaxLength, 
    MinLength 
} from "class-validator";
import { 
    MaxNumberString, 
    MinNumberString,
    IsStartBeforeEnd,
    IsEndAfterStart,
    IsAfterNow
} from "../../decorators";
import { MAX_INIT_PRICE, MIN_INIT_PRICE } from "../../constants/price.constant";
import { MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH } from "../../constants/context.constant";

// longitude(經度) -> x
// latitude(緯度)  -> y

export class CreatePurchaseOrderDto {
    @IsOptional()
    @MinLength(MIN_DESCRIPTION_LENGTH)
    @MaxLength(MAX_DESCRIPTION_LENGTH)
    @IsString()
    description?: string

    @IsNotEmpty()
    @MaxNumberString(MAX_INIT_PRICE)
    @MinNumberString(MIN_INIT_PRICE)
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

    @IsNotEmpty()
    @IsStartBeforeEnd('endedAt')
    @IsAfterNow()
    @IsDateString()
    startAfter: string   // but at most case, should be specify

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

    // @IsOptional()
    // @IsString()
    // status?: PostedStatusType
}
