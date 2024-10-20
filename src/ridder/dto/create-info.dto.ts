import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateRidderInfoDto {
    // instead of using @IsOptional decorator for the optional fields,
    // we use default value of null, so that we can easily insert data with dto form to our database
    // (since our database accept null value of these fields)

    @IsOptional()
    @IsBoolean()
    isOnline?: boolean

    @IsOptional()
    @IsInt()
    age?: number

    @IsOptional()
    @IsString()
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
    avatorUrl?: string
}
