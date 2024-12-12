export declare class GetSimilarTimePurchaseOrderDto {
    startAfter: string;
    endedAt: string;
}
export declare class GetAdjacentPurchaseOrdersDto {
    cordLongitude: number;
    cordLatitude: number;
}
export declare class GetSimilarRoutePurchaseOrdersDto {
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
}
export declare class GetBetterPurchaseOrderDto {
    startAfter: string;
    endedAt: string;
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
    get _validateWholeObject(): this;
}
