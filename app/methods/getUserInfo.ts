import axios from "axios";
import { UserRoleType, UserState } from "../(store)/interfaces/userState.interface"
import { isNotEmptyString } from "./isNotEmpty"
import { setUser, setUserInfos } from "../(store)/userSlice";
import { Alert } from "react-native";
import { UserInfos } from "../(store)/interfaces/userInfos.interface";
import { Dispatch, UnknownAction } from "redux";

interface ReturnType extends Partial<UserState> {
  info: UserInfos | null;
}

export const getUserInfo = async (
  accessToken: string, 
  userRole: UserRoleType, 
  dispatch: Dispatch<UnknownAction>, 
  updateUserSlice: boolean = false
): Promise<ReturnType | undefined> => {
  console.log("still running getUserInfo...");

  if (isNotEmptyString(accessToken)) {
    try {
      const response = await axios.get(
        userRole === "Passenger"
          ? `${process.env.EXPO_PUBLIC_API_URL}/passenger/getMyInfo`
          : `${process.env.EXPO_PUBLIC_API_URL}/ridder/getMyInfo`, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      const info = response.data.info;
      console.log("getUserInfo get: ", response.data.info);

      if (updateUserSlice) {
        dispatch(setUser({ 
          userName: response.data.userName, 
          email: response.data.email, 
          role: userRole, 
        }));
        dispatch(setUserInfos({
          isOnline: info.isOnline,
          age: info.age,
          phoneNumber: info.phoneNumber,
          emergencyPhoneNumber: info.emergencyPhoneNumber,
          emergencyUserRole: info.emergencyUserRole,
          selfIntroduction: info.selfIntroduction,
          avatorUrl: info.avatorUrl,
          avgStarRating: info.avgStarRating, 
          createdAt: info.createdAt,
          updatedAt: info.updatedAt,
        }));
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(JSON.stringify(error.response?.data.message));
        Alert.alert("Error", JSON.stringify(error.response?.data.message));
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("Error", "An unexpected error occurred");
      }
    }
  }
}