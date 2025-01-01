import { UserRoleType } from "./userState.interface";

export interface UserInfos {
    isOnline: boolean;
    age: number | null;
    phoneNumber: string | null;
    emergencyPhoneNumber: string | null;
    emergencyUserRole: UserRoleType | null;
    selfIntroduction: string | null;
    avatorUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface SetUpUserInfosInterface extends Partial<UserInfos> {}