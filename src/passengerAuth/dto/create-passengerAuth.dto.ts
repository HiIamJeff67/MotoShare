import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreatePassengerEmailPasswordDto {
    @IsNotEmpty()
    @IsEmail(
        undefined,
        { message: "E-C-006" }
    )
    email: string;

     @IsNotEmpty()
    @IsStrongPassword(
        undefined,
        { message: "E-C-007" }
    )
    oldPassword: string

     @IsNotEmpty()
    @IsStrongPassword(
        undefined,
        { message: "E-C-007" }
    )
    newPassword: string
}