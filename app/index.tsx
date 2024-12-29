import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import WelcomeScreen from "./screen/auth/welcome";
import PLoginScreen from "./screen/auth/plogin";
import RLoginScreen from "./screen/auth/rlogin";
import ChooseScreen from "./screen/auth/choose";
import Choose2Screen from "./screen/auth/choose2";
import PRegScreen from "./screen/auth/preg";
import RRegScreen from "./screen/auth/rreg";
import HomeScreen from "./screen/home";
import ProfileScreen from "./screen/profile";
import ServiceScreen from "./screen/service";
import MapScreen from "./screen/order/map";
import OrderScreen from "./screen/order/order";
import OrderDetailScreen from "./screen/order/orderdetail";
import MyOrderScreen from "./screen/myorder/myorder";
import MyOrderDeScreen from "./screen/myorder/myorderde";
import MyOrderHisScreen from "./screen/myorder/myorderhis";
import MyOrderHisDeScreen from "./screen/myorder/myorderhisde";
import MyInviteScreen from "./screen/invite/myinvite";
import MyInviteDeScreen from "./screen/invite/myinvitede";
import OtherInviteScreen from "./screen/invite/otherinvite";
import OtherInviteDeScreen from "./screen/invite/otherinvitede";
import InviteMap from "./screen/invite/invitemap";
import EditProfile from "./screen/setting/editprofile";
import store from "./(store)/";
import { Provider } from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import "../global.css";
import { View, Pressable, StatusBar, Platform, useColorScheme, Alert, AppState } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, CommonActions, useNavigation } from "@react-navigation/native";
import { moderateScale, scale } from "react-native-size-matters";
import { MyTheme, MyDarkTheme } from "./screen/theme";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { RootState } from "./(store)/";

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
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="進行中" component={MyOrderScreen} />
      <TopTab.Screen name="已結束" component={MyOrderHisScreen} />
    </TopTab.Navigator>
  );
};

const TopTabNavigator2 = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="我的邀請" component={MyInviteScreen} />
      <TopTab.Screen name="別人邀請" component={OtherInviteScreen} />
    </TopTab.Navigator>
  );
};

const TabNavigator = () => {
  const navigation = useNavigation();
  const [alertShown, setAlertShown] = useState(false);
  const user = useSelector((state: RootState) => state.user);

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

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home Page"
        component={HomeScreen}
        options={{
          title: "主頁",
          headerShown: false,
          tabBarIcon: ({ focused }) => <FontAwesome name="home" size={moderateScale(24)} color={focused ? "#3498db" : "black"} />,
        }}
      />
      <Tab.Screen
        name="service"
        component={ServiceScreen}
        options={{
          title: "服務",
          headerShown: false,
          tabBarIcon: ({ focused }) => <FontAwesome name="shopping-cart" size={moderateScale(24)} color={focused ? "#3498db" : "black"} />,
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "我的",
          headerShown: false,
          tabBarIcon: ({ focused }) => <MaterialCommunityIcons name="account" size={moderateScale(24)} color={focused ? "#3498db" : "black"} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const systemTheme = useColorScheme();

  return (
    <Provider store={store}>
      <NavigationContainer theme={systemTheme === "dark" ? MyDarkTheme : MyTheme}>
        <SafeAreaProvider>
          {/* 根據平台條件設置 StatusBar */}
          {Platform.OS === "ios" ? <StatusBar barStyle="dark-content" /> : <StatusBar barStyle="dark-content" hidden={true} />}
          <Stack.Navigator>
            <Stack.Screen name="welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="home" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="choose" component={ChooseScreen} options={{ headerShown: false }} />
            <Stack.Screen name="choose2" component={Choose2Screen} options={{ headerShown: false }} />
            <Stack.Screen name="plogin" component={PLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="rlogin" component={RLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="preg" component={PRegScreen} options={{ headerShown: false }} />
            <Stack.Screen name="rreg" component={RRegScreen} options={{ headerShown: false }} />
            <Stack.Screen name="editprofile" component={EditProfile} options={{ headerShown: true }} />
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
                title: "我的訂單",
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
                title: "邀請",
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="myorderde"
              component={MyOrderDeScreen}
              options={{
                headerShown: true,
                title: "詳情",
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="myorderhisde"
              component={MyOrderHisDeScreen}
              options={{
                headerShown: true,
                title: "詳情",
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="myinvitede"
              component={MyInviteDeScreen}
              options={{
                headerShown: true,
                title: "詳情",
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="otherinvitede"
              component={OtherInviteDeScreen}
              options={{
                headerShown: true,
                title: "詳情",
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="order"
              component={OrderScreen}
              options={{
                headerShown: true,
                title: "訂單",
                headerTitleAlign: "center",
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="orderdetail"
              component={OrderDetailScreen}
              options={{
                headerShown: true,
                title: "詳情",
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
      </NavigationContainer>
    </Provider>
  );
}
