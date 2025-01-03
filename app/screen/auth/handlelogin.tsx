import React from "react";
import { Alert } from "react-native";
import axios from "axios";
import { GoogleSignin, statusCodes, isErrorWithCode, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { useDispatch } from "react-redux";
import { setUser } from "../../(store)/userSlice";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";

GoogleSignin.configure({
  webClientId: "845286501383-anaskssv4t2mn71hddrdll74uamcgne2.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ["profile", "email"], // what API you want to access on behalf of the user, default is email and profile
  iosClientId: "845286501383-juhc485p1hrsgoegjvk0irl96vb3281d.apps.googleusercontent.com",
});
// Validation schemas
const usernameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_]+$/, ("Username can only contain letters, numbers and underscores"))
  .min(4, ("Username must be at least 4 characters"))
  .max(20, ("Username cannot exceed 20 characters"));

const emailSchema = z.string().email(("Please enter a valid email address"));

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((val) => !/\s/.test(val), "Password cannot contain spaces");

interface GoogleSignInResponse {
  data: {
    idToken: string;
    user: {
      email: string;
    };
  };
}

interface SignInProps {
  onSignInStart?: () => void;
  onSignInComplete?: () => void;
  onSignInError?: (error: any) => void;
  onSignInSuccess?: () => void;
}

interface HandleLoginProps extends SignInProps {
  usernameOrEmail: string;
  password: string;
  role: number;
}

interface GoogleSignInProps extends SignInProps {
  role: number;
}

const saveToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("userToken", token);
    console.log("Token saved successfully");
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

const HandleLogin = ({ usernameOrEmail, password, role, onSignInStart, onSignInComplete, onSignInError, onSignInSuccess }: HandleLoginProps) => {
  const dispatch = useDispatch();

  const handleLoginSubmit = async () => {
    onSignInStart?.();

    // Validate input based on whether it's an email or username
    if (usernameOrEmail.includes("@")) {
      const emailValidation = emailSchema.safeParse(usernameOrEmail);
      if (!emailValidation.success) {
        Alert.alert("Error", emailValidation.error.errors[0].message);
        onSignInComplete?.();
        return;
      }
    } else {
      const usernameValidation = usernameSchema.safeParse(usernameOrEmail);
      if (!usernameValidation.success) {
        Alert.alert("Error", usernameValidation.error.errors[0].message);
        onSignInComplete?.();
        return;
      }
    }

    // Validate password
    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      Alert.alert("Error", passwordValidation.error.errors[0].message);
      onSignInComplete?.();
      return;
    }

    try {
      let url = "";
      const data = usernameOrEmail.includes("@") ? { email: usernameOrEmail, password } : { userName: usernameOrEmail, password };

      if (role === 1) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signInPassengerWithAccountAndPassword`;
      } else if (role === 2) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signInRidderWithAccountAndPassword`;
      }

      const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response?.data) {
        await saveToken(response.data.accessToken);
        dispatch(setUser({ username: usernameOrEmail, role: role }));
        onSignInSuccess?.();
        Alert.alert("Success", `Logged in successfully as: ${usernameOrEmail}`);
      } else {
        throw new Error("Server request failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(JSON.stringify(error.response?.data.message));
        Alert.alert("Error", JSON.stringify(error.response?.data.message));
      } else {
        console.log("An unexpected error occurred:", JSON.stringify(error));
        Alert.alert("Error", "An unexpected error occurred");
      }
      onSignInError?.(error);
    } finally {
      onSignInComplete?.();
    }
  };

  return { handleLoginSubmit };
};

const HandleGoogleSignInResult = ({ role, onSignInComplete, onSignInError, onSignInSuccess }: GoogleSignInProps) => {
  const dispatch = useDispatch();

  const handleSignInResult = async (response: GoogleSignInResponse) => {
    try {
      let url = "";

      if (role === 1) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signInPassengerWithGoogleAuth`;
      } else if (role === 2) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signInRidderWithGoogleAuth`;
      }

      const data = {
        idToken: response.data.idToken,
      };

      const axiosResponse = await axios.post(url, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (axiosResponse?.data) {
        console.log(response.data);
        await saveToken(axiosResponse.data.accessToken);
        dispatch(setUser({ username: response.data.user.email, role: role }));
        onSignInSuccess?.();
        Alert.alert("Success", `Logged in successfully as: ${response.data.user.email}`);
      } else {
        throw new Error("Server request failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(JSON.stringify(error.response?.data.message));
        Alert.alert("Error", JSON.stringify(error.response?.data.message));
      } else {
        console.log("An unexpected error occurred:", JSON.stringify(error));
        Alert.alert("Error", "An unexpected error occurred");
      }
      onSignInError?.(error);
    } finally {
      onSignInComplete?.();
    }
  };

  return { handleSignInResult };
};

const HandleGoogleSignIn = ({ role, onSignInStart, onSignInComplete, onSignInError, onSignInSuccess }: GoogleSignInProps) => {
  const { handleSignInResult } = HandleGoogleSignInResult({
    role, // or any appropriate value for role
    onSignInComplete,
    onSignInError,
    onSignInSuccess,
  });

  const initiateGoogleSignIn = async () => {
    onSignInStart?.();

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        console.log(response);
        await handleSignInResult(response as GoogleSignInResponse);
      } else {
        console.log("Sign in was cancelled by user");
        onSignInComplete?.();
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
            console.error("An unexpected error occurred:", error);
            break;
        }
        onSignInError?.(error);
      } else {
        console.error("Non-status code error:", error);
        onSignInError?.(error);
      }
    } finally {
      onSignInComplete?.();
    }
  };

  return { initiateGoogleSignIn };
};

export { HandleLogin, HandleGoogleSignIn, HandleGoogleSignInResult };
