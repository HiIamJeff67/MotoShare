import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePassengerInfoDto {
    @IsNotEmpty()
    @IsString()
    userId: string

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
    avatorUrl?: string
}