import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { CreatePassengerEmailPasswordDto } from './create-passengerAuth.dto';
import { PartialType } from '@nestjs/mapped-types';

export class ValidatePassengerInfoDto {
    @IsNotEmpty()
    @IsString()
    authCode: string
}

export class ResetPassengerPasswordDto {
    @IsNotEmpty()
    @IsString()
    authCode: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class UpdatePassengerEmailPasswordDto extends PartialType(CreatePassengerEmailPasswordDto) {
    @IsNotEmpty()
    @IsString()
    authCode: string
}
