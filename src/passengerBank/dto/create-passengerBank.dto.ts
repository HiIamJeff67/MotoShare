import { IsNotEmpty, IsNumberString } from "class-validator";

export class CreatePassengerBankDto {}

export class CreatePaymentIntentDto {
    @IsNotEmpty()
    @IsNumberString()
    amount: string;
}