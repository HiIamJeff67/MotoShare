import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateRidderInviteDto {
    @IsOptional()
    @IsString()
    briefDescription?: string

    @IsNotEmpty()
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

    @IsOptional()
    @IsDateString()
    suggestStartAfter?: Date
}
