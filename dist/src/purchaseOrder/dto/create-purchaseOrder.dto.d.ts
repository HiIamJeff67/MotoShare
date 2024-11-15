export declare class CreatePurchaseOrderDto {
    description?: string;
    initPrice: number;
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
    startAddress: string;
    endAddress: string;
    startAfter?: string;
    isUrgent?: boolean;
}
