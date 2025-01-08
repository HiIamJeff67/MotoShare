import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  Platform,
  Keyboard,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import { useNavigation } from "@react-navigation/native";
import {
  ScaledSheet,
  scale,
  verticalScale,
  moderateScale,
} from "react-native-size-matters";
import debounce from "lodash/debounce";
import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { OrderStyles } from "./Order.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OrderType {
  id: string;
  tolerableRDV: number;
  updatedAt: Date;
  startAddress: string;
  endAddress: string;
  creatorName: string;
}

const Order = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isMax, setIsMax] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();
  let roleText = "載入中...";

  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(OrderStyles(theme, insets))
    }
  }, [theme]);

  if (user.role == "Passenger") {
    roleText = t("pure rider"); 
  } else if (user.role == "Ridder") {
    roleText = t("pure passenger");
  }

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
    let response: { data: OrderType[] },
      url: string = "";

    if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/searchPaginationSupplyOrders`;
    } else if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/searchPaginationPurchaseOrders`;
    }

    try {
      setIsFetchingMore(true);

      response = await axios.get(url, {
        params: {
          creatorName: searchInput,
          limit: 10,
          offset: newOffset,
        },
      });

      setOrders((prevOrders) =>
        newOffset === 0 ? response.data : [...prevOrders, ...response.data]
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        if (error.response?.data.case === "E-C-104") {
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

  const handleSearchInputChange = debounce(() => {
    const regex = /^[a-zA-Z0-9_]+$/;
    if (regex.test(searchInput)) {
      SearchOrder();
    }
  }, 500);

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
                <Pressable
                  onPress={() =>
                    navigation.navigate(...["orderdetail", { orderid: item.id }] as never)
                  }
                >
                  <View style={styles.card}>
                    <View style={styles.header}>
                      <Text style={styles.orderNumber}>
                        {t("order id")}: {item.id}
                      </Text>
                    </View>
                    <View style={styles.body}>
                      <Text style={styles.title}>
                        {roleText}：{item.creatorName}
                      </Text>
                      <Text style={styles.title}>
                        {t("starting point")}：{item.startAddress}
                      </Text>
                      <Text style={styles.title}>{t("destination")}：{item.endAddress}</Text>
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
            ListHeaderComponent={
              <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                  <Feather
                    name="search"
                    size={moderateScale(24)}
                    color={theme?.colors.background}
                  />
                  <TextInput
                    placeholder={t("userName")}
                    style={styles.searchInput}
                    placeholderTextColor={theme?.colors.background}
                    value={searchInput}
                    onChangeText={(text) => setSearchInput(text)}
                    onSubmitEditing={handleSearchInputChange}
                  />
                </View>
              </View>
            }
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

export default Order;
