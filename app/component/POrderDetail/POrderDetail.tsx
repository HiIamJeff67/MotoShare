import React from "react";
import { Text, View, ScrollView, Alert, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import * as SecureStore from "expo-secure-store";
import { useRoute, useNavigation, CommonActions } from "@react-navigation/native";
import { ScaledSheet, scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { POrderInterface } from "@/interfaces/order.interface";
import { POrderDetailStyles } from "./POrderDetail.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const POrderDetail = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };

  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  const [order, setOrder] = useState<POrderInterface>();
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(POrderDetailStyles(theme, insets));
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
      url = `${process.env.EXPO_PUBLIC_API_URL}/periodicSupplyOrder/getMyPeriodicSupplyOrderById`;
    } else if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/periodicPurchaseOrder/getMyPeriodicPurchaseOrderById`;
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

  const deleteOrder = async () => {
    setIsButtonLoading(true);

    let response,
      url = "";

    if (user.role == "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/periodicSupplyOrder/deleteMyPeriodicSupplyOrderById`;
    } else if (user.role == "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/periodicPurchaseOrder/deleteMyPeriodicPurchaseOrderById`;
    }

    try {
      // 獲取 Token
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。", [{ onPress: () => setIsButtonLoading(false) }]);
        return;
      }

      response = await axios.delete(url, {
        params: {
          id: orderid,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setIsButtonLoading(false);
      setLockButton(true);
      Alert.alert(t("success"), "刪除成功");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [{ onPress: () => setIsButtonLoading(false) }]);
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤", [{ onPress: () => setIsButtonLoading(false) }]);
      }
    }
  };

  // 監控 loading 狀態變化，禁用或恢復返回
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isButtonLoading) {
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
            routes: [{ name: "home" }, { name: "porder" }],
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
  }, [isButtonLoading, navigation]);

  return (
    <View style={{ flex: 1 }}>
      {isLoading || !styles || !theme ? (
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
                      {t("Initial price")}: {order.initPrice}
                    </Text>
                    <Text style={styles.title}>
                      {t("Weekday")}：{t(order.scheduledDay)}
                    </Text>
                    <Text style={styles.title}>
                      {t("start driving")}:{" "}
                      {new Date(order.startAfter).toLocaleTimeString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    {user.role == "Ridder" ? (
                      <Text style={styles.title}>
                        {t("Path deviation")}: {order.tolerableRDV}
                      </Text>
                    ) : null}
                    <Text style={styles.description}>
                      {t("remark")}: {order.description}
                    </Text>
                    <Pressable style={[styles.inviteButton]} disabled={isButtonLoading || lockButton} onPress={() => deleteOrder()}>
                      <Text style={styles.inviteButtonText}>{isButtonLoading ? <ActivityIndicator size="large" color="black" /> : t("Delete")}</Text>
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

export default POrderDetail;
