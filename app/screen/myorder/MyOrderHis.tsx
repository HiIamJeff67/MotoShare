import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/index";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { ScaledSheet } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { MyOrderHisStyles } from "./MyOrderHis.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  description: string;
  tolerableRDV: number;
  startAfter: Date;
  initPrice: number;
  endAddress: string;
  updatedAt: Date;
  endedAt: Date;
  passengerStatus: string;
  ridderStatus: string;
  ridderName: string;
  passengerName: string;
  finalStartAddress: string;
  finalEndAddress: string;
}

const MyOrderHistory = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isMax, setIsMax] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [order, setOrder] = useState<OrderType[]>([]);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    setOffset(0);
    setIsMax(false); // 重置 isMax 狀態
    SearchOrder(0); // 傳入 0，確保從頭開始加載
  }, []);

  useEffect(() => {
    if (theme) {
      setStyles(MyOrderHisStyles(theme, insets));
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

  const SearchOrder = async (newOffset = 0) => {
    let response: { data: OrderType[] },
      url: string = "";

    if (user.role === "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/history/passenger/searchPaginationHistories`;
    } else if (user.role === "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/history/ridder/searchPaginationHistories`;
    }

    try {
      setIsFetchingMore(true);

      // 獲取 Token
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
        return;
      }

      response = await axios.get(url, {
        params: {
          limit: 10,
          offset: newOffset,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder((prevOrders) =>
        newOffset === 0 ? response.data : [...prevOrders, ...response.data]
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.data.case === "E-C-109") {
          setIsMax(true);
        }
      } else {
        console.log("An unexpected error occurred:", error);
      }
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setOffset(0);
      setIsMax(false); // 重置 isMax 狀態
      SearchOrder(0); // 傳入 0，確保從頭開始加載
      setRefreshing(false);
    }, 2000);
  };

  const loadMoreOrders = debounce(() => {
    const newOffset = offset + 10;
    setOffset(newOffset); // 更新 offset 狀態
    SearchOrder(newOffset); // 使用新的 offset 來進行下一次加載
  }, 500);

  return (
    <View style={{ flex: 1 }}>
      {isLoading || !styles || !theme ? (
        <View style={{
          flex: 1, 
          justifyContent: "center", 
          alignItems: "center", 
        }}>
          <ActivityIndicator size="large" color={theme?.colors.text} />
        </View>
      ) : (
          <FlashList
            data={order}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View key={item.id} style={styles.container}>
                <Pressable
                  onPress={() =>
                    navigation.navigate(...["myorderhisde", { orderid: item.id }] as never)
                  }
                >
                  <View style={styles.card}>
                    <View style={styles.header}>
                      <Text style={styles.orderNumber}>
                        {t("Historical id")}: {item?.id}
                      </Text>
                    </View>
                    <View style={styles.body}>
                      <Text style={styles.title}>
                        {t("starting point")}：{item.finalStartAddress}
                      </Text>
                      <Text style={styles.title}>
                        {t("destination")}：{item.finalEndAddress}
                      </Text>
                      <Text style={styles.title}>
                        {t("update time")}:{" "}
                        {new Date(item.updatedAt).toLocaleString("en-GB", {
                          timeZone: "Asia/Taipei",
                        })}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            estimatedItemSize={282}
            onEndReached={!isMax && !isFetchingMore ? loadMoreOrders : null}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isFetchingMore && order.length >= 10 ? (
                <View
                  style={{
                    marginTop: verticalScale(10),
                    marginBottom: verticalScale(25),
                  }}
                >
                  <ActivityIndicator size="large" color="black" />
                </View>
              ) : null
            }
            contentContainerStyle={{
              paddingHorizontal: scale(20),
              paddingVertical: verticalScale(15),
            }}
          />
      )}
    </View>
  );
};

export default MyOrderHistory;