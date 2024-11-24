import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/index";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import {
  ScaledSheet,
  scale,
  verticalScale,
  moderateScale,
} from "react-native-size-matters";

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
  const user = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<OrderType[]>([]);
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

  useEffect(() => {
    const SearchOrder = async () => {
      try {
        // 透過 orderId 取得訂單資料
        let response,
          url = "";

        if (user.role == 1) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/history/passenger/searchPaginationHistories`;
        } else if (user.role == 2) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/history/ridder/searchPaginationHistories`;
        }

        // 獲取 Token
        const token = await getToken();

        if (!token) {
          Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
          return;
        }

        response = await axios.get(url, {
          params: {
            limit: 10,
            offset: 0,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(response.data);
        console.log(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        } else {
          console.log("An unexpected error occurred:", error);
        }
      }
    };

    SearchOrder();
  }, []);

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          paddingHorizontal: scale(20), // 設置水平間距
          paddingVertical: verticalScale(15), // 設置垂直間距
        }}
      >
        {order.map((order) => (
          <View key={order.id} style={styles.container}>
            <Pressable
              key={order.id}
              onPress={() =>
                navigation.navigate("myorderhisde", { orderid: order.id })
              }
            >
              <View style={styles.card}>
                <View style={styles.header}>
                  <Text style={styles.orderNumber}>歷史編號: {order?.id}</Text>
                </View>
                <View style={styles.body}>
                  <Text style={styles.title}>
                    起點：{order.finalStartAddress}
                  </Text>
                  <Text style={styles.title}>
                    終點：{order.finalEndAddress}
                  </Text>
                  <Text style={styles.title}>
                    更新時間:{" "}
                    {new Date(order.updatedAt).toLocaleString("en-GB", {
                      timeZone: "Asia/Taipei",
                    })}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    elevation: 5, // Android 的陰影
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

export default MyOrderHistory;
