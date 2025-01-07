import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import WelcomeScreen from "./screen/auth/Welcome";
import LoginScreen from "./screen/auth/Login";
import ChooseScreen from "./screen/auth/Choose";
import Choose2Screen from "./screen/auth/Choose2";
import RegScreen from "./screen/auth/Register";
import HomeScreen from "./screen/Home";
import ProfileScreen from "./screen/Profile";
import ServiceScreen from "./screen/Service";
import MapScreen from "./screen/order/Map";
import OrderScreen from "./screen/order/Order";
import OrderDetailScreen from "./screen/order/OrderDetail";
import MyOrderScreen from "./screen/myorder/MyOrder";
import MyOrderDeScreen from "./screen/myorder/MyOrderDe";
import MyOrderHisScreen from "./screen/myorder/MyOrderHis";
import MyOrderHisDeScreen from "./screen/myorder/MyOrderHisDe";
import MyInviteScreen from "./screen/invite/MyInvite";
import MyInviteDeScreen from "./screen/invite/MyInviteDe";
import OtherInviteScreen from "./screen/invite/OtherInvite";
import OtherInviteDeScreen from "./screen/invite/OtherInviteDe";
import InviteMap from "./screen/invite/InviteMap";
import EditProfile from "./screen/setting/EditProfile";
import Settings from "./screen/setting/Settings";
import UserSearch from "./screen/user/Search";
import MyCreateOrder from "./screen/setting/MyCreateOrder";
import MyCreateOrderDe from "./screen/setting/MyCreateOrderDe";
import PaymentScreen from "./screen/stripe/Payment";
import store from "./(store)";
import { Provider, useDispatch } from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import "../global.css";
import { View, Pressable, StatusBar, Platform, useColorScheme, Alert, AppState } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, CommonActions, useNavigation } from "@react-navigation/native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Theme } from "../theme/theme";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { RootState } from "./(store)";
import { setUserThemeSettings } from "./(store)/userSlice";
import { LanguageProvider } from "@/app/locales/languageProvider";
import { useTranslation } from "react-i18next";
import LoadingWrapper from "./component/LoadingWrapper/LoadingWrapper";
import Bindings from "./screen/setting/Bindings";
import AbsoluteLoadingWrapper from "./component/AbsoluteLoadingWrapper/AbsoluteLoadingWrapper";
import ResetEmailPassword from "./screen/setting/ResetEmailPassword";
import Report from "./screen/setting/Report";
import MyPreferences from "./screen/setting/MyPreferences";
import ResetPasswordScreen from "./screen/auth/ForgetPasswordScreen";
import StripeProvider from "@/app/component/Stripe/StripeProvider";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const CustomBackHeader = ({ navigation }: { navigation: any }) => (
  <View
    style={{
      justifyContent: "center",
      alignItems: "center",
      marginLeft: scale(10), // 控制距離左邊的距離
    }}
  >
    <Pressable onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back-circle" size={moderateScale(40)} color="black" />
    </Pressable>
  </View>
);

const TopTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <TopTab.Navigator>
      <TopTab.Screen name={t("inprogress")} component={MyOrderScreen} />
      <TopTab.Screen name={t("end")} component={MyOrderHisScreen} />
    </TopTab.Navigator>
  );
};

const TopTabNavigator2 = () => {
  const { t } = useTranslation();
  return (
    <TopTab.Navigator>
      <TopTab.Screen name={t("myinvite")} component={MyInviteScreen} />
      <TopTab.Screen name={t("Invited by others")} component={OtherInviteScreen} />
    </TopTab.Navigator>
  );
};

