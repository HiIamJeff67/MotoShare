import { Text, Image, View, Pressable, Animated, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../(store)";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { scale, verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { clearUser, setUserAuths, setUserBalance, setUserInfos } from "../(store)/userSlice";
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
      if (userToken) {
        getUserAuths(userToken);
        getUserBank(userToken);
      }
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
        console.log(error);
      }
    }
  }

  const getUserBank = async (token: string) => {
    if (token.length !== 0 && user.auth === null) {
      try {
        const response = await api.get(
          user.role === "Passenger" ? "/passengerBank/getMyBalance" : "/ridderBank/getMyBalance", 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            }, 
          }
        );

        dispatch(setUserBalance({ balance: response.data.balance }));
      } catch (error) {
        console.log(error);
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
    { id: "1", label: "我的訂單", callback: () => navigation.navigate("mycreateorder" as never) }, 
    { id: "2", label: "週期性訂單" }, 
    { id: "3", label: `偏好${user.role === "Passenger" ? "車主" : "乘客"}`, callback: () => navigation.navigate("mypreferences" as never) }, 
    { id: "4", label: "收藏" }, 
    { id: "5", label: "消息通知", badge: 24 },
    { id: "6", label: "更新個人資料", callback: () => navigation.navigate("editprofile" as never) },
    { id: "7", label: "綁定與驗證", 
      ...(user.auth && {extra: `${Object.values(user.auth).filter(value => value === true).length} / ${numberOfAuths} 已綁定`}), 
      ...(user.auth && {badge: `${Math.max(0, numberOfAuths - Object.values(user.auth).filter(value => value === true).length)}`}), 
      callback: () => navigation.navigate("bindings"  as never), 
    }, 
    { id: "8", label: "儲值帳戶餘額",  }, 
    { id: "9", label: "系統設置", callback: () => navigation.navigate("settings" as never) },
    { id: "10", label: "重設信箱與密碼", callback: () => navigation.navigate("resetemailpassword" as never) }, 
    { id: "11", label: "回報", callback: () => navigation.navigate("report" as never) }, 
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
                  {`加入Motoshare的第 ${Math.ceil(((new Date()).getTime() - (new Date(user.info?.createdAt)).getTime()) / 86400000)} 天`}
                </Text>
              }
            </View>

        {/* 積分和回收部分 */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>帳戶餘額</Text>
            <Text style={styles.infoValue}>{Number(user.balance) / 100} USD</Text>
            <Text style={styles.infoHint}>帳戶餘額用於直接交易</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>平均評價</Text>
            <Text style={styles.infoValue}>{`${Math.round(user.info?.avgStarRating ?? 0 * 10) / 10} ⭐`}</Text>
            <Text style={styles.infoHint}>由所有歷史訂單統計</Text>
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
                  <Text style={styles.logoutText}>登出</Text>
                </Animated.View>
              </Pressable>

              {checkLogoutMessageDisplay && 
                <AnimatedCheckMessage 
                  title={"確認登出帳號"} 
                  content={"你確定要登出帳號？登出後需要再登入才能繼續使用本軟體"} 
                  theme={theme} 
                  leftOptionTitle={"確認"}
                  leftOptionCallBack={handleLogoutButtonOnClick}
                  rightOptionTitle={"取消"}
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
                      刪除帳號
                    </Animated.Text>
                </Animated.View>
              </Pressable>

              {checkDeleteMeMessageDisplay &&
                <AnimatedInputMessage 
                  title={"確認刪除帳號"} 
                  content={"你確定要刪除帳號？請提供您目前的密碼已繼續刪除帳號，刪除後將無法再透過本帳號登入（注：若為Google登入，且未提供過密碼，請直接按確認）"} 
                  theme={theme} 
                  inputAttributes={[
                    { placeholder: "密碼", isSecureText: true }, 
                  ]}
                  leftOptionTitle={"確認"}
                  leftOptionCallBack={handleDeleteMeButtonOnClick}
                  rightOptionTitle={"取消"}
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
