import { Text, StyleSheet, Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../(store)/";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user);
  const [token, setToken] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    };

    fetchToken();
  }, []);

  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const getProfileData = async () => {
    if (token) {
      try {
        const response = await api.get("/passenger/getMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Profile Data:", response.data);
      } catch (error) {
        console.error("API 請求出錯:", error);
      }
    } else {
      console.log("Token 未獲取");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: verticalScale(insets.top),
        paddingBottom: verticalScale(insets.bottom),
        paddingHorizontal: scale(20), // 設置水平間距
        paddingVertical: verticalScale(20), // 設置垂直間距
      }}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/motorbike.jpg")}
          style={styles.image}
        />
        <Text style={styles.text}>UserName: {user.username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  text: {
    fontSize: moderateScale(16),
    padding: verticalScale(2),
    fontWeight: "bold",
    color: "#000000",
    marginTop: verticalScale(10),
  },
  image: {
    width: scale(120), // 圖片寬度
    height: verticalScale(120), // 圖片高度
    resizeMode: "contain",
  },
});

export default Profile;
