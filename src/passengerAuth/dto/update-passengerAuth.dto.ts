import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, ValidateIf } from 'class-validator';
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
    @IsStrongPassword(
        undefined,
        { message: "E-C-007" }
    )
    password: string
}

export class UpdatePassengerEmailPasswordDto extends PartialType(CreatePassengerEmailPasswordDto) {
    @IsNotEmpty()
    @IsString()
    authCode: string
}

export class BindPassengerDefaultAuthDto {
    @IsNotEmpty()
    @IsEmail(
        undefined,
        { message: "E-C-006" }
    )
    email: string

    @IsNotEmpty()
    @IsStrongPassword(
        undefined,
        { message: "E-C-007" }
    )
    password: string
}

export class BindPassengerGoogleAuthDto {
    @IsNotEmpty()
    @IsString()
    idToken: string
}