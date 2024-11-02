import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}