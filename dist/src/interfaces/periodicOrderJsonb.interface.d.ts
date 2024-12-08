interface PeriodicOrderJsonbInterface {
    initPrice: number;
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
    startAddress: string;
    endAddress: string;
    startAfter: Date;
    endedAt: Date;
    autoAccept?: boolean;
}
export interface PeriodicPurchaseOrderJsonbInterface extends PeriodicOrderJsonbInterface {
    isUrgent?: boolean;
}
export interface PeriodicSupplyOrderJsonbInterface extends PeriodicOrderJsonbInterface {
    tolerableRDV?: number;
}
export {};
