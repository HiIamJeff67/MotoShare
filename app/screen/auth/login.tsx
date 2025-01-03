import React, { useState, useEffect, useRef } from "react";
import { useNavigation, CommonActions, useRoute } from "@react-navigation/native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { HandleGoogleSignIn, HandleLogin } from "./handlelogin";
import { useTranslation } from 'react-i18next';

const PassengerLogin = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  const [isGoogleInProgress, setIsGoogleInProgress] = useState(false);
  const route = useRoute();
  const { role } = route.params as { role: number };
  const { t } = useTranslation();

  // Regular login handler
  const { handleLoginSubmit } = HandleLogin({
    usernameOrEmail,
    password,
    role,
    onSignInStart: () => setLoading(true),
    onSignInComplete: () => setLoading(false),
    onSignInSuccess: () => setLockButton(true),
    onSignInError: () => setLoading(false),
  });

  // Google login handler
  const { initiateGoogleSignIn } = HandleGoogleSignIn({
    role,
    onSignInStart: () => setIsGoogleInProgress(true),
    onSignInComplete: () => setIsGoogleInProgress(false),
    onSignInSuccess: () => setLockButton(true),
    onSignInError: () => setIsGoogleInProgress(false),
  });

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, (event) => {
      Animated.timing(translateY, {
        toValue: -Math.min(event.endCoordinates.height / 2, 75),
        duration: Platform.OS === "ios" ? event.duration || 200 : 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, (event) => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: Platform.OS === "ios" ? event.duration || 200 : 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [translateY]);

  const handleSocialLogin = (provider: "Google" | "Apple") => {
    Alert.alert("社交登入", `您選擇了 ${provider} 登入1111`);
    console.log("社交登入", `您選擇了 ${provider} 登入`);
  };

  // 監控 loading 狀態變化，禁用或恢復返回
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (loading || isGoogleInProgress) {
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
            routes: [{ name: "home" }],
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
  }, [loading, navigation, isGoogleInProgress]);

  const handleGoogleLogin = () => {
    initiateGoogleSignIn();
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
        {Platform.OS === "ios" ? <StatusBar barStyle="dark-content" /> : <StatusBar barStyle="light-content" hidden={true} />}
        <View style={styles.imageContainer}>
          <Image source={require("../../../assets/images/motorbike.jpg")} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {role == 1 ? t("passengerLogin") : t("riderLogin")}
          </Text>
        </View>

        <View style={styles.inputWrapper}>
          <Image source={require("../../../assets/images/user.png")} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder={t("user")}
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Image source={require("../../../assets/images/password.png")} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder={(t("password"))}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.centerAlign}>
        <Pressable
            style={styles.loginButton}
            onPress={handleLoginSubmit}
            disabled={isGoogleInProgress || loading || lockButton}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>{t("login")}</Text>
            )}
        </Pressable>
        </View>

        <View style={styles.centerAlign}>
          <Text style={styles.forgotPasswordText}>{t("forgotPassword")}</Text>
        </View>
        <View style={styles.centerAlign}>
          <Text style={styles.otherLoginText}>{t("LoginWithThirdParty")}</Text>
        </View>
        <View style={styles.socialContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              handleGoogleLogin();
            }}
            disabled={isGoogleInProgress || loading || lockButton}
          >
            <Image source={require("../../../assets/images/google.png")} style={styles.socialIcon} />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => handleSocialLogin("Apple")}>
            <Image source={require("../../../assets/images/apple.png")} style={styles.socialIcon} />
          </TouchableWithoutFeedback>
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
});

export default PassengerLogin;
