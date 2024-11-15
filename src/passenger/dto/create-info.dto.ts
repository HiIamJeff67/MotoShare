import { IsBoolean, IsBooleanString, IsInt, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";
import { MAX_SELF_INTRODUCTION_LENGTH, MIN_SELF_INTRODUCTION_LENGTH } from "../../constants/context.constant";
import { MIN_AGE } from "../../constants/info.constant";

export class CreatePassengerInfoDto {
    // instead of using @IsOptional decorator for the optional fields,
    // we use default value of null, so that we can easily insert data with dto form to our database
    // (since our database accept null value of these fields)

    @IsOptional()
    @IsBooleanString()
    isOnline?: boolean

    @IsOptional()
    @Min(MIN_AGE)
    @Max(MIN_AGE)
    @IsNumberString()
    age?: number

    @IsOptional()
    @IsNumberString()
    phoneNumber?: string

    @IsOptional()
    @Min(MIN_SELF_INTRODUCTION_LENGTH)
    @Max(MAX_SELF_INTRODUCTION_LENGTH)
    @IsString()
    selfIntroduction?: string

    @IsOptional()
    @IsString()
    avatorUrl?: string
}