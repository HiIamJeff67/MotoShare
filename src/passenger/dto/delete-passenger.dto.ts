import { IsNotEmpty, IsString } from "class-validator";

export class DeletePassengerDto {
    @IsNotEmpty()
    @IsString()
    password: string;
}