import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRidderEmailPasswordDto {
    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsNotEmpty()
    @IsString()
    newPassword: string
}