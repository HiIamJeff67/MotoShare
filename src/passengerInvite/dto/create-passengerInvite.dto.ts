import { IsDateString, IsLatitude, IsLongitude, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreatePassengerInviteDto {
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
