import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator"
import { MAX_SUGGEST_PRICE, MIN_INIT_PRICE, MIN_SUGGEST_PRICE } from "../../constants/price.constant"
import { MAX_BRIEF_DESCRIPTION_LENGTH, MIN_BRIEF_DESCRIPTION_LENGTH } from "../../constants/context.constant"

export class CreateRidderInviteDto {
    @IsOptional()
    @Min(MIN_BRIEF_DESCRIPTION_LENGTH)
    @Max(MAX_BRIEF_DESCRIPTION_LENGTH)
    @IsString()
    briefDescription?: string

    @IsNotEmpty()
    @Min(MIN_SUGGEST_PRICE)
    @Max(MAX_SUGGEST_PRICE)
    @IsNumberString()
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

    @IsOptional()
    @IsDateString()
    suggestStartAfter?: Date
}
