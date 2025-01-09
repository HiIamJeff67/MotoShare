import React, { useEffect, useState } from "react";
import { Text, View, TouchableWithoutFeedback, Pressable, Platform, Keyboard, ActivityIndicator, RefreshControl } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet, scale, verticalScale, moderateScale } from "react-native-size-matters";
import debounce from "lodash/debounce";
import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { POrderStyles } from "./POrder.style";

interface OrderType {
  id: string;
  startAfter: Date;
  scheduledDay: string;
}

const POrder = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isMax, setIsMax] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(POrderStyles(theme, insets));
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
  
  const dismissKeyboard = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
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

  const SearchOrder = async (newOffset = 0) => {
    const token = await getToken();

    let response: { data: OrderType[] },
      url: string = "";

    if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/periodicSupplyOrder/searchMyPaginationPeriodicSupplyOrders`;
    } else if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/periodicPurchaseOrder/searchMyPaginationPeriodicPurchaseOrders`;
    }

    try {
      setIsFetchingMore(true);

      response = await axios.get(url, {
        params: {
          limit: 10,
          offset: newOffset,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //console.log(response.data);
      setOrders((prevOrders) => (newOffset === 0 ? response.data : [...prevOrders, ...response.data]));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        if (error.response?.data.case === "E-C-114") {
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

  useEffect(() => {
    setOffset(0);
    setIsMax(false); // 重置 isMax 狀態
    SearchOrder(0); // 傳入 0，確保從頭開始加載
  }, []);

  const loadMoreOrders = debounce(() => {
    const newOffset = offset + 10;
    setOffset(newOffset); // 更新 offset 狀態
    SearchOrder(newOffset); // 使用新的 offset 來進行下一次加載
  }, 500);

  return (
    <View style={{ flex: 1 }}>
      {isLoading || !styles || !theme ? (
        <LoadingWrapper />
      ) : (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <FlashList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View key={item.id} style={styles.container}>
                <Pressable onPress={() => navigation.navigate(...(["porderdetail", { orderid: item.id }] as never))}>
                  <View style={styles.card}>
                    <View style={styles.header}>
                      <Text style={styles.orderNumber}>
                        {t("order id")}: {item.id}
                      </Text>
                    </View>
                    <View style={styles.body}>
                      <Text style={styles.title}>
                        {t("Weekday")}：{t(item.scheduledDay)}
                      </Text>
                      <Text style={styles.title}>
                        {t("start time")}:{" "}
                        {new Date(item.startAfter).toLocaleTimeString("en-GB", {
                          timeZone: "Asia/Taipei",
                        })}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            estimatedItemSize={282}
            onEndReached={!isMax && !isFetchingMore ? loadMoreOrders : null}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isFetchingMore && orders.length >= 10 ? (
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
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default POrder;
