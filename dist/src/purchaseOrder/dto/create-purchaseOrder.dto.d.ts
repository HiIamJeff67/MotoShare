import { PostedStatusType } from "src/interfaces/status.interface";
export declare class CreatePurchaseOrderDto {
    creatorId: string;
    description?: string;
    initPrice: number;
    startCordLongitude: number;
    startCordLatitude: number;
    endCordLongitude: number;
    endCordLatitude: number;
    createdAt?: Date;
    updatedAt?: Date;
    startAfter?: Date;
    isUrgent?: boolean;
    status?: PostedStatusType;
}
