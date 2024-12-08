import { 
    IsDateString, 
    IsLatitude, 
    IsLongitude, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    MaxLength, 
    MinLength 
} from "class-validator";
import { 
    IsAfterNow,
    IsEndAfterStart,
    IsIntString,
    IsStartBeforeEnd,
    MaxNumberString, 
    MinNumberString 
} from "../../validator";
import { MAX_SUGGEST_PRICE, MIN_SUGGEST_PRICE } from "../../constants/price.constant";
import { MAX_BRIEF_DESCRIPTION_LENGTH, MIN_BRIEF_DESCRIPTION_LENGTH } from "../../constants/context.constant";

export class CreatePassengerInviteDto {
    @IsOptional()
    @MinLength(MIN_BRIEF_DESCRIPTION_LENGTH)
    @MaxLength(MAX_BRIEF_DESCRIPTION_LENGTH)
    @IsString()
    briefDescription?: string

    @IsNotEmpty()
    @IsIntString()
    @MinNumberString(MIN_SUGGEST_PRICE)
    @MaxNumberString(MAX_SUGGEST_PRICE)
    suggestPrice: number

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
    @IsStartBeforeEnd('suggestEndedAt')
    @IsAfterNow()
    @IsDateString()
    suggestStartAfter: string

    @IsNotEmpty()
    @IsEndAfterStart('suggestStartAfter')
    @IsAfterNow()
    @IsDateString()
    suggestEndedAt: string
}
