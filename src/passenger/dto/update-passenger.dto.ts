import { IsAlphanumeric, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdatePassengerDto {
    @IsOptional()
    @IsAlphanumeric()
    userName: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password: string;
}
