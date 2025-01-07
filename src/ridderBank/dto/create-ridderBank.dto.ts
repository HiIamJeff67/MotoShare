import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreateRidderBankDto {}

export class CreatePaymentIntentDto {
    @IsNotEmpty()
    @IsNumberString()
    amount: string;
}