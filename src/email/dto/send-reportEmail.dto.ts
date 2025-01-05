import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendReportEmailDto {
    @IsNotEmpty()
    @IsString()
    userName: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    subject: string

    @IsNotEmpty()
    @IsString()
    content: string
}