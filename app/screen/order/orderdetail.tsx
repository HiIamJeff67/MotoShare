import React from "react";
import { Text, View, ScrollView, Alert, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/";
import * as SecureStore from "expo-secure-store";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ScaledSheet, scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";

// 定義 Creator 的資料結構
interface CreatorInfoType {
  avatorUrl: string | null;
  isOnline: boolean;
  motocyclePhotoUrl: string | null;
  motocycleType: string | null;
}

interface CreatorType {
  info: CreatorInfoType;
  userName: string;
}

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  description: string;
  tolerableRDV: number;
  startAfter: Date;
  initPrice: number;
  startAddress: string;
  endAddress: string;
  updatedAt: Date;
  endedAt: Date;
  creator: CreatorType;
}

const OrderDetail = () => {
  const user = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<OrderType>();
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
  const navigation = useNavigation();
  const {t} = useTranslation();
  let roleText = "載入中...";

  if (user.role == "Ridder") {
    roleText = t("rider");
  } else if (user.role == "Passenger") {
    roleText = t("passenger");
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

  useEffect(() => {
    // 通過 orderId 取得訂單資料
    let response,
      url = "";

    if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/getSupplyOrderById`;
    } else if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/getPurchaseOrderById`;
    }

    const SearchOrder = async () => {
      try {
        // 獲取 Token
        const token = await getToken();

        if (!token) {
          Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
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
        //console.log(response.data);
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

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <LoadingWrapper />
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.orderNumber}>{t("order id")}: {order?.id}</Text>
              </View>

              <View style={styles.body}>
                {order ? (
                  <>
                    <Text style={styles.title}>
                      {roleText}：{order.creator.userName}
                    </Text>
                    <Text style={styles.title}>{t("starting point")}：{order.startAddress}</Text>
                    <Text style={styles.title}>{t("destination")}：{order.endAddress}</Text>
                    <Text style={styles.title}>
                      {("start driving")}:{" "}
                      {new Date(order.startAfter).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>
                    {("Initial price")}: {order.initPrice}
                    </Text>
                    {user.role == "Ridder" 
                      ? <Text style={styles.title}>{t("Path deviation")}: {order.tolerableRDV}</Text>
                      : null
                    }
                    <Text style={styles.title}>
                      {t("update time")}:{" "}
                      {new Date(order.updatedAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>{t("remark")}: {order.description}</Text>
                    <Pressable
                      style={[styles.inviteButton]}
                      onPress={() =>
                        navigation.navigate(...["invitemap", {
                          orderId: orderid,
                          orderStartAddress: order.startAddress,
                          orderEndAddress: order.endAddress,
                          orderInitPrice: order.initPrice,
                          orderStartAfter: order.startAfter,
                        }] as never)
                      }
                    >
                      <Text style={styles.inviteButtonText}>{t("Create invitation")}</Text>
                    </Pressable>
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

const styles = ScaledSheet.create({
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBox: {
    height: verticalScale(40),
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    borderRadius: moderateScale(50),
    borderWidth: scale(1),
    borderColor: "gray",
    backgroundColor: "white",
    paddingHorizontal: scale(16),
  },
  searchInput: {
    marginLeft: scale(8),
    flex: 1,
    fontSize: moderateScale(20),
  },
  addButtonContainer: {
    padding: moderateScale(12),
    backgroundColor: "gray",
    borderRadius: moderateScale(50),
    marginLeft: scale(10),
  },
  inviteButton: {
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
  inviteButtonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "white",
  },
});

export default OrderDetail;
