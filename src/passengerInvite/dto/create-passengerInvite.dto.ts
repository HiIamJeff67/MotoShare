import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePassengerInviteDto {
    @IsOptional()
    @IsString()
    briefDescription: string

    @IsNotEmpty()
    @IsNumber()
    suggestPrice: number

    @IsNotEmpty()
    @IsNumber()
    startCordLongitude: number

    @IsNotEmpty()
    @IsNumber()
    startCordLatitude: number

    @IsNotEmpty()
    @IsNumber()
    endCordLongitude: number

    @IsNotEmpty()
    @IsNumber()
    endCordLatitude: number

    @IsOptional()
    @IsDate()
    suggestStartAfter?: Date
}
