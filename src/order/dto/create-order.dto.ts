import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    ridderId: string

    @IsNotEmpty()
    @IsString()
    passengerId: string

    @IsNotEmpty()
    @IsNumber()
    finalPrice: number

    @IsNotEmpty()
    @IsNumber()
    passengerStartLongitude: number

    @IsNotEmpty()
    @IsNumber()
    passengerStartLatitude: number

    @IsNotEmpty()
    @IsNumber()
    passengerEndLongitude: number
    
    @IsNotEmpty()
    @IsNumber()
    passengerEndLatitude: number

    @IsNotEmpty()
    @IsNumber()
    ridderStartLongitude: number

    @IsNotEmpty()
    @IsNumber()
    ridderStartLatitude: number

    @IsOptional()
    @IsDate()
    startAfter?: Date
}

export class CreateOrderByPassengerDto {
    @IsNotEmpty()
    @IsString()
    id: string  // passengerId

    @IsNotEmpty()
    @IsString()
    orderId: string

    @IsNotEmpty()
    @IsNumber()
    passengerStartLongitude: number

    @IsNotEmpty()
    @IsNumber()
    passengerStartLatitude: number

    @IsNotEmpty()
    @IsNumber()
    passengerEndLongitude: number
    
    @IsNotEmpty()
    @IsNumber()
    passengerEndLatitude: number
}