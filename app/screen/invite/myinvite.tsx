import React, { useEffect, useState } from "react";
import { Text, View, Pressable, ActivityIndicator, RefreshControl, Alert } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/index";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { ScaledSheet } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import debounce from "lodash/debounce";

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  description: string;
  startAfter: Date;
  initPrice: number;
  suggestPrice: number;
  suggestStartAddress: string;
  suggestEndAddress: string;
  updatedAt: Date;
  suggestStartAfter: Date;
  endedAt: Date;
  status: string;
  receiverName: string;
}

const MyInvite = () => {
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [invites, setInvites] = useState<OrderType[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isMax, setIsMax] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

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

    if (user.role == 1) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/passenger/searchMyPaginationPassengerInvites`;
    } else if (user.role == 2) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/ridder/searchMyPaginationRidderInvites`;
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

      setInvites((prevOrders) => (newOffset === 0 ? response.data : [...prevOrders, ...response.data]));
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <FlashList
          data={invites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.container}>
              <Pressable onPress={() => navigation.navigate("myinvitede", { orderid: item.id })}>
                <View style={styles.card}>
                  <View style={styles.header}>
                    <Text style={styles.orderNumber}>邀請編號: {item.id}</Text>
                  </View>

                  <View style={styles.body}>
                    <Text style={styles.title}>你邀請了：{item.receiverName}</Text>
                    <Text style={styles.title}>推薦起點：{item.suggestStartAddress}</Text>
                    <Text style={styles.title}>推薦終點：{item.suggestEndAddress}</Text>
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
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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

const styles = ScaledSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingBottom: verticalScale(15),
  },
  card: {
    backgroundColor: "white",
    borderRadius: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: { width: scale(0), height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
    elevation: 5,
  },
  header: {
    borderBottomWidth: scale(2),
    borderBottomColor: "#ddd",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
  },
  orderNumber: {
    color: "#333",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  body: {
    padding: moderateScale(16),
  },
  title: {
    marginBottom: verticalScale(5),
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: "#333",
  },
});

export default MyInvite;
