import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class PassengerPreferencesService {
    private db;
    constructor(db: DrizzleDB);
    createPassengerPreferenceByPreferenceUserName(userId: string, preferenceUserName: string): Promise<{}[] | undefined>;
    searchPaginationPassengerPreferences(userId: string, preferenceUserName: string | undefined, limit: number, offset: number): Promise<{
        preferenceUserName: string | null;
        preferenceUserAvatorUrl: string | null;
        isPreferenceUserOnline: boolean | null;
    }[]>;
    deletePassengerPreferenceByUserIdAndPreferenceUserId(userId: string, preferenceUserName: string): Promise<{}[] | undefined>;
}
