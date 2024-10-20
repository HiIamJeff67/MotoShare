export declare class CreatePurchaseOrderDto {
    description?: string;
    initPrice: number;
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
    startAfter?: Date;
    isUrgent?: boolean;
}
