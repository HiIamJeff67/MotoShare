import { IsBoolean, IsBooleanString, IsInt, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreatePassengerInfoDto {
    // instead of using @IsOptional decorator for the optional fields,
    // we use default value of null, so that we can easily insert data with dto form to our database
    // (since our database accept null value of these fields)

    @IsOptional()
    @IsBooleanString()
    isOnline?: boolean

    @IsOptional()
    @IsNumberString()
    age?: number

    @IsOptional()
    @IsNumberString()
    phoneNumber?: string

    @IsOptional()
    @IsString()
    selfIntroduction?: string

    @IsOptional()
    @IsString()
    avatorUrl?: string
}