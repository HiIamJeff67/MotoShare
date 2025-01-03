import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../(store)/";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Theme } from "../../theme/theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import React, { useEffect, useState } from "react";
import { HomeScreenStyles } from "./home.style";
import RecordButton from "../component/RecordButton/RecordButton";
import { SearchRecordInterface } from "@/interfaces/userRecords.interface";
import LoadingWrapper from "../component/LoadingWrapper/LoadingWrapper";
import AnimatedCheckMessage from "../component/CheckMessage/AnimatedCheckMessage";

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const navigation = useNavigation();
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, 
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
  });
  let roleText = "載入中...";
  
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userRecords, setUserRecords] = useState<SearchRecordInterface[]>([]);
  
  const insets = useSafeAreaInsets();
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(HomeScreenStyles(theme, insets));
    }
  }, [theme]);

  if (user.role == "Passenger") {
    roleText = "乘客";
  } else if (user.role == "Ridder") {
    roleText = "車主";
  }

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    }

    fetchToken();
    InteractionManager.runAfterInteractions(() => {
      // 當所有互動完成後更新狀態
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    getUserRecords();
  }, [token]);

  const getUserRecords = async () => {
    if (token && token.length !== 0) {
      try {
        const response = await api.get(user.role === "Passenger"
          ? "/passengerRecord/getSearchRecordsByUserId"
          : "/ridderRecord/getSearchRecordsByUserId", {
          headers: {
            Authorization: `Bearer ${token}`, 
          }, 
        });
        setUserRecords(response.data["searchRecords"]);
      } catch (error) {
        console.log("Token 未獲取");
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {isLoading || !styles || !theme
      ? <LoadingWrapper />
      : (<View style={styles.container}>
          <Text style={styles.welcomeText}>
            歡迎{roleText}, {user.userName}
          </Text>

          <TouchableWithoutFeedback onPress={() => navigation.navigate("map" as never)}>
            <View style={styles.inputWrapper}>
              <View>
                <Image source={require("../../assets/images/search.png")} style={styles.icon} />
              </View>
              <TextInput style={styles.textInput} placeholder="要去哪裡？" placeholderTextColor={styles.textInput.color} editable={false}/>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.recordContainer}>
            {userRecords && userRecords.length > 0 && 
              userRecords.slice(0, 2).map((record, index) => (
                <RecordButton key={index} searchRecords={record}/>
              ))
            }
          </View>

          <View>
            <Text style={styles.MainText}>建議</Text>
            <View style={{ marginTop: verticalScale(20) }} className="flex flex-row justify-between items-center">
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("map" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={styles.cardIcon.color} name="motorcycle" size={moderateScale(24)} />
                  <Text style={styles.cardText}>建立訂單</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("order" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={styles.cardIcon.color} name="list" size={moderateScale(24)} />
                  <Text style={styles.cardText}>查看訂單</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myinvite" as never)}>
                <View className="items-center">
                  <Ionicons color={styles.cardIcon.color} name="people" size={moderateScale(24)} />
                  <Text style={styles.cardText}>查看邀請</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myorder" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={styles.cardIcon.color} name="edit" size={moderateScale(24)} />
                  <Text style={styles.cardText}>訂單管理</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Home;
