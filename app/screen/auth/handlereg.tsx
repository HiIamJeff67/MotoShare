import React from "react";
import axios from "axios";
import { Alert } from "react-native";
import { GoogleSignin, isErrorWithCode, statusCodes, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { z } from "zod";

GoogleSignin.configure({
  webClientId: "845286501383-anaskssv4t2mn71hddrdll74uamcgne2.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ["profile", "email"], // what API you want to access on behalf of the user, default is email and profile
  iosClientId: "845286501383-juhc485p1hrsgoegjvk0irl96vb3281d.apps.googleusercontent.com",
});

const usernameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_]+$/, "使用者名稱只能包含英文字母、數字和底線")
  .min(4, "使用者名稱至少需要4個字元")
  .max(20, "使用者名稱最多20個字元");

const passwordSchema = z
  .string()
  .min(8, "密碼至少需要8個字元")
  .regex(/[a-z]/, "密碼必須包含至少一個小寫字母")
  .regex(/[A-Z]/, "密碼必須包含至少一個大寫字母")
  .regex(/[0-9]/, "密碼必須包含至少一個數字")
  .regex(/[@$!%*?&]/, "密碼必須包含至少一個特殊字元 @$!%*?&")
  .refine((val) => !/\s/.test(val), "密碼不能包含空格");

const emailSchema = z.string().email("請輸入有效的電子郵件地址");

interface RegisterParams {
  username: string;
  email: string;
  password: string;
  conPassword: string;
  role: number;
  setLoading: (value: boolean) => void;
  setLockButton: (value: boolean) => void;
}

interface GoogleRegParams {
  role: number;
  setIsGoogleInProgress: (value: boolean) => void;
  setLockButton: (value: boolean) => void;
}

export const handleGoogleReg2 = async (
  response: any,
  role: number,
  setIsGoogleInProgress: (value: boolean) => void,
  setLockButton: (value: boolean) => void
) => {
  try {
    const data = {
      email: response.data.user.email,
      idToken: response.data.idToken,
    };

    let url = "";

    if (role === 1) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signUpPassengerWithGoogleAuth`;
    } else if (role === 2) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signUpRidderWithGoogleAuth`;
    }

    const axiosResponse = await axios.post(url, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (axiosResponse && axiosResponse.data) {
      console.log(axiosResponse.data);
      setLockButton(true);
      setIsGoogleInProgress(false);
      Alert.alert("成功", `註冊成功，使用者：${response.data.user.email}`);
    } else {
      Alert.alert("錯誤", "請求伺服器失敗", [{ onPress: () => setIsGoogleInProgress(false) }]);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(JSON.stringify(error.response?.data.message));
      Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [{ onPress: () => setIsGoogleInProgress(false) }]);
    } else {
      console.log("An unexpected error occurred:", JSON.stringify(error));
      Alert.alert("錯誤", "發生意外錯誤", [{ onPress: () => setIsGoogleInProgress(false) }]);
    }
  }
};

export const handleGoogleReg = async ({ role, setIsGoogleInProgress, setLockButton }: GoogleRegParams) => {
  setIsGoogleInProgress(true);

  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      handleGoogleReg2(response, role, setIsGoogleInProgress, setLockButton);
    } else {
      setIsGoogleInProgress(false);
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.error("SIGN_IN_CANCELLED");
          break;
        case statusCodes.IN_PROGRESS:
          console.error("IN_PROGRESS");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error("PLAY_SERVICES_NOT_AVAILABLE");
          break;
        default:
      }
      setIsGoogleInProgress(false);
    } else {
      setIsGoogleInProgress(false);
    }
  }
};

export const handleRegister = async ({ username, email, password, conPassword, role, setLoading, setLockButton }: RegisterParams) => {
  setLoading(true);

  // Validate username
  const usernameValidation = usernameSchema.safeParse(username);
  if (!usernameValidation.success) {
    Alert.alert("錯誤", usernameValidation.error.errors[0].message, [{ onPress: () => setLoading(false) }]);
    return;
  }

  // Validate email
  const emailValidation = emailSchema.safeParse(email);
  if (!emailValidation.success) {
    Alert.alert("錯誤", emailValidation.error.errors[0].message, [{ onPress: () => setLoading(false) }]);
    return;
  }

  // Validate password
  const passwordValidation = passwordSchema.safeParse(password);
  if (!passwordValidation.success) {
    Alert.alert("錯誤", passwordValidation.error.errors[0].message, [{ onPress: () => setLoading(false) }]);
    return;
  }

  if (password !== conPassword) {
    Alert.alert("錯誤", "密碼不一致", [{ onPress: () => setLoading(false) }]);
    return;
  }

  try {
    let url = "";

    if (role === 1) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signUpPassengerWithUserNameAndEmailAndPassword`;
    } else if (role === 2) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signUpRidderWithUserNameAndEmailAndPassword`;
    }

    const response = await axios.post(
      url,
      {
        userName: username,
        email: email,
        password: password,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (response) {
      console.log(response);
      setLockButton(true);
      setLoading(false);
      Alert.alert("成功", `註冊成功，使用者：${username}`);
    } else {
      Alert.alert("錯誤", "請求伺服器失敗", [{ onPress: () => setLoading(false) }]);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(JSON.stringify(error.response?.data.message));
      Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [{ onPress: () => setLoading(false) }]);
    } else {
      console.log("An unexpected error occurred:", JSON.stringify(error));
      Alert.alert("錯誤", "發生意外錯誤", [{ onPress: () => setLoading(false) }]);
    }
  }
};
