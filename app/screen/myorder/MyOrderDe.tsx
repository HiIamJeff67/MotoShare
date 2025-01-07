import React from "react";
import { Text, View, StyleSheet, ScrollView, Alert, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/index";
import * as SecureStore from "expo-secure-store";
import { useRoute } from "@react-navigation/native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  description: string;
  startAfter: Date;
  finalPrice: number;
  suggestPrice: number;
  startAddress: string;
  finalStartAddress: string;
  finalEndAddress: string;
  suggestStartAfter: Date;
  passengerDescription: string;
  ridderDescription: string;
  updatedAt: Date;
  endedAt: Date;
  passengerStatus: string;
  ridderStatus: string;
  ridderName: string;
  passengerName: string;
}

const MyOrderDetail = () => {
  const user = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<OrderType>();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
  const navigation = useNavigation();
  const { t } = useTranslation();
  let roleText = "載入中...";

  if (user.role === "Ridder") {
    //home.tsx才正確
    roleText = t("passenger");
  } else if (user.role === "Passenger") {
    roleText = t("rider");
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

  // 監控 loading 狀態變化，禁用或恢復返回
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (loading) {
      // 禁用手勢返回並隱藏返回按鈕
      navigation.setOptions({
        gestureEnabled: false,
      });

      // 禁用物理返回按鈕
      unsubscribe = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault(); // 禁用返回
      });
    } else {
      // 恢復手勢返回和返回按鈕
      navigation.setOptions({
        gestureEnabled: true,
      });

      // 移除返回監聽器
      if (unsubscribe) {
        unsubscribe();
      }

      if (lockButton) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "home" }, { name: "myorder" }],
          })
        );
      }
    }

    // 在組件卸載時移除監聽器
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loading, navigation]);

  useEffect(() => {
    const SearchOrder = async () => {
      try {
        // 透過 orderId 取得訂單資料
        let response,
          url = "";

        if (user.role === "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/passenger/getOrderById`;
        } else if (user.role === "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/ridder/getOrderById`;
        }

        // 獲取 Token
        const token = await getToken();

        if (!token) {
          Alert.alert(t("Token failed"), t("unable to get token"));
          return;
        }

        response = await axios.get(url, {
          params: {
            id: orderid,
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
      } finally {
        setIsLoading(false);
      }
    };

    SearchOrder();
  }, []);

  const OrderStatus = async (status: number) => {
    if (status != 2) {
      setLoading(true);
    }

    try {
      let response,
        url = "",
        message = "";

      if (status == 1) {
        if (user.role === "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/passenger/toFinishedStatusById`;
        } else if (user.role === "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/ridder/toFinishedStatusById`;
        }

        message = t("Completed the order successfully");
      } else if (status == 2) {
        if (user.role === "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/passenger/toStartedStatusById`;
        } else if (user.role === "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/ridder/toStartedStatusById`;
        }
      } else if (status == 3) {
        if (user.role === "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/passenger/toUnpaidStatusById`;
        } else if (user.role === "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/ridder/toUnpaidStatusById`;
        }

        message = t("paymentSuccess");
      }

      // 獲取 Token
      const token = await getToken();

      if (!token) {
        Alert.alert(t("Token failed"), t("unable to get token。"), [{ onPress: () => setLoading(false) }]);
        return;
      }

      response = await axios.patch(
        url,
        null, // No body, so use `null` as the second argument
        {
          headers: {
            Authorization: `Bearer ${token}`, // 放在 headers 中
          },
          params: {
            id: orderid, // 查詢參數，會變成 `?id=orderid`
          },
        }
      );

      console.log(response.data);

      if (status != 2) {
        setLockButton(true);
        setLoading(false);
        Alert.alert(t("success"), message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        if (status != 2) {
          Alert.alert(t("error"), JSON.stringify(error.response?.data.message), [{ onPress: () => setLoading(false) }]);
        }
      } else {
        console.log("An unexpected error occurred:", error);

        if (status != 2) {
          Alert.alert(t("error"), t("An unknown error occurred"), [{ onPress: () => setLoading(false) }]);
        }
      }
    }
  };

  useEffect(() => {
    if (order) {
      console.log(order.ridderStatus);
      console.log(order.passengerStatus);

      if (user.role === "Passenger" && order.passengerStatus == "UNSTARTED" && new Date(order.startAfter) <= new Date()) {
        console.log("set訂單1");
        OrderStatus(2);
      }

      if (user.role === "Ridder" && order.ridderStatus == "UNSTARTED" && new Date(order.startAfter) <= new Date()) {
        console.log("set訂單2");
        OrderStatus(2);
      }
    }
  }, [order]);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.orderNumber}>
                  {t("my order id")}: {order?.id}
                </Text>
              </View>

              <View style={styles.body}>
                {order ? (
                  <>
                    <Text style={styles.title}>
                      {roleText}：{user.role === "Passenger" ? order.ridderName : order.passengerName}
                    </Text>
                    <Text style={styles.title}>
                      {t("starting point")}：{order.finalStartAddress}
                    </Text>
                    <Text style={styles.title}>
                      {t("destination")}：{order.finalEndAddress}
                    </Text>
                    <Text style={styles.title}>
                      {t("start driving")}:{" "}
                      {new Date(order.startAfter).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>
                      {t("final price")}: {order.finalPrice}
                    </Text>
                    <Text style={styles.title}>
                      {t("my remark")}: {user.role === "Passenger" ? order.passengerDescription : order.ridderDescription}
                    </Text>
                    <Text style={styles.title}>
                      {t("other remark")}: {user.role === "Passenger" ? order.ridderDescription : order.passengerDescription}
                    </Text>
                    <Text style={styles.title}>
                      {t("update time")}:{" "}
                      {new Date(order.updatedAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    {(user.role === "Passenger" && order.passengerStatus == "STARTED") ||
                    (user.role === "Ridder" && order.ridderStatus == "STARTED") ? (
                      <>
                        <Pressable style={[styles.actionButton]} onPress={() => OrderStatus(3)} disabled={loading || lockButton}>
                          <Text style={styles.actionButtonText}>{t("Payment Cash")}</Text>
                        </Pressable>
                        <Pressable style={[styles.actionButton]} onPress={() => OrderStatus(3)} disabled={loading || lockButton}>
                          <Text style={styles.actionButtonText}>{t("Payment Balance")}</Text>
                        </Pressable>
                      </>
                    ) : null}
                    {(user.role === "Passenger" && order.passengerStatus == "UNPAID") ||
                    (user.role === "Ridder" && order.ridderStatus == "UNPAID") ? (
                      <Pressable style={[styles.actionButton]} onPress={() => OrderStatus(1)} disabled={loading || lockButton}>
                        <Text style={styles.actionButtonText}>{t("done")}</Text>
                      </Pressable>
                    ) : null}
                  </>
                ) : null}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(20), // 設置水平間距
    paddingTop: verticalScale(15), // 設置垂直間距
    paddingBottom: verticalScale(30), // 設置垂直間距
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
  actionButton: {
    borderRadius: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: { width: scale(0), height: verticalScale(2) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(4),
    backgroundColor: "#4CAF50", // green
    elevation: 5,
    height: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "white",
  },
});

export default MyOrderDetail;
