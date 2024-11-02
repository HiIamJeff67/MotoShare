import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class SignInDto {
    @ValidateIf((o) => !o.email)
    @IsNotEmpty()
    @IsAlphanumeric()
    userName: string

    @ValidateIf((o) => !o.userName)
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}