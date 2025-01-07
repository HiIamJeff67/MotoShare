import React, { useState } from "react";
import {
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Image,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useEffect, useRef } from "react";
import {
  useNavigation,
  CommonActions,
  useRoute,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserRoleType } from "@/app/(store)/interfaces/userState.interface";
import axios from "axios";
import { z } from "zod";
import { set } from "lodash";

const emailSchema = z.string().email("請輸入有效的電子郵件地址");

const passwordSchema = z
  .string()
  .min(8, "密碼至少需要8個字元")
  .regex(/[a-z]/, "密碼必須包含至少一個小寫字母")
  .regex(/[A-Z]/, "密碼必須包含至少一個大寫字母")
  .regex(/[0-9]/, "密碼必須包含至少一個數字")
  .regex(/[@$!%*?&]/, "密碼必須包含至少一個特殊字元 @$!%*?&")
  .refine((val) => !/\s/.test(val), "密碼不能包含空格");

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [con, setCon] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [lockButton, setLockButton] = useState(false);
  const route = useRoute();
  const { role } = route.params as { role: UserRoleType };
  const { t } = useTranslation();

  // 監控 loading 狀態變化，禁用或恢復返回
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (loading || loading2) {
      // 禁用手勢返回並隱藏返回按鈕
      navigation.setOptions({
        gestureEnabled: false,
      });

      // 禁用物理返回按鈕
      unsubscribe = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault(); // 禁用返回
      });
    } else {
      // 恢復手勢返回和返回按鈕
      navigation.setOptions({
        gestureEnabled: true,
      });

      // 移除返回監聽器
      if (unsubscribe) {
        unsubscribe();
      }

      if (lockButton) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "login",
                params: {
                  role: role,
                },
              },
            ],
          })
        );
      }
    }

    // 在組件卸載時移除監聽器
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loading, navigation, loading2]);

  const sendVerificationCode = async () => {
    setLoading(true);

    // Validate email
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      Alert.alert("錯誤", emailValidation.error.errors[0].message, [
        { onPress: () => setLoading(false) },
      ]);
      return;
    }

    try {
      let url = "";

      if (role === "Passenger") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/passengerAuth/sendAuthCodeToResetForgottenPassword`;
      } else if (role === "Ridder") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/ridderAuth/sendAuthCodeToResetForgottenPassword`;
      }

      const response = await axios.post(
        url,
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      Alert.alert("成功", "驗證碼已發送至您的電子郵件");
      setCon(true);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [
          { onPress: () => setLoading(false) },
        ]);
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤", [
          { onPress: () => setLoading(false) },
        ]);
      }
    }
  };

  const resetPassword = async () => {
    setLoading2(true);

    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      Alert.alert("錯誤", passwordValidation.error.errors[0].message, [
        { onPress: () => setLoading2(false) },
      ]);
      return;
    }

    if (password !== password2) {
      Alert.alert("錯誤", "密碼不一致", [
        { onPress: () => setLoading2(false) },
      ]);
      return;
    }

    try {
      let url = "";

      if (role === "Passenger") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/passengerAuth/validateAuthCodeToResetForgottenPassword`;
      } else if (role === "Ridder") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/ridderAuth/validateAuthCodeToResetForgottenPassword`;
      }

      const response = await axios.post(
        url,
        {
          authCode: verificationCode,
          password: password,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      setLoading2(false);
      setLockButton(true);
      Alert.alert("成功", "密碼重置成功");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [
          { onPress: () => setLoading2(false) },
        ]);
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤", [
          { onPress: () => setLoading2(false) },
        ]);
      }
    }
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        transform: [{ translateY }],
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#ffffff",
          paddingTop: verticalScale(insets.top),
          paddingBottom: verticalScale(insets.bottom),
          paddingHorizontal: scale(20), // 設置水平間距
        }}
        keyboardShouldPersistTaps="handled" // 確保使用者能點擊非鍵盤區域關閉鍵盤
      >
        {/* 根據平台條件設置 StatusBar */}
        {Platform.OS === "ios" ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="light-content" hidden={true} />
        )}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/motorbike.jpg")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{role == "Passenger" ? t("passenger account recovery") : t("rider account recovery")}</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Image
            source={require("../../../assets/images/email.png")}
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput} // 调整宽度
            placeholder={t("email")}
            placeholderTextColor="#626262"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Image
            source={require("../../../assets/images/password.png")}
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t("code")}
            placeholderTextColor="#626262"
            value={verificationCode}
            onChangeText={(text) => setVerificationCode(text)}
          />
          <Pressable
            style={[styles.sendButton]} // 添加小按钮样式
            onPress={sendVerificationCode}
            disabled={loading || lockButton} // 禁用按钮
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.sendButtonText}>{t("send")}</Text> // 按钮文字
            )}
          </Pressable>
        </View>

        <View style={styles.inputWrapper}>
          <Image
            source={require("../../../assets/images/password.png")}
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t("new password")}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            editable={con}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Image
            source={require("../../../assets/images/password.png")}
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t("confirm new password")}
            secureTextEntry={true}
            value={password2}
            onChangeText={setPassword2}
            editable={con}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.centerAlign}>
          <Pressable
            style={styles.loginButton}
            onPress={resetPassword}
            disabled={loading2 || lockButton || !con}
          >
            {loading2 ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>{t("confirm")}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    height: "100%",
    borderWidth: scale(0),
    color: "#000",
    paddingLeft: scale(5),
  },
  icon: {
    width: scale(18),
    height: verticalScale(15),
    marginRight: scale(10),
  },
  inputWrapper: {
    marginTop: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(40),
    backgroundColor: "#f1f4ff",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(10),
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: scale(200),
    height: verticalScale(200),
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(10),
  },
  headerText: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#3498db",
    textAlign: "center"
  },
  centerAlign: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    marginTop: verticalScale(20),
    height: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: moderateScale(10),
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(10),
    shadowOffset: { width: scale(0), height: verticalScale(4) },
    shadowColor: "#000",
  },
  loginButtonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#fff",
  },
  forgotPasswordText: {
    marginTop: verticalScale(20),
    fontSize: moderateScale(16),
  },
  otherLoginText: {
    marginTop: verticalScale(20),
    fontSize: moderateScale(16),
    color: "#3498db",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: scale(100),
    paddingTop: verticalScale(20),
  },
  socialIcon: {
    width: scale(30),
    height: verticalScale(30),
    resizeMode: "contain",
  },
  sendText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#fff",
  },
  sendButton: {
    width: scale(60), // 设置按钮宽度
    height: verticalScale(30), // 设置按钮高度
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: moderateScale(5), // 调整按钮圆角
  },
  sendButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default ResetPasswordScreen;
