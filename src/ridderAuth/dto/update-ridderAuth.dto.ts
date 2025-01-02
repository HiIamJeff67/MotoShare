import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderEmailPasswordDto } from './create-ridderAuth.dto';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ValidateRidderInfoDto {
    @IsNotEmpty()
    @IsString()
    authCode: string
}

export class ResetRidderPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
    
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

export class UpdateRidderEmailPasswordDto extends PartialType(CreateRidderEmailPasswordDto) {
    @IsNotEmpty()
    @IsString()
    authCode: string
}

export class BindRidderDefaultAuthDto {
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

export class BindRidderGoogleAuthDto {
    @IsNotEmpty()
    @IsString()
    idToken: string
}