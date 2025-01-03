import React, { useState, useEffect } from "react";
import { Text, View, TouchableWithoutFeedback, Pressable, TextInput, Platform, Keyboard, Alert, Image, InteractionManager } from "react-native";
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

interface OrderType {
  id: string;
  creatorName: string;
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
  const [styles, setStyles] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  let roleText = "載入中...";

  useEffect(() => {
    if (theme) {
      setStyles(Styles(theme));
    }
  }, [theme]);

  if (user.role == "Ridder") {
    roleText = "乘客";
  } else if (user.role == "Passenger") {
    roleText = "車主";
  }

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

  const dismissKeyboard = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  const SearchOrder = async () => {
    let response: { data: OrderType[] },
      url: string = "";

    if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/searchPaginationSupplyOrders`;
    } else if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/searchPaginationPurchaseOrders`;
    }

    try {
      response = await axios.get(url, {
        params: {
          creatorName: searchInput,
          limit: 1,
          offset: 0,
        },
      });

      SearchUserInfo(response.data[0].creatorName);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  const SearchUserInfo = async (userName: string) => {
    // 獲取 Token
    const token = await getToken();

    if (!token) {
      Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
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
      <View style={{ flex: 1, paddingHorizontal: scale(20), paddingVertical: verticalScale(15) }}>
        {styles === null ? (
          <LoadingWrapper />
        ) : (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Feather name="search" size={moderateScale(24)} color="black" />
                <TextInput
                  placeholder="使用者"
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
                      <Text style={styles.title}>年齡：{userInfo.info.age}</Text>
                      <Text style={styles.title}>機車類型：{userInfo.info.motocycleType}</Text>
                      <Text style={styles.title}>線上狀態：{userInfo.info.isOnline ? "線上" : "離線"}</Text>
                      <Text style={styles.title}>自我介紹：{userInfo.info.selfIntroduction}</Text>
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
            )}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchUser;
