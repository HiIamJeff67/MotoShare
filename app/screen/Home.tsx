import { View, Text, TouchableOpacity, Pressable, InteractionManager } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../(store)";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";
import React, { useEffect, useState } from "react";
import { HomeScreenStyles, mapStyle } from "./Home.style";
import RecordButton from "../component/RecordButton/RecordButton";
import { SearchRecordInterface } from "@/interfaces/userRecords.interface";
import { useTranslation } from "react-i18next";
import LoadingWrapper from "../component/LoadingWrapper/LoadingWrapper";
import MapView from "react-native-maps";
import { addNotification, connectToSocket, disconnectToSocket } from "../(store)/webSocketSlice";
import { io } from "socket.io-client";

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const userRole = user.role;
  const theme = user.theme;
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  let roleText = "載入中...";

  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userRecords, setUserRecords] = useState<SearchRecordInterface[]>([]);
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(HomeScreenStyles(theme, insets));
    }
  }, [theme]);

  if (user.role == "Passenger") {
    roleText = t("passenger");
  } else if (user.role == "Ridder") {
    roleText = t("rider");
  }

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      if (userToken && user.role) {
        console.log(userToken)
        const socket = io(`${process.env.EXPO_PUBLIC_API_URL}/notifications`, {
          extraHeaders: {
            authorization: `Bearer ${userToken}`,
            userrole: user.role,
          },
          transports: ['websocket'],
        });

        // Update connection status in Redux
        socket.on('connect', () => {
          console.log('connected to webSocket...')
          dispatch(connectToSocket());
        });

        socket.on('disconnect', (reason) => {
          console.log('disconnected from webSocket...', reason); // Log the reason for disconnection
          dispatch(disconnectToSocket());
        });
  
        socket.on('notification', (data) => {
          console.log('Received notification:', data);
          dispatch(addNotification(data));
        });
  
        // Optional: Add error handling
        socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
        });
      }
      setToken(userToken);
    };

    fetchToken();
    InteractionManager.runAfterInteractions(() => {
      // 當所有互動完成後更新狀態
      setIsLoading(false);
    });
  }, [userRole]);

  useEffect(() => {
    getUserRecords();
  }, [token]);

  const getUserRecords = async () => {
    if (token && token.length !== 0) {
      try {
        const response = await api.get(
          user.role === "Passenger" ? "/passengerRecord/getSearchRecordsByUserId" : "/ridderRecord/getSearchRecordsByUserId",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserRecords(response.data["searchRecords"]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading || !styles || !theme
      ? <LoadingWrapper />
      : (<View style={styles.container}>
          <Text style={styles.welcomeText}>
            {t("welcome",{roleText})}, {user.userName}
          </Text>

          <Pressable style={styles.mapContainer} onPress={() => navigation.navigate("map" as never)}>
            <MapView
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={styles.map}
              customMapStyle={user.themeName === "DarkTheme" ? mapStyle : undefined}
            />
          </Pressable>

          <View style={styles.recordContainer}>
            {userRecords &&
              userRecords.length > 0 &&
              userRecords.slice(0, 2).map((record, index) => <RecordButton key={index} searchRecords={record} />)}
          </View>

          <View>
            <Text style={styles.MainText}>{t("recommended")}</Text>
            <View style={{ marginTop: verticalScale(20) }} className="flex flex-row justify-between items-center">
              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("map" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={theme.colors.primary} name="motorcycle" size={moderateScale(24)} />
                  <Text style={styles.cardText}>{t("make an order")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("order" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={theme.colors.primary} name="list" size={moderateScale(24)} />
                  <Text style={styles.cardText}>{t("check order")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myinvite" as never)}>
                <View className="items-center">
                  <Ionicons color={theme.colors.primary} name="people" size={moderateScale(24)} />
                  <Text style={styles.cardText}>{t("invite details")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myorder" as never)}>
                <View className="items-center">
                  <FontAwesome6 color={theme.colors.primary} name="edit" size={moderateScale(24)} />
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