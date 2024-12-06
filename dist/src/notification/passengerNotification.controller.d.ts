import { PassengerNotificationService } from "./passenerNotification.service";
import { PassengerType } from "../interfaces";
import { Response } from "express";
export declare class PassengerNotificationController {
    private passengerNotificationService;
    constructor(passengerNotificationService: PassengerNotificationService);
    getMyNotifications(passenger: PassengerType, id: string, response: Response): Promise<void>;
    searchMyPaginationPassengerNotifications(passenger: PassengerType, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    updateMyPassengerNotificationToReadStatus(passenger: PassengerType, id: string, response: Response): Promise<void>;
    deleteMyPassengerNotifications(passenger: PassengerType, id: string, response: Response): Promise<void>;
}
