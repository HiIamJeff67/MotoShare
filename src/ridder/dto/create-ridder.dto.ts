import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateRidderDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
