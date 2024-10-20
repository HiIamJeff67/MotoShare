import { IsNotEmpty, IsNumber } from "class-validator";

export class GetCurAdjacentSupplyOrderDto {
    @IsNotEmpty()
    @IsNumber()
    curLongitude: number

    @IsNotEmpty()
    @IsNumber()
    curLatitude: number
}