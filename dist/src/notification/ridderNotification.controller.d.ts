import { RidderNotificationService } from "./ridderNotification.service";
import { RidderType } from "../interfaces";
import { Response } from "express";
export declare class RidderNotificationController {
    private ridderNotificationService;
    constructor(ridderNotificationService: RidderNotificationService);
    getMyNotifications(ridder: RidderType, id: string, response: Response): Promise<void>;
    searchMyPaginationRidderNotifications(ridder: RidderType, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    updateMyRidderNotificationToReadStatus(ridder: RidderType, id: string, response: Response): Promise<void>;
    deleteMyRidderNotifications(ridder: RidderType, id: string, response: Response): Promise<void>;
}
