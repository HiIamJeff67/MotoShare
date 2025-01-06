import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert, ScrollView, View } from "react-native";
import { BindingsStyles } from "./Bindings.style";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(store)";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import AppInfoCard from "@/app/component/AppInfoCard/AppInfoCard";
import AnimatedInputMessage from "@/app/component/InputMessage/AnimatedInputMessage";
import axios from "axios";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { setUserAuths } from "@/app/(store)/userSlice";
import { isAuthCode } from "@/app/methods/isAuthCode";
import { useTranslation } from "react-i18next";
import { GoogleSignin, statusCodes, isErrorWithCode, isSuccessResponse } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "845286501383-anaskssv4t2mn71hddrdll74uamcgne2.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  iosClientId: "845286501383-juhc485p1hrsgoegjvk0irl96vb3281d.apps.googleusercontent.com",
  scopes: ["profile", "email"], // what API you want to access on behalf of the user, default is email and profile
});

export type ValidateOptionNameInterface = "MotoShare" | "Email" | "Phone" | "Google";

const Bindings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [validateOptionName, setValidateOptionName] = useState<ValidateOptionNameInterface | null>(null);
  const [styles, setStyles] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isLoading) {
      navigation.setOptions({
        gestureEnabled: false,
      });

      unsubscribe = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      if (lockButton) {
        navigation.setOptions({
          gestureEnabled: true,
        });
        if (unsubscribe) {
          unsubscribe();
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "welcome" }],
          })
        );
      }
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoading, navigation]);

  useEffect(() => {
    if (theme) {
      setStyles(BindingsStyles(theme));
    }
  }, [theme]);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    };

    fetchToken();
  }, []);

  const handleBindDefaultAuthentication = async (inputValues: string[]) => {
    const showAlertMessage = (title: string, content: string) => {
      Alert.alert(
        title,
        content,
        [
          {
            text: t("confirm"),
            onPress: () => {},
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    };

    setIsLoading(true);
    setLockButton(true);
    inputValues = inputValues.filter((value) => value);
    const [email, password] = [inputValues[0], inputValues[1]];
    if (token && token.length !== 0) {
      try {
        const response = await api.put(
          user.role === "Passenger" ? "/passengerAuth/bindDefaultAuth" : "/ridderAuth/bindDefaultAuth",
          { email: email, password: password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          dispatch(setUserAuths({ isDefaultAuthenticated: true }));
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data); // 檢查伺服器回應
          showAlertMessage("綁定錯誤", error.response?.data);
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsLoading(false);
        setLockButton(false);
        setValidateOptionName(null);
      }
    }
  };

  const handleSendAuthCodeForEmailAuthentication = async () => {
    if (token && token.length !== 0) {
      try {
        await api.get(user.role === "Passenger" ? "/passengerAuth/sendAuthCodeForEmail" : "/ridderAuth/sendAuthCodeForEmail", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.log(error);
        Alert.alert(t("The verification code sent to this email failed"));
      }
    }
  };

  const handleValidateAuthCodeForEmailAuthentication = async (inputValues: string[]) => {
    const showAlertMessage = () => {
      Alert.alert(
        t("verification code error"),
        t("You must enter the correct verification code to continue"),
        [
          {
            text: t("confirm"),
            onPress: () => {},
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    };

    setIsLoading(true);
    setLockButton(true);
    const authCode = inputValues.filter((value) => value)[0];
    if (!isAuthCode(authCode)) showAlertMessage();

    if (token && token.length !== 0) {
      try {
        const response = await api.post(
          user.role === "Passenger" ? "/passengerAuth/validateAuthCodeForEmail" : "/ridderAuth/validateAuthCodeForEmail",
          { authCode: authCode },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          dispatch(setUserAuths({ isEmailAuthenticated: true }));
        }
      } catch (error) {
        console.log(error);
        showAlertMessage();
      } finally {
        setIsLoading(false);
        setLockButton(false);
        setValidateOptionName(null);
      }
    }
  };

  const googleEmailVerify = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        console.log(response);
        Alert.alert("Google 登入成功", `你的Google Email是：${response.data.user.email}`);
      } else {
        console.log("Sign in was cancelled by user");
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
      } else {
        console.error("Non-status code error:", error);
      }
    } finally {
    }
  };

  return isLoading || !styles || !theme || !user.auth ? (
    <LoadingWrapper />
  ) : (
    <ScrollView>
      <View style={styles.container}>
        <AppInfoCard
          iconSource={require("../../../assets/images/motorbike.jpg")}
          title={t("MotoShare")}
          description={t("provide email")}
          status={user.auth.isDefaultAuthenticated}
          callBack={() => setValidateOptionName("MotoShare")}
          isOpaqued={user.auth.isDefaultAuthenticated}
          theme={theme}
        />
        {validateOptionName === "MotoShare" && (
          <AnimatedInputMessage
            title={t("Bind to MotoShare (default)")}
            content={t(
              "If the previous registration or binding method provided us with an email, you can also choose to keep and continue to use that email."
            )}
            theme={theme}
            inputAttributes={[
              {
                placeholder: t("email"),
                isSecureText: false,
                defaultValue: user.email,
              },
              {
                placeholder: t("password"),
                isSecureText: true,
              },
            ]}
            leftOptionTitle={t("bind")}
            leftOptionCallBack={handleBindDefaultAuthentication}
            rightOptionTitle={t("cancel")}
            rightOptionCallBack={() => setValidateOptionName(null)}
          />
        )}
        <AppInfoCard
          iconSource={require("../../../assets/images/email.png")}
          title={t("email")}
          description={t(
            "Please verify your email to let us confirm your identity. Through this verification, you can give a review or star rating after the order is completed"
          )}
          status={user.auth.isEmailAuthenticated}
          callBack={() => setValidateOptionName("Email")}
          isOpaqued={user.auth.isEmailAuthenticated}
          theme={theme}
          isNotColorful={true}
        />
        {validateOptionName === "Email" && (
          <AnimatedInputMessage
            title={t("verification email")}
            content={`${t("This action will send an email with a verification code to your current email address")}(${user.email}) ${t(
              "Once you receive the verification code, please enter it below and send it to let us know it's you"
            )}`}
            theme={theme}
            inputAttributes={[
              {
                placeholder: t("verification code"),
                isSecureText: false,
                inputSideButton: {
                  title: t("code"),
                  callback: handleSendAuthCodeForEmailAuthentication,
                },
              },
            ]}
            leftOptionTitle={t("verify")}
            leftOptionCallBack={handleValidateAuthCodeForEmailAuthentication}
            rightOptionTitle={t("send code")}
            rightOptionCallBack={() => setValidateOptionName(null)}
          />
        )}
        <AppInfoCard
          iconSource={require("../../../assets/images/phone-call.png")}
          title={t("verify phone number")}
          description={t(
            "Please verify your phone number to let us confirm your identity. Although this will not directly affect your experience, it can make other users trust you more"
          )}
          status={user.auth.isPhoneAuthenticated}
          callBack={() => setValidateOptionName("Phone")}
          isOpaqued={user.auth.isPhoneAuthenticated}
          theme={theme}
          isNotColorful={true}
        />
        {validateOptionName === "Phone" && (
          <AnimatedInputMessage
            title={t("verify phone number")}
            content={t("Please enter a Taiwan phone number (09XX-XXX-XXX). You do not need to enter the beginning of the phone number in any region")}
            theme={theme}
            inputAttributes={[
              {
                placeholder: t("phone 886"),
                isSecureText: false,
                inputSideButton: {
                  title: "code",
                  callback: () => {},
                },
              },
            ]}
            leftOptionTitle={t("verify")}
            leftOptionCallBack={() => {}}
            rightOptionTitle={t("cancel")}
            rightOptionCallBack={() => setValidateOptionName(null)}
          />
        )}
        <AppInfoCard
          iconSource={require("../../../assets/images/google.png")}
          title="Google"
          description={t("Bind your Google account, and then log in to quickly log in through Google")}
          status={user.auth.isGoogleAuthenticated}
          callBack={() => setValidateOptionName("Google")}
          isOpaqued={user.auth.isGoogleAuthenticated}
          theme={theme}
        />
        {validateOptionName === "Google" && (
          <AnimatedInputMessage
            title="綁定Google帳戶"
            content="請登入你的 Google 電郵以綁定你的 Google 帳戶。"
            theme={theme}
            leftOptionTitle="登入"
            leftOptionCallBack={googleEmailVerify}
            rightOptionTitle="取消"
            rightOptionCallBack={() => setValidateOptionName(null)}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default Bindings;
