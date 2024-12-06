import { 
    IsBooleanString, 
    IsNumberString, 
    IsOptional, 
    IsString, 
    MaxLength, 
    MinLength
} from "class-validator";
import { 
    IsLooseTWLicenseString,
    MaxNumberString, 
    MinNumberString 
} from "../../validator";
import { MAX_AGE, MIN_AGE } from "../../constants/info.constant";
import { MAX_SELF_INTRODUCTION_LENGTH, MIN_SELF_INTRODUCTION_LENGTH } from "../../constants/context.constant";
import { IsPhoneNumberString } from "../../validator/IsPhoneNumberString.validator";
import { AllowedPhoneNumberTypes } from "../../types";

export class CreateRidderInfoDto {
    // instead of using @IsOptional decorator for the optional fields,
    // we use default value of null, so that we can easily insert data with dto form to our database
    // (since our database accept null value of these fields)

    @IsOptional()
    @IsBooleanString()
    isOnline?: boolean

    @IsOptional()
    @MinNumberString(MIN_AGE)
    @MaxNumberString(MAX_AGE)
    @IsNumberString()
    age?: number

    @IsOptional()
    @IsPhoneNumberString("+886", AllowedPhoneNumberTypes)
    @IsNumberString()
    phoneNumber?: string

    @IsOptional()
    @MinLength(MIN_SELF_INTRODUCTION_LENGTH)
    @MaxLength(MAX_SELF_INTRODUCTION_LENGTH)
    @IsString()
    selfIntroduction?: string

    @IsOptional()
    @IsLooseTWLicenseString()
    @IsString()
    motocycleLicense?: string

    @IsOptional()
    @IsString()
    motocycleType?: string
}
