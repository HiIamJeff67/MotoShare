import { 
    IsBooleanString, 
    IsNumberString, 
    IsOptional, 
    IsString, 
    MaxLength, 
    MinLength 
} from "class-validator";
import { 
    IsIntString,
    IsNotEqualTo,
    MaxNumberString, 
    MinNumberString 
} from "../../validator";
import { MAX_SELF_INTRODUCTION_LENGTH, MIN_SELF_INTRODUCTION_LENGTH } from "../../constants/context.constant";
import { MAX_AGE, MIN_AGE } from "../../constants/info.constant";
import { IsPhoneNumberString } from "../../validator/IsPhoneNumberString.validator";
import { AllowedPhoneNumberTypes } from "../../types";

export class CreatePassengerInfoDto {
    // instead of using @IsOptional decorator for the optional fields,
    // we use default value of null, so that we can easily insert data with dto form to our database
    // (since our database accept null value of these fields)

    @IsOptional()
    @IsBooleanString()
    isOnline?: boolean

    @IsOptional()
    @IsIntString()
    @MinNumberString(MIN_AGE)
    @MaxNumberString(MAX_AGE)
    age?: number

    @IsOptional()
    @IsPhoneNumberString("+886", AllowedPhoneNumberTypes)
    @IsNumberString()
    phoneNumber?: string

    @IsOptional()
    @IsPhoneNumberString("+886", AllowedPhoneNumberTypes)
    @IsNotEqualTo("phoneNumber")
    @IsNumberString()
    emergencyPhoneNumber?: string

    @IsOptional()
    @MinLength(MIN_SELF_INTRODUCTION_LENGTH)
    @MaxLength(MAX_SELF_INTRODUCTION_LENGTH)
    @IsString()
    selfIntroduction?: string
}