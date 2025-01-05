import { PassengerPreferencesService } from './passengerPreferences.service';
import { PassengerType } from '../interfaces';
import { Response } from 'express';
export declare class PassengerPreferencesController {
    private readonly passengerPreferencesService;
    constructor(passengerPreferencesService: PassengerPreferencesService);
    createMyPreferenceByUserName(passenger: PassengerType, preferenceUserName: string, response: Response): Promise<void>;
    searchMyPaginationPreferences(passenger: PassengerType, preferenceUserName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    deleteMyPreferenceByUserName(passenger: PassengerType, preferenceUserName: string, response: Response): Promise<void>;
}
