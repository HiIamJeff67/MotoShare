import { Text, Image, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../(store)/";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import AntDesign from "@expo/vector-icons/AntDesign";
import { clearUser, setUserInfos } from "../(store)/userSlice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { ProfileScreenStyles } from "./profile.style";
import { useEffect, useState } from "react";
import { getUserTheme, ThemeType } from "@/theme";
import LoadingWrapper from "../component/LoadingWrapper/LoadingWrapper";

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

  const [isLoading, setIsLoading] = useState<boolean>(true); // default loading
  const [token, setToken] = useState<string | null>(null);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(ProfileScreenStyles(theme, insets));
    }
  }, [theme]);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    };

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
        const response = await api.get(user.role === "Passenger" ? "/passenger/getMyInfo" : "/ridder/getMyInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          const info = response.data.info;
          dispatch(
            setUserInfos({
              isOnline: info.isOnline,
              age: info.age,
              phoneNumber: info.phoneNumber,
              emergencyPhoneNumber: info.emergencyPhoneNumber,
              emergencyUserRole: info.emergencyUserRole,
              selfIntroduction: info.selfIntroduction,
              avatorUrl: info.avatorUrl,
              createdAt: info.createdAt,
              updatedAt: info.updatedAt,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const listData = [
    { id: "1", icon: "shopping-cart", label: "我的訂單" },
    { id: "2", icon: "notifications", label: "消息通知", badge: 24 },
    { id: "3", icon: "person", label: "更新個人資料", page: "editprofile" },
    { id: "4", icon: "bindings", label: "綁定門戶", extra: "未綁定" },
    { id: "5", icon: "settings", label: "系統設置", page: "settings" },
    { id: "6", icon: "report", label: "回報" },
  ];

  const renderItem = ({ item }: any) => (
    <Pressable style={styles.listItem} onPress={() => navigation.navigate(item.page as never)}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{item.label}</Text>
        {item.extra && <Text style={styles.extra}>{item.extra}</Text>}
      </View>
      {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
      <View style={styles.iconContainer}>
        <AntDesign name="right" size={24} color={styles.label.color} />
      </View>
    </Pressable>
  );

  return isLoading ? (
    <LoadingWrapper />
  ) : (
    <View
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
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false} // 關閉垂直滾動條
          showsHorizontalScrollIndicator={false} // 關閉水平滾動條（如需水平滾動）
          estimatedItemSize={282}
        />
      </View>
    </View>
  );
};

export default Profile;
