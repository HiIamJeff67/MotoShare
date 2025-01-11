import React, { useState, useEffect, useRef } from "react";
import { useNavigation, CommonActions, useRoute, useTheme } from "@react-navigation/native";
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
import { handleRegister, handleGoogleReg } from "./HandleReg";
import { useTranslation } from "react-i18next";
import { UserRoleType } from "@/app/(store)/interfaces/userState.interface";
import { Theme } from "@/theme/theme";
import { RegisterStyles } from "./Register.style";

const PassengerReg = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const theme = useTheme() as Theme;
  const { colors } = theme;
  const route = useRoute();
  const { role } = route.params as { role: UserRoleType };
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  const [isGoogleInProgress, setIsGoogleInProgress] = useState(false);
  const styles = RegisterStyles(theme);

  const handleRegisterClick = () => {
    handleRegister({
      username,
      email,
      password,
      conPassword,
      role,
      setLoading,
      setLockButton,
    });
  };

  const handleGoogleRegClick = () => {
    handleGoogleReg({
      role,
      setIsGoogleInProgress,
      setLockButton,
    });
  };

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, (event) => {
      Animated.timing(translateY, {
        toValue: -Math.min(event.endCoordinates.height / 2, 150),
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
  }, [loading, navigation, isGoogleInProgress]);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: colors.background, 
        transform: [{ translateY }],
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: colors.background,
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
          <Text style={styles.headerText}>{role == "Passenger" ? t("passengerRegister") : t("riderRegister")}</Text>
        </View>
        <View style={styles.inputWrapper}>
          <Image
            style={styles.icon}
            source={require("../../../assets/images/user.png")}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t("userName")}
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Image
            style={styles.icon}
            source={require("../../../assets/images/email.png")}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t("email")}
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#626262"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Image
            style={styles.icon}
            source={require("../../../assets/images/password.png")}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t("password")}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Image
            style={styles.icon}
            source={require("../../../assets/images/password.png")}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t("confirmPassword")}
            secureTextEntry={true}
            value={conPassword}
            onChangeText={setConPassword}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.centerAlign}>
          <Pressable style={styles.registerButton} onPress={handleRegisterClick} disabled={isGoogleInProgress || loading || lockButton}>
            <Text style={styles.registerButtonText}>{loading ? <ActivityIndicator size="large" /> : t("register")}</Text>
          </Pressable>
        </View>

        <View style={styles.centerAlign}>
          <Text style={styles.otherRegisterText}>{t("LoginWithThirdParty")}</Text>
        </View>
        <View style={styles.socialContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              handleGoogleRegClick();
            }}
            disabled={isGoogleInProgress || loading || lockButton}
          >
            <Image source={require("../../../assets/images/google.png")} style={styles.socialIcon} />
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default PassengerReg;
