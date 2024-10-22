import { IsNotEmpty, IsString } from "class-validator";

export class SignInPassengerDto {
    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}