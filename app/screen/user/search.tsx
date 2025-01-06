import React, { useState, useEffect } from "react";
import { Text, View, TouchableWithoutFeedback, Pressable, TextInput, Platform, Keyboard, Alert, Image, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import debounce from "lodash/debounce";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { Styles } from "./search.style";
import { useTranslation } from "react-i18next";

interface UserType {
  id: string;
  userName: string;
}

interface UserInfoType {
  userName: string;
  info: UserMoreInfo;
}

interface UserMoreInfo {
  age: number | null;
  avatorUrl: string | null;
  isOnline: boolean;
  motocyclePhotoUrl: string | null;
  motocycleType: string | null;
  selfIntroduction: string | null;
}

const SearchUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const [token, setToken] = useState<string | null>(null);
  const [styles, setStyles] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
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

  const SearchUser = async () => {
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
          limit: 1,
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

      //console.log(response.data);
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

  const createMyPreference = async (userName: string) => {
    if (!token) {
      Alert.alert(t("Token failed"), t("unable to get token"));
      return;
    }

    setIsButtonLoading(true);

    let url: string = "";

    if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridderPreferences/createMyPreferenceByUserName`;
    } else if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passengerPreferences/createMyPreferenceByUserName`;
    }

    try {
      const response = await axios.post(url, null, {
        params: {
          preferenceUserName: userName,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      Alert.alert(t("Add To Preference"), t("Add To Preference Success"));
      setIsButtonLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [{ onPress: () => setIsButtonLoading(false) }]);
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤", [{ onPress: () => setIsButtonLoading(false) }]);
      }
    }
  };

  const handleSearchInputChange = debounce(() => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (regex.test(searchInput)) {
      SearchUser();
      setIsLoading(true);
    }
  }, 500);

  if (styles === null) {
    return <LoadingWrapper />;
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1, paddingHorizontal: scale(20), paddingVertical: verticalScale(15) }}>
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

        {isLoading ? (
          <LoadingWrapper />
        ) : (
          userInfo && (
            <View style={styles.container}>
              <Pressable onPress={() => navigation.navigate(...(["orderdetail", { item: "123" }] as never))}>
                <View style={styles.card}>
                  <View style={styles.photoContainer}>
                    <Image
                      source={{ uri: userInfo.info.avatorUrl ?? "https://via.placeholder.com/100" }} // 替換為你的頭像 URL
                      style={styles.avatar}
                    />
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
                      {t("Online Status")}：{userInfo.info.isOnline ? t("Online") : t("Offline")}
                    </Text>
                    <Text style={styles.title}>
                      {t("Introduction")}：{userInfo.info.selfIntroduction}
                    </Text>
                    <Pressable
                      style={styles.button}
                      disabled={isButtonLoading}
                      onPress={() => {
                        createMyPreference(userInfo.userName);
                      }}
                    >
                      <Text style={styles.buttonText}>{isButtonLoading ? <ActivityIndicator size="large" /> : t("Add To Preference")}</Text>
                    </Pressable>
                  </View>
                </View>

                {userInfo.info.motocyclePhotoUrl && (
                  <View style={styles.card}>
                    <View style={styles.photoContainer}>
                      <Image source={{ uri: userInfo.info.motocyclePhotoUrl }} style={styles.motoPhoto} />
                    </View>
                  </View>
                )}
              </Pressable>
            </View>
          )
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchUser;
