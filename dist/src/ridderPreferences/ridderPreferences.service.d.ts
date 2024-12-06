import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class RidderPreferencesService {
    private db;
    constructor(db: DrizzleDB);
    createRidderPreferenceByPreferenceUserName(userId: string, preferenceUserName: string): Promise<{}[] | undefined>;
    searchPaginationRidderPreferences(userId: string, preferenceUserName: string | undefined, limit: number, offset: number): Promise<{
        preferenceUserName: string | null;
        preferenceUserAvatorUrl: string | null;
        isPreferenceUserOnline: boolean | null;
    }[]>;
    deleteRidderPreferenceByUserIdAndPreferenceUserId(userId: string, preferenceUserName: string): Promise<{}[] | undefined>;
}
