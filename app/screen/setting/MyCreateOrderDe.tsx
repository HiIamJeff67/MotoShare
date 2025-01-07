import React from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import * as SecureStore from "expo-secure-store";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { MyCreateOrderDeStyles } from "./MyCreateOrderDe.style";

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

const MyCreateOrderDe = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const [order, setOrder] = useState<OrderType>();
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
  const { t } = useTranslation();
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(MyCreateOrderDeStyles(theme));
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
    // 通過 orderId 取得訂單資料
    let response,
      url = "";

    if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/getSupplyOrderById`;
    } else if (user.role == "Passenger") {
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
                <Text style={styles.orderNumber}>
                  {t("order id")}: {order?.id}
                </Text>
              </View>

              <View style={styles.body}>
                {order ? (
                  <>
                    <Text style={styles.title}>
                      {t("starting point")}：{order.startAddress}
                    </Text>
                    <Text style={styles.title}>
                      {t("destination")}：{order.endAddress}
                    </Text>
                    <Text style={styles.title}>
                      {"start driving"}:{" "}
                      {new Date(order.startAfter).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>
                      {"Initial price"}: {order.initPrice}
                    </Text>
                    {user.role == "Ridder" ? (
                      <Text style={styles.title}>
                        {t("Path deviation")}: {order.tolerableRDV}
                      </Text>
                    ) : null}
                    <Text style={styles.title}>
                      {t("update time")}:{" "}
                      {new Date(order.updatedAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>
                      {t("remark")}: {order.description}
                    </Text>
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

export default MyCreateOrderDe;
