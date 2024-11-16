import { 
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
    MinNumberString 
} from "../../decorators";
import { MAX_INIT_PRICE, MIN_INIT_PRICE } from "../../constants/price.constant";
import { MAX_TOLERABLE_RDV, MIN_TOLERABLE_RDV } from "../../constants/algorithm.constant";
import { MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH } from "../../constants/context.constant";

// import { PostedStatusType } from "src/interfaces/status.interface";

export class CreateSupplyOrderDto {
    @IsOptional()
    @MinLength(MIN_DESCRIPTION_LENGTH)
    @MaxLength(MAX_DESCRIPTION_LENGTH)
    @IsString()
    description?: string

    @IsNotEmpty()
    @MinNumberString(MIN_INIT_PRICE)
    @MaxNumberString(MAX_INIT_PRICE)
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

    @IsOptional()
    @IsDateString()
    startAfter?: Date   // but at most case, should be specify

    @IsOptional()
    @MinNumberString(MIN_TOLERABLE_RDV)
    @MaxNumberString(MAX_TOLERABLE_RDV)
    @IsNumberString()
    tolerableRDV?: number

    // @IsOptional()
    // @IsString()
    // status?: PostedStatusType
}
