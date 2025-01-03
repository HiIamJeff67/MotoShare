import { Text, Image, View, Pressable, Animated, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../(store)/";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { scale, verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { clearUser, setUserInfos } from "../(store)/userSlice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { ProfileScreenStyles } from "./profile.style";
import { useEffect, useState } from "react";
import LoadingWrapper from "../component/LoadingWrapper/LoadingWrapper";
import SettingButton from "../component/SettingButton/SettingButton";
import AnimatedCheckMessage from "../component/CheckMessage/AnimatedCheckMessage";
import AnimatedInputMessage from "../component/InputMessage/AnimatedInputMessage";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, 
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
  });
  const insets = useSafeAreaInsets();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);  // default loading
  const [token, setToken] = useState<string | null>(null);
  const [styles, setStyles] = useState<any>(null);
  const clickLogoutAnim = useState(new Animated.Value(0))[0];
  const clickDeleteMeAnim = useState(new Animated.Value(0))[0];
  const [lockButton, setLockButton] = useState(false);
  const [checkLogoutMessageDisplay, setCheckLogoutMessageDisplay] = useState<boolean>(false);
  const [checkDeleteMeMessageDisplay, setCheckDeleteMeMessageDisplay] = useState<boolean>(false);

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
      setToken(userToken);
    }

    fetchToken();
  }, []);

  useEffect(() => {
    if (user.info === null && token) {
      fetchUserInfo(token);
    }
    setIsLoading(false);
  }, [token]);

  const fetchUserInfo = async (token: string) => {
    if (token && token.length !== 0) {
      try {
        const response = await api.get(user.role === "Passenger"
          ? "/passenger/getMyInfo"
          : "/ridder/getMyInfo", {
            headers: {
              Authorization: `Bearer ${token}`, 
            }, 
        });

        if (response && response.data) {
          const info = response.data.info;
          dispatch(setUserInfos({
            isOnline: info.isOnline, 
            age: info.age, 
            phoneNumber: info.phoneNumber, 
            emergencyPhoneNumber: info.emergencyPhoneNumber, 
            emergencyUserRole: info.emergencyUserRole, 
            selfIntroduction: info.selfIntroduction, 
            avatorUrl: info.avatorUrl, 
            createdAt: info.createdAt, 
            updatedAt: info.updatedAt, 
          }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleLogoutButtonOnClick = async () => {
    setIsLoading(true);
    setLockButton(false);
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
      console.log(error);
    } finally {
      setIsLoading(false);
      setLockButton(true);
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

    setIsLoading(true);
    setLockButton(false);
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
      setLockButton(true);
    } catch (error) {
      console.log(error);
      showAlertMessage();
    } finally {
      setIsLoading(false);
    }
  }

  const listData = [
    { id: "1", icon: "shopping-cart", label: "我的訂單" },
    { id: "2", icon: "notifications", label: "消息通知", badge: 24 },
    { id: "3", icon: "person", label: "更新個人資料", page: "editprofile" },
    { id: "4", icon: "bindings", label: "綁定門戶", extra: "未綁定" },
    { id: "5", icon: "settings", label: "系統設置", page: "settings"},
    { id: "6", icon: "report", label: "回報" },
  ];

  return (
    isLoading || !styles || !theme
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
              <Text style={styles.description}>加入Motoshare的第240天</Text>
            </View>

            {/* 積分和回收部分 */}
            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>帳戶餘額</Text>
                <Text style={styles.infoValue}>680.00</Text>
                <Text style={styles.infoHint}>帳戶餘額用於直接交易</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>回收總量</Text>
                <Text style={styles.infoValue}>24.0 公斤</Text>
                <Text style={styles.infoHint}>感謝您為環保貢獻的力量</Text>
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
                  callback={() => navigation.navigate(item.page as never)}
                />)} 
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
                  content={"你確定要刪除帳號？請提供您目前的密碼已繼續刪除帳號，刪除後將無法再透過本帳號登入"} 
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
  );
};

export default Profile;
