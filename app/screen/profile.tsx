import { Text, Image, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../(store)/";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { clearUser } from "../(store)/userSlice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { styles } from "./profile.style"

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
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
      <View>
        <Pressable onPress={() => {
          dispatch(clearUser());
          navigation.dispatch(
            CommonActions.reset({
              index: 0, 
              routes: [{ name: "welcome" }], 
            })
          );
        }}>
          <Text>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Profile;