const TabNavigator = () => {
  const navigation = useNavigation();
  const [alertShown, setAlertShown] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();
  const theme = user.theme;
  const [colors, setColors] = useState(theme?.colors);

  useEffect(() => {
    if (theme) {
      setColors(theme.colors);
    }
  }, [theme]);

  // 異步函數：獲取 token
  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      return token ? token : null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  // 檢查 token 是否過期
  const checkTokenExpired = (token: string) => {
    try {
      const decoded: { exp: number } = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return {
        isExpired: decoded.exp < currentTime,
        expiresIn: decoded.exp - currentTime,
      };
    } catch (error) {
      console.error("Invalid token:", error);
      return { isExpired: true, expiresIn: 0 };
    }
  };

  // 使用 useEffect 檢查 token 的邏輯
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchToken = async () => {
      const token = await getToken();

      if (!token && !alertShown) {
        // 無 Token 情況
        setAlertShown(true);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "welcome" }],
          })
        );
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。", [
          {
            text: "OK",
            onPress: () => {
              setAlertShown(false);
            },
          },
        ]);
        return;
      }

      if (token) {
        const { isExpired, expiresIn } = checkTokenExpired(token);
        if (isExpired && !alertShown) {
          // Token 過期情況
          setAlertShown(true);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "welcome" }],
            })
          );
          Alert.alert("Token 過期", "Token 已過期，請重新登入。", [
            {
              text: "OK",
              onPress: () => {
                setAlertShown(false);
              },
            },
          ]);
        } else if (!isExpired) {
          console.log(`Token expires in ${expiresIn} seconds`);
          timer = setTimeout(() => {
            fetchToken();
          }, expiresIn * 1000 + 1000);
        }
      }
    };

    // 初次加載立即運行
    fetchToken();

    // 監聽應用程序狀態改變
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        // 當應用程序從後台回到前台時檢查 token
        fetchToken();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // 清理定時器和事件監聽器，避免內存洩漏
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      subscription.remove();
    };
  }, [user.role]);

  return !colors ? (
    <LoadingWrapper />
  ) : (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingTop: verticalScale(Platform.OS === "ios" ? 5 : 0),
          borderColor: colors.border,
          backgroundColor: colors.card,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowOffset: {
            width: scale(0),
            height: verticalScale(-5),
          },
        },
      }}
    >
      <Tab.Screen
        name="Home Page"
        component={HomeScreen}
        options={{
          title: t("home"),
          headerShown: false,
          tabBarIcon: ({ focused }) => <FontAwesome name="home" size={moderateScale(24)} color={focused ? colors.primary : colors.text} />,
        }}
      />
      <Tab.Screen
        name="service"
        component={ServiceScreen}
        options={{
          title: t("service"),
          headerShown: false,
          tabBarIcon: ({ focused }) => <FontAwesome name="shopping-cart" size={moderateScale(24)} color={focused ? colors.primary : colors.text} />,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: t("my"),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="account" size={moderateScale(24)} color={focused ? colors.primary : colors.text} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const systemTheme = useColorScheme();
  const { t } = useTranslation();
  if (user.theme === undefined || user.theme === null) {
    dispatch(setUserThemeSettings({ themeName: systemTheme === "dark" ? "DarkTheme" : "LightTheme" }));
  }
  const theme = (user.theme ?? (systemTheme === "dark" ? "DarkTheme" : "LightTheme")) as Theme; // since we have make sure that it is Theme Type

  return (
    <NavigationContainer theme={theme}>
      <StripeProvider>
        <SafeAreaProvider>
          {/* 根據平台條件設置 StatusBar */}
          {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : <StatusBar barStyle="light-content" hidden={true} />}
          <Stack.Navigator>
            <Stack.Screen name="welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="home" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="choose" component={ChooseScreen} options={{ headerShown: false }} />
            <Stack.Screen name="choose2" component={Choose2Screen} options={{ headerShown: false }} />
            <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="reg" component={RegScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="payment"
              component={PaymentScreen}
              options={{ headerShown: true, headerBackTitle: "我的頁面", headerTitle: t("Recharge Balance") }}
            />
            <Stack.Screen name="forgetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="editprofile"
              component={EditProfile}
              options={{ headerShown: true, headerBackTitle: "我的頁面", headerTitle: t("Update Profile") }}
            />
            <Stack.Screen
              name="mypreferences"
              component={MyPreferences}
              options={{ headerShown: true, headerBackTitle: "我的頁面", headerTitle: t("preference rider") }}
            />
            <Stack.Screen
              name="bindings"
              component={Bindings}
              options={{ headerShown: true, headerBackTitle: "我的頁面", headerTitle: t("Binding portal") }}
            />
            <Stack.Screen
              name="resetemailpassword"
              component={ResetEmailPassword}
              options={{ headerShown: true, headerBackTitle: "我的頁面", headerTitle: t("Reset email and password") }}
            />
            <Stack.Screen name="report" component={Report} options={{ headerShown: true, headerBackTitle: "我的頁面", headerTitle: t("feedback") }} />
            {/* <Stack.Screen name="notification" component={Notification} options={{ headerShown: true, headerBackTitle: "我的頁面" , headerTitle: t("notification")}}/> */}
            <Stack.Screen
              name="settings"
              component={Settings}
              options={{ headerShown: true, headerBackTitle: "我的頁面", headerTitle: t("System Settings") }}
            />
            <Stack.Screen
              name="usersearch"
              component={UserSearch}
              options={{ headerShown: true, headerBackTitle: t("home"), headerTitle: t("user search") }}
            />
            <Stack.Screen
              name="mycreateorder"
              component={MyCreateOrder}
              options={{ headerShown: true, headerBackTitle: t("home"), headerTitle: t("myorder") }}
            />
            <Stack.Screen
              name="mycreateorderde"
              component={MyCreateOrderDe}
              options={{ headerShown: true, headerBackTitle: t("home"), headerTitle: t("my order detail") }}
            />
            <Stack.Screen
              name="invitemap"
              component={InviteMap}
              options={({ navigation }) => ({
                headerShown: true,
                headerStyle: {
                  backgroundColor: "transparent", // 設定 header 背景透明
                },
                headerTransparent: true, // 確保背景完全透明
                headerTitle: "", // 移除標題文字
                headerLeft: () => <CustomBackHeader navigation={navigation} />, // 傳遞 navigation
              })}
            />
            <Stack.Screen
              name="myorder"
              component={TopTabNavigator}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                title: t("myorder"),
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="myinvite"
              component={TopTabNavigator2}
              options={{
                headerShown: true,
                headerShadowVisible: false,
                title: t("invite"),
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="myorderde"
              component={MyOrderDeScreen}
              options={{
                headerShown: true,
                title: t("detail"),
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="myorderhisde"
              component={MyOrderHisDeScreen}
              options={{
                headerShown: true,
                title: t("detail"),
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="myinvitede"
              component={MyInviteDeScreen}
              options={{
                headerShown: true,
                title: t("detail"),
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="otherinvitede"
              component={OtherInviteDeScreen}
              options={{
                headerShown: true,
                title: t("detail"),
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="order"
              component={OrderScreen}
              options={{
                headerShown: true,
                title: t("order"),
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="orderdetail"
              component={OrderDetailScreen}
              options={{
                headerShown: true,
                title: t("detail"),
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="map"
              component={MapScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerStyle: {
                  backgroundColor: "transparent", // 設定 header 背景透明
                },
                headerTransparent: true,
                headerTitle: "",
                headerLeft: () => <CustomBackHeader navigation={navigation} />,
              })}
            />
          </Stack.Navigator>
        </SafeAreaProvider>
      </StripeProvider>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Provider store={store}>
        <AbsoluteLoadingWrapper />
        <AppContent />
      </Provider>
    </LanguageProvider>
  );
}
