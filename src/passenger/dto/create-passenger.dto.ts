import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreatePassengerDto {
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
