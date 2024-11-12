import { IsAlphanumeric, IsEmail, IsNotEmpty, IsStrongPassword, Validate } from "class-validator";
import { CustomTextLength } from "../../validator";

export class CreatePassengerDto {
    @IsNotEmpty()
    @Validate(
        CustomTextLength, [3, 20], 
        { message: "The userName must be longer than 3 and shorter than 20 characters" }
    )
    @IsAlphanumeric(
        undefined, 
        { message: "The userName must be lowercase or uppercase english letters or numbers" }
    )
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}