import { UserRoleType } from "./userState.interface";

export interface UserInfos {
    isOnline: boolean;
    age: string | null;
    phoneNumber: string | null;
    emergencyPhoneNumber: string | null;
    emergencyUserRole: UserRoleType | null;
    selfIntroduction: string | null;
    avatorUrl: string | null;
    avgStarRating: number | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface SetUpUserInfosInterface extends Partial<UserInfos> {}