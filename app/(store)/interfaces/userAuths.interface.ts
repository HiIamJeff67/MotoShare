export interface UserAuths {
    isEmailAuthenticated: boolean;
    isPhoneAuthenticated: boolean;
    isDefaultAuthenticated: boolean;
    isGoogleAuthenticated: boolean;
}

export const numberOfAuths = 4;

export interface SetUpUserAuthsInterface extends Partial<UserAuths> {}