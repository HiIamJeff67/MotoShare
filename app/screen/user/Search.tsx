import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, TextInput, Platform, Keyboard, Alert, Text, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import * as SecureStore from "expo-secure-store";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import debounce from "lodash/debounce";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { Styles } from "./Search.style";
import { useTranslation } from "react-i18next";
import UserCard from "@/app/component/UserCard/UserCard";
import { FlashList } from "@shopify/flash-list";
import { UserInfoInterface } from "@/interfaces/userInfo.interface";
import { getLimitString } from "@/app/methods/getLimitString";

interface UserDetailInfoInterface {
  userName: string;
  email: string;
  info: UserMoreDetailInfoInterface;
}

interface UserMoreDetailInfoInterface {
  age: number | null;
  avatorUrl: string | null;
  isOnline: boolean;
  motocyclePhotoUrl: string | null;
  motocycleType: string | null;
  selfIntroduction: string | null;
  avgStarRating: number | null;
  createdAt: string | null;
}

const SearchUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const [styles, setStyles] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserDetailInfoInterface>();
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<UserInfoInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (theme) {
      setStyles(Styles(theme));
    }
  }, [theme]);

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        return token;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    SearchUsers();
  }, []);

  const dismissKeyboard = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  const SearchUsers = async () => {
    const token = await getToken();

    let response: { data: any[] },
      url: string = "";

    if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passenger/searchPaginationPassengers`;
    } else if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridder/searchPaginationRidders`;
    }

    try {
      response = await axios.get(url, {
        params: {
          userName: searchInput,
          limit: 10,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data)
      setSearchResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  const SearchUserInfo = async (userName: string) => {
    const token = await getToken();

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
    const token = await getToken();

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
      SearchUserInfo(searchInput);
      setIsLoading(true);
    }
  }, 500);

  if (styles === null) {
    return <LoadingWrapper />;
  }

  return (
    !styles || !theme
      ? <LoadingWrapper />
      : ( <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{ flex: 1, paddingHorizontal: scale(20), paddingVertical: verticalScale(15) }}>
              {!userInfo && <FlashList 
                data={searchResult}
                keyExtractor={(searchResult) => searchResult.userName}
                renderItem={({ item, index }) => 
                  <TouchableOpacity 
                    key={index}
                    style={styles.searchResultContainer}
                    onPress={() => {
                      setSearchInput(item.userName);
                      SearchUserInfo(item.userName);
                    }}
                  >
                    <Image style={styles.searchResultIcon} source={item.info.avatorUrl ? { uri: `${item.info.avatorUrl}` } : require("../../../assets/images/user.png")}></Image>
                    <Text style={styles.searchResultUserName}>{getLimitString(item.userName, 30)}</Text>
                    <View style={styles.searchResultOnlineContainer}>
                      <View style={ item.info.isOnline ? styles.searchResultIsOnline : styles.searchResultIsOffline }></View>
                    </View>
                  </TouchableOpacity>
                }
                ListHeaderComponent={
                <View style={styles.searchContainer}>
                  <View style={styles.searchBox}>
                    <Feather name="search" size={moderateScale(24)} color="black" />
                    <TextInput
                      placeholder={t("userName")}
                      style={styles.searchInput}
                      placeholderTextColor={theme.colors.background} 
                      value={searchInput}
                      onChangeText={(text) => setSearchInput(text)}
                      onSubmitEditing={handleSearchInputChange}
                    />
                  </View>
                </View>}
                showsVerticalScrollIndicator={false}
              >
              </FlashList>}
      
              {isLoading ? (
                <LoadingWrapper />
              ) : (
                userInfo && 
                  <UserCard 
                    userInfo={userInfo} 
                    isButtonLoading={isButtonLoading} 
                    theme={theme}
                    onClicked={createMyPreference} 
                  />
              )}
            </View>
          </TouchableWithoutFeedback>)
  );
};

export default SearchUser;
