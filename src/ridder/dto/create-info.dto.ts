import { IsAlphanumeric, IsBoolean, IsBooleanString, IsInt, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateRidderInfoDto {
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
    motocycleLicense?: string

    @IsOptional()
    @IsString()
    motocylePhotoUrl?: string

    @IsOptional()
    @IsString()
    motocycleType?: string

    @IsOptional()
    @IsString()
    avatorUrl?: string
}
