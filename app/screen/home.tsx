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
import { getUserTheme, ThemeType } from "@/theme";
import { useTranslation } from "react-i18next";

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, 
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
  });
  let roleText = "載入中...";

  const [themeName, setThemeName] = useState<ThemeType>(user.theme ?? "DarkTheme");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userRecords, setUserRecords] = useState<SearchRecordInterface[]>([]);
  const { t } = useTranslation();
  const styles = HomeScreenStyles(getUserTheme(themeName), insets);

  if (user.role == 1) {
    roleText = "乘客";
  } else if (user.role == 2) {
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
    if (token) {
      try {
        const response = await api.get(user.role === 1
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.welcomeText}>
            {t("welcome",{roleText})}, {user.username}
          </Text>

          <TouchableWithoutFeedback onPress={() => navigation.navigate("map" as never)}>
            <View style={styles.inputWrapper}>
              <View>
                <Image source={require("../../assets/images/search.png")} style={styles.icon} />
              </View>
              <TextInput style={styles.textInput} placeholder={t("where to go")} placeholderTextColor={styles.textInput.color} editable={false}/>
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
            <Text style={styles.MainText}>{t("recommended")}</Text>
            <View style={{ marginTop: verticalScale(20) }} className="flex flex-row justify-between items-center">
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("map" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={styles.cardIcon.color} name="motorcycle" size={moderateScale(24)} />
                  <Text style={styles.cardText}>{t("make an order")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("order" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={styles.cardIcon.color} name="list" size={moderateScale(24)} />
                  <Text style={styles.cardText}>{t("check order")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myinvite" as never)}>
                <View className="items-center">
                  <Ionicons color={styles.cardIcon.color} name="people" size={moderateScale(24)} />
                  <Text style={styles.cardText}>{t("invite details")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myorder" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={styles.cardIcon.color} name="edit" size={moderateScale(24)} />
                  <Text style={styles.cardText}>{t("order manage")}</Text>
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
