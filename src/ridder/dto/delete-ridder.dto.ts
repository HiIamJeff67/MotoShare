import { IsNotEmpty, IsString } from "class-validator";

export class DeleteRidderDto {
    @IsNotEmpty()
    @IsString()
    password: string;
}