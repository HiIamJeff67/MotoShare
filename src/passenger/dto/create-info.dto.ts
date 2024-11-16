import { 
    IsBooleanString, 
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
    @MinNumberString(MIN_AGE)
    @MaxNumberString(MIN_AGE)
    @IsNumberString()
    age?: number

    @IsOptional()
    @IsNumberString()
    phoneNumber?: string

    @IsOptional()
    @MinLength(MIN_SELF_INTRODUCTION_LENGTH)
    @MaxLength(MAX_SELF_INTRODUCTION_LENGTH)
    @IsString()
    selfIntroduction?: string

    @IsOptional()
    @IsString()
    avatorUrl?: string
}