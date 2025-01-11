import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/index";
import * as SecureStore from "expo-secure-store";
import { useRoute } from "@react-navigation/native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { MyOrderHisDeStyles } from "./MyOrderHisDe.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  starRatingByPassenger: number;
  starRatingByRidder: number;
  commentByPassenger: string;
  commentByRidder: string;
}

const MyOrderHistoryDetail = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
  const { t } = useTranslation();
  let roleText = "載入中...";

  const [order, setOrder] = useState<OrderType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputText, setInputText] = useState("");
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  const [styles, setStyles] = useState<any>(null);

  if (user.role === "Ridder") {
    //home.tsx才正確
    roleText = t("pure passenger");
  } else if (user.role === "Passenger") {
    roleText = t("pure rider");
  }

  useEffect(() => {
    if (theme) {
      setStyles(MyOrderHisDeStyles(theme, insets));
    }
  }, [theme])

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

        if (user.role === "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/history/passenger/getHistoryById`;
        } else if (user.role === "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/history/ridder/getHistoryById`;
        }

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

  const SendRate = async () => {
    setLoading(true);

    try {
      let response,
        url = "";

      if (user.role === "Passenger") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/history/passenger/rateAndCommentHistoryById`;
      } else if (user.role === "Ridder") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/history/ridder/rateAndCommentHistoryById`;
      }

      // 獲取 Token
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。", [
          { onPress: () => setLoading(false) },
        ]);
        return;
      }

      response = await axios.patch(
        url,
        {
          starRating: inputValue, // 這裡是 body 的部分，應該放在第二個參數
          comment: inputText,
        },
        {
          params: {
            id: orderid, // 查詢參數，會變成 `?id=orderid`
          },
          headers: {
            Authorization: `Bearer ${token}`, // 放在 headers 中
          },
        }
      );

      console.log(response.data);
      setLockButton(true);
      setLoading(false);
      Alert.alert(t("success"), t("Rating Success"));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [
          { onPress: () => setLoading(false) },
        ]);
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤", [
          { onPress: () => setLoading(false) },
        ]);
      }
    }
  };

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
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.orderNumber}>{t("Historical id")}: {order?.id}</Text>
              </View>

              <View style={styles.body}>
                {order ? (
                  <>
                    <Text style={styles.title}>
                      {roleText}：
                      {user.role === "Passenger" ? order.ridderName : order.passengerName}
                    </Text>
                    <Text style={styles.title}>
                      {t("starting point")}：{order.finalStartAddress}
                    </Text>
                    <Text style={styles.title}>
                      {t("destination")}：{order.finalEndAddress}
                    </Text>
                    <Text style={styles.title}>
                      {t("start time")}:{" "}
                      {new Date(order.startAfter).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>
                      {t("final price")}: {order.finalPrice}
                    </Text>
                    <Text style={styles.title}>
                      {t("Last Update")}:{" "}
                      {new Date(order.updatedAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    {(user.role === "Passenger" && order.starRatingByPassenger == 0) ||
                    (user.role === "Ridder" && order.starRatingByRidder == 0) ? (
                      <Pressable
                        style={[styles.rateButton]}
                        onPress={() => setModalVisible(true)}
                        disabled={loading || lockButton}
                      >
                        <Text style={styles.rateButtonText}>{t("rating")}</Text>
                      </Pressable>
                    ) : null}
                  </>
                ) : null}
              </View>
            </View>
            {order ? (
              <>
                <View style={{ marginTop: verticalScale(15) }} />
                {(user.role === "Passenger" && order.starRatingByRidder > 0) ||
                (user.role === "Ridder" && order.starRatingByPassenger > 0) ? (
                  <View style={styles.card}>
                    <View style={styles.body}>
                      <Text style={styles.title}>
                      {t("The rating given to you by others")}：
                        {user.role === "Passenger"
                          ? order?.starRatingByRidder
                          : order?.starRatingByPassenger}
                      </Text>
                      <Text style={styles.title}>
                      {t("The message from the other")}：
                        {user.role === "Passenger"
                          ? order?.commentByRidder
                          : order?.commentByPassenger}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </>
            ) : null}
            {/* 彈出窗口 */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>{t("Please enter your rating")}(1-5):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t("rating")}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholderTextColor="gray"
                  />
                  <Text style={styles.modalText}>{t("Please enter your message")}:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t("comment")}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholderTextColor="gray"
                  />
                  <View style={{ flexDirection: "row" }}>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                      disabled={loading || lockButton}
                    >
                      <Text style={styles.textStyle}>{t("back")}</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        SendRate();
                      }}
                      disabled={loading || lockButton}
                    >
                      <Text style={styles.textStyle}>{t("confirm")}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
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
  rateButton: {
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
  rateButtonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    padding: moderateScale(30),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: scale(0),
      height: verticalScale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(4),
    elevation: 5,
  },
  button: {
    height: verticalScale(40),
    width: scale(80),
    borderRadius: moderateScale(20),
    elevation: 2,
    margin: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: verticalScale(15),
    textAlign: "center",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  input: {
    height: verticalScale(40),
    width: scale(200),
    borderColor: "#ccc",
    borderWidth: scale(1),
    borderRadius: moderateScale(8),
    paddingHorizontal: verticalScale(10),
    marginBottom: verticalScale(15),
    backgroundColor: "#fff",
  },
});

export default MyOrderHistoryDetail;
