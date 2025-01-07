export type UserRoleType = 
"Passenger" | 
"Ridder"    ;

export interface UserState {
    userName: string;
    role: UserRoleType | null;
    email: string;
}

export interface SetUpUserStateInterface extends UserState {}