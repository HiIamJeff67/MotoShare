import { Text, Image, View, Pressable, Animated, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../(store)";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { scale, verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { clearUser, setUserAuths, setUserInfos } from "../(store)/userSlice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { ProfileScreenStyles } from "./Profile.style";
import { useEffect, useState } from "react";
import LoadingWrapper from "../component/LoadingWrapper/LoadingWrapper";
import SettingButton from "../component/SettingButton/SettingButton";
import AnimatedCheckMessage from "../component/CheckMessage/AnimatedCheckMessage";
import AnimatedInputMessage from "../component/InputMessage/AnimatedInputMessage";
import AbsoluteLoadingWrapper from "../component/AbsoluteLoadingWrapper/AbsoluteLoadingWrapper";
import { hideAbsoluteLoading, showAbsoluteLoading } from "../(store)/loadingSlice";
import { numberOfAuths } from "../(store)/interfaces/userAuths.interface";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const isAbsoluteLoading = useSelector((state: RootState) => state.loading.isLoading);
  const theme = user.theme;
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [checkLogoutMessageDisplay, setCheckLogoutMessageDisplay] = useState<boolean>(false);
  const [checkDeleteMeMessageDisplay, setCheckDeleteMeMessageDisplay] = useState<boolean>(false);
  const [styles, setStyles] = useState<any>(null);
  const clickLogoutAnim = useState(new Animated.Value(0))[0];
  const clickDeleteMeAnim = useState(new Animated.Value(0))[0];
  const { t } = useTranslation();

  useEffect(() => {
    if (theme) {
      setStyles(ProfileScreenStyles(theme, insets));
    }
  }, [theme]);

  const clickLogoutButton = () => {
    Animated.timing(clickLogoutAnim, {
      toValue: 1,
      duration: 200, 
      useNativeDriver: true,
    }).start();
  }
  const leaveLogoutButton = () => {
    Animated.timing(clickLogoutAnim, {
      toValue: 0,
      duration: 200, 
      useNativeDriver: true,
    }).start();
  }

  const clickDeleteMeButton = () => {
    Animated.timing(clickDeleteMeAnim, {
      toValue: 1,
      duration: 200, 
      useNativeDriver: true,
    }).start();
  }
  const leaveDeleteMeButton = () => {
    Animated.timing(clickDeleteMeAnim, {
      toValue: 0,
      duration: 200, 
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      if (userToken) getUserAuths(userToken);
      setToken(userToken);
    };

    fetchToken();
  }, []);

  const getUserAuths = async (token: string) => {
    if (token.length !== 0 && user.auth === null) {
      try {
        const response = await api.get(
          user.role === "Passenger" ? "/passengerAuth/getMyAuth" : "/ridderAuth/getMyAuth", 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            }, 
          }
        );

        dispatch(setUserAuths(response.data));
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleLogoutButtonOnClick = async () => {
    dispatch(showAbsoluteLoading());
    setIsLoading(true);
    setCheckLogoutMessageDisplay(false);
    try {
      if (token && token.length !== 0) {
        await api.patch(user.role === "Passenger"
          ? "/passenger/resetAccessTokenToLogout"
          : "/ridder/resetAccessTokenToLogout", 
          null, 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            }, 
          }
        );
      }

      dispatch(clearUser());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
      navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "welcome" }],
        })
      );
      dispatch(hideAbsoluteLoading());
    }
  }

  const handleDeleteMeButtonOnClick = async (inputValues: string[]) => {
    const showAlertMessage = () => {
      Alert.alert(
        "密碼錯誤",
        "你必須輸入正確密碼才能繼續",
        [
          {
            text: "確認",
            onPress: () => {},
            style: "cancel", 
          },
        ],
        { cancelable: true }
      );
    }

    dispatch(showAbsoluteLoading());
    setIsLoading(true);
    setCheckDeleteMeMessageDisplay(false);
    const password = inputValues.filter(value => value)[0];
    try {
      if (token && token.length !== 0) {
        await api.delete(user.role === "Passenger"
          ? "/passenger/deleteMe"
          : "/ridder/deleteMe", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }, 
            data: {
              password: password, 
            }, 
          }
        );
      }

      dispatch(clearUser());
    } catch (error) {
      console.log(error);
      showAlertMessage();
    } finally {
      setIsLoading(false);
      navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "welcome" }],
        })
      );
      dispatch(hideAbsoluteLoading());
    }
  }

  const listData = [
    { id: "1", label: t("myorder"), callback: () => navigation.navigate("mycreateorder" as never) }, 
    { id: "2", label: t("Recurring Orders") }, 
    { id: "3", label: `${t("preference")} ${user.role === "Passenger" ? t("rider") : t("passenger")}`, callback: () => navigation.navigate("mypreferences" as never) }, 
    { id: "4", label: t("collection") }, 
    { id: "5", label: t("notification"), badge: 24 },
    { id: "6", label: t("Update Profile"), callback: () => navigation.navigate("editprofile" as never) },
    { id: "7", label: t("Binding portal"), 
      ...(user.auth && {extra: `${Object.values(user.auth).filter(value => value === true).length} / ${numberOfAuths} ${t("bounded")}`}), 
      ...(user.auth && {badge: `${Math.max(0, numberOfAuths - Object.values(user.auth).filter(value => value === true).length)}`}), 
      callback: () => navigation.navigate("bindings"  as never), 
    }, 
    { id: "8", label: t("Account Balance"),  }, 
    { id: "9", label: t("System Settings"), callback: () => navigation.navigate("settings" as never) },
    { id: "10", label: t("Reset email and password"), callback: () => navigation.navigate("resetemailpassword" as never) }, 
    { id: "11", label: t("feedback"), callback: () => navigation.navigate("report" as never) }, 
  ];

  return (
    ((isLoading && !isAbsoluteLoading) || !styles || !theme
      ? <LoadingWrapper />
      : (<View
          style={{
            flex: 1,
            paddingTop: verticalScale(insets.top),
            paddingBottom: verticalScale(insets.bottom),
            paddingHorizontal: scale(20), // 設置水平間距
          }}
        >
          <View style={styles.container}>
            {/* 頭像部分 */}
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: user.info?.avatorUrl || "https://via.placeholder.com/100" }} // 替換為你的頭像 URL
                style={styles.avatar}
              />
              <Text style={styles.name}>{user.userName}</Text>
              {user.info?.createdAt && 
                <Text style={styles.description}>
                  {`${t("join MotoShare")} ${Math.ceil(((new Date()).getTime() - (new Date(user.info?.createdAt)).getTime()) / 86400000)} ${t("day")}`}
                </Text>
              }
            </View>

        {/* 積分和回收部分 */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>{t("Account Balance")}</Text>
            <Text style={styles.infoValue}>680.00</Text>
            <Text style={styles.infoHint}>{t("Account balance for direct trading")}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>{t("average rating")}</Text>
            <Text style={styles.infoValue}>{`${Math.round(user.info?.avgStarRating ?? 0 * 10) / 10} ⭐`}</Text>
            <Text style={styles.infoHint}>{t("Statistics from all historical orders")}</Text>
          </View>
        </View>

            {/* 功能列表 */}
            <FlashList 
              data={listData} 
              renderItem={({ item }: any) => (
                <SettingButton 
                  title={item.label} 
                  extraContent={item.extra}
                  badgeCount={item.badge}
                  theme={theme}
                  callback={item.callback}
                />)} 
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false} // 關閉水平滾動條（如需水平滾動）
              keyExtractor={(item) => item.id} 
              estimatedItemSize={282} 
            />

            <View style={styles.bottomButtonContainer}>
              <Pressable
                onPressIn={clickLogoutButton}
                onPressOut={leaveLogoutButton}
                onPress={() => setCheckLogoutMessageDisplay(true)}
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                ]}
              >
                <Animated.View
                  style={{
                    ...styles.logoutButton,
                    backgroundColor: clickLogoutAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.3)"],
                    }),
                  }}
                >
                  <Text style={styles.logoutText}>{t("logout")}</Text>
                </Animated.View>
              </Pressable>

              {checkLogoutMessageDisplay && 
                <AnimatedCheckMessage 
                  title={t("Confirm to log out account")} 
                  content={t("confirm logout info")} 
                  theme={theme} 
                  leftOptionTitle={t("confirm")}
                  leftOptionCallBack={handleLogoutButtonOnClick}
                  rightOptionTitle={t("cancel")}
                  rightOptionCallBack={() => setCheckLogoutMessageDisplay(false)}
                />
              }

              <Pressable
                onPressIn={clickDeleteMeButton}
                onPressOut={leaveDeleteMeButton}
                onPress={() => setCheckDeleteMeMessageDisplay(true)}
                style={({ pressed }) => [
                  styles.deleteAccountButton,
                  pressed && { backgroundColor: "rgba(225, 0, 0, 1)" },
                ]}
              >
                <Animated.View
                  style={{
                    ...styles.deleteAccountButton,
                    backgroundColor: clickDeleteMeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["rgba(225, 0, 0, 1)", "rgba(225, 0, 0, 0.7)"],
                    }),
                  }}
                >
                  <Animated.Text 
                    style={{
                      ...styles.deleteMeText, 
                      color: clickDeleteMeAnim.interpolate({
                        inputRange: [0, 1], 
                        outputRange: [theme.colors.background, theme.colors.text], 
                      })
                    }}>
                      {t("delete account")}
                    </Animated.Text>
                </Animated.View>
              </Pressable>

              {checkDeleteMeMessageDisplay &&
                <AnimatedInputMessage 
                  title={t("confirm delete account")} 
                  content={t("confirm delete info")} 
                  theme={theme} 
                  inputAttributes={[
                    { placeholder: t("password"), isSecureText: true }, 
                  ]}
                  leftOptionTitle={t("confirm")}
                  leftOptionCallBack={handleDeleteMeButtonOnClick}
                  rightOptionTitle={t("cancel")}
                  rightOptionCallBack={() => setCheckDeleteMeMessageDisplay(false)}
                />
              }
            </View>
          </View>
        </View>)
      )
  );
};

export default Profile;
