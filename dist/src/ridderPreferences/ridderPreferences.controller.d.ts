import { RidderPreferencesService } from './ridderPreferences.service';
import { RidderType } from '../interfaces';
import { Response } from 'express';
export declare class RidderPreferencesController {
    private readonly ridderPreferencesService;
    constructor(ridderPreferencesService: RidderPreferencesService);
    createMyPreferenceByUserName(ridder: RidderType, preferenceUserName: string, response: Response): Promise<void>;
    searchMyPaginationPreferences(ridder: RidderType, preferenceUserName: string | undefined, limit: string | undefined, offset: string | undefined, response: Response): Promise<void>;
    deleteMyPreferenceByUserName(ridder: RidderType, preferenceUserName: string, response: Response): Promise<void>;
}
