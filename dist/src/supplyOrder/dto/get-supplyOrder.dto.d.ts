export declare class GetSimilarTimeSupplyOrderDto {
    startAfter: string;
    endedAt: string;
}
export declare class GetAdjacentSupplyOrdersDto {
    cordLongitude: number;
    cordLatitude: number;
}
export declare class GetSimilarRouteSupplyOrdersDto {
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
}
export declare class GetBetterSupplyOrderDto {
    startAfter: string;
    endedAt: string;
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
    get _validateWholeObject(): this;
}
