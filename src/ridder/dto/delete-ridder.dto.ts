import { IsOptional, IsString } from "class-validator";

export class DeleteRidderDto {
    @IsOptional()   // other authentication user may not have a password
    @IsString()
    password: string;
}