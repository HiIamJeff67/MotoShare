import { PartialType } from '@nestjs/mapped-types';
import { CreateRidderEmailPasswordDto } from './create-ridderAuth.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateRidderInfoDto {
    @IsNotEmpty()
    @IsString()
    authCode: string
}

export class ResetRidderPasswordDto {
    @IsNotEmpty()
    @IsString()
    authCode: string

    @IsNotEmpty()
    @IsString()
    password: string
}

export class UpdateRidderEmailPasswordDto extends PartialType(CreateRidderEmailPasswordDto) {
    @IsNotEmpty()
    @IsString()
    authCode: string
}
