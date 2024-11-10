export declare class CreateOrderDto {
    ridderId: string;
    passengerId: string;
    finalPrice: number;
    passengerStartLongitude: number;
    passengerStartLatitude: number;
    passengerEndLongitude: number;
    passengerEndLatitude: number;
    ridderStartLongitude: number;
    ridderStartLatitude: number;
    startAfter?: Date;
}
export declare class CreateOrderByPassengerDto {
    id: string;
    orderId: string;
    passengerStartLongitude: number;
    passengerStartLatitude: number;
    passengerEndLongitude: number;
    passengerEndLatitude: number;
}
