import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { CustomTextLength } from "../../validator";

export class SignUpDto {
    @IsNotEmpty()
    @Validate(
        CustomTextLength, [3, 20], 
        { message: "E-C-004" }
    )
    @IsAlphanumeric(
        undefined, 
        { message: "E-C-005" }
    )
    userName: string;

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
    // the strong password is defined as: 
    // password should contain and only contain
    // lowercase and uppercase english letters, number, sign,
    // and its length must be longer than 8
    password: string;
}

export class GoogleSignUpDto {
    @IsNotEmpty()
    @IsEmail(
        undefined,
        { message: "E-C-006" }
    )
    email: string;

    @IsNotEmpty()
    @IsString()
    idToken: string;
}