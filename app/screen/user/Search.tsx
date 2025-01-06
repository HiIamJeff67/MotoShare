import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  Platform,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import debounce from "lodash/debounce";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { Styles } from "./Search.style";
import { useTranslation } from "react-i18next";

interface UserType {
  userName: string;
}

interface UserInfoType {
  userName: string;
  info: {
    avatorUrl: string | null;
    age: number;
    motocycleType: string;
    isOnline: boolean;
    selfIntroduction: string;
    motocyclePhotoUrl: string | null;
  };
}

const SearchUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;

  const [token, setToken] = useState<string | null>(null);
  const [styles, setStyles] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [likedUsers, setLikedUsers] = useState<string[]>([]); // 存储被喜欢的用户

  const navigation = useNavigation();
  const { t } = useTranslation();
  let roleText = "載入中...";

  useEffect(() => {
    if (theme) {
      setStyles(Styles(theme));
    }
  }, [theme]);

  if (user.role == "Ridder") {
    roleText = t("passenger");
  } else if (user.role == "Passenger") {
    roleText = t("rider");
  }

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    };

    fetchToken();
  }, []);

  const dismissKeyboard = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  const toggleLike = (userName: string) => {
    setLikedUsers((prev) => {
      if (prev.includes(userName)) {
        return prev.filter((name) => name !== userName);
      } else {
        return [...prev, userName];
      }
    });
  };

  const SearchOrder = async () => {
    let response: { data: UserType[] },
      url: string = "";

    if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passenger/searchPaginationPassengers`;
    } else if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridder/searchPaginationRidders`;
    }

    try {
      response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userName: searchInput,
          limit: 10,
          offset: 0,
        },
      });

      SearchUserInfo(response.data[0].userName);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  const SearchUserInfo = async (userName: string) => {
    if (!token) {
      Alert.alert(t("Token failed"), t("unable to get token"));
      return;
    }

    let url: string = "";

    if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passenger/getPassengerWithInfoByUserName`;
    } else if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridder/getRidderWithInfoByUserName`;
    }

    try {
      const response = await axios.get(url, {
        params: {
          userName: userName,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setUserInfo(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = debounce(() => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (regex.test(searchInput)) {
      SearchOrder();
      setIsLoading(true);
    }
  }, 500);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: scale(20),
          paddingVertical: verticalScale(15),
        }}
      >
        {styles === null ? (
          <LoadingWrapper />
        ) : (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Feather name="search" size={moderateScale(24)} color="black" />
                <TextInput
                  placeholder={t("userName")}
                  style={styles.searchInput}
                  placeholderTextColor="gray"
                  value={searchInput}
                  onChangeText={(text) => setSearchInput(text)}
                  onSubmitEditing={handleSearchInputChange}
                />
              </View>
            </View>

            {isLoading || !userInfo ? (
              <LoadingWrapper />
            ) : (
              <View style={styles.container}>
                <Pressable
                  onPress={() =>
                    navigation.navigate(
                      ...(["orderdetail", { item: "123" }] as never)
                    )
                  }
                >
                  <View style={styles.card}>
                    <View style={styles.photoContainer}>
                      <Image
                        source={{
                          uri:
                            userInfo.info.avatorUrl ??
                            "https://via.placeholder.com/100",
                        }}
                        style={styles.avatar}
                      />
                      {/* 愛心圖標 */}
                      <Pressable
                        style={styles.heartIconContainer}
                        onPress={() => toggleLike(userInfo.userName)}
                      >
                        <MaterialIcons
                          name={
                            likedUsers.includes(userInfo.userName)
                              ? "favorite"
                              : "favorite-border"
                          }
                          size={moderateScale(24)}
                          color={
                            likedUsers.includes(userInfo.userName)
                              ? "red"
                              : "gray"
                          }
                        />
                      </Pressable>
                    </View>
                    <View style={styles.body}>
                      <Text style={styles.title}>
                        {roleText}：{userInfo.userName}
                      </Text>
                      <Text style={styles.title}>
                        {t("Age")}：{userInfo.info.age}
                      </Text>
                      <Text style={styles.title}>
                        {t("Motorcycle Type")}：{userInfo.info.motocycleType}
                      </Text>
                      <Text style={styles.title}>
                        {t("Online Status")}：
                        {userInfo.info.isOnline ? t("Online") : t("Offline")}
                      </Text>
                      <Text style={styles.title}>
                        {t("Introduction")}：{userInfo.info.selfIntroduction}
                      </Text>
                    </View>
                  </View>

                  {userInfo.info.motocyclePhotoUrl && (
                    <View style={styles.card}>
                      <View style={styles.photoContainer}>
                        <Image
                          source={{ uri: userInfo.info.motocyclePhotoUrl }}
                          style={styles.motoPhoto}
                        />
                      </View>
                    </View>
                  )}
                </Pressable>
              </View>
            )}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchUser;
