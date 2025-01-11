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
import { OtherInviteStyles } from "./OtherInvite.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  suggestStartAddress: string;
  suggestEndAddress: string;
  updatedAt: Date;
  suggestStartAfter: Date;
  status: String;
  inviterName: string;
}

const OtherOrder = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isMax, setIsMax] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [invites, setInvites] = useState<OrderType[]>([]);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(OtherInviteStyles(theme, insets));
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
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/passenger/searchMyPaginationRidderInvites`;
    } else if (user.role === "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/ridder/searchMyPaginationPasssengerInvites`;
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

      setInvites((prevOrders) =>
        newOffset === 0 ? response.data : [...prevOrders, ...response.data]
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.data.case === "E-C-102") {
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
          <FlashList
            data={invites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.status == "CHECKING" ? (
                <View key={item.id} style={styles.container}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate(...["otherinvitede", { orderid: item.id }] as never)
                    }
                  >
                    <View style={styles.card}>
                      <View style={styles.header}>
                        <Text style={styles.orderNumber}>
                          邀請編號: {item.id}
                        </Text>
                      </View>

                      <View style={styles.body}>
                        <Text style={styles.title}>
                          邀請人：{item.inviterName}
                        </Text>
                        <Text style={styles.title}>
                          推薦起點：{item.suggestStartAddress}
                        </Text>
                        <Text style={styles.title}>
                          推薦終點：{item.suggestEndAddress}
                        </Text>
                        <Text style={styles.title}>
                          更新時間:{" "}
                          {new Date(item.updatedAt).toLocaleString("en-GB", {
                            timeZone: "Asia/Taipei",
                          })}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                </View>
              ) : null
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            estimatedItemSize={282}
            onEndReached={!isMax && !isFetchingMore ? loadMoreOrders : null}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isFetchingMore && invites.length >= 10 ? (
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

export default OtherOrder;
