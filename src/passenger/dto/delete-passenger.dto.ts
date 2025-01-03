import { IsOptional, IsString } from "class-validator";

export class DeletePassengerDto {
    @IsOptional()   // other authentication user may not have a password
    @IsString()
    password: string;
}