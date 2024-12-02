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
  const [order, setOrder] = useState<OrderType>();
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputText, setInputText] = useState("");
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  let roleText = "載入中...";

  if (user.role == 2) {
    //home.tsx才正確
    roleText = "乘客";
  } else if (user.role == 1) {
    roleText = "車主";
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

        if (user.role == 1) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/history/passenger/getHistoryById`;
        } else if (user.role == 2) {
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

  const SendRate = async () => {
    setLoading(true);

    try {
      let response,
        url = "";

      if (user.role == 1) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/history/passenger/rateAndCommentHistoryById`;
      } else if (user.role == 2) {
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

      response = await axios.post(
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
      Alert.alert("成功", "評分成功");
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.orderNumber}>歷史編號: {order?.id}</Text>
              </View>

              <View style={styles.body}>
                {order ? (
                  <>
                    <Text style={styles.title}>
                      {roleText}：
                      {user.role == 1 ? order.ridderName : order.passengerName}
                    </Text>
                    <Text style={styles.title}>
                      起點：{order.finalStartAddress}
                    </Text>
                    <Text style={styles.title}>
                      終點：{order.finalEndAddress}
                    </Text>
                    <Text style={styles.title}>
                      開始時間:{" "}
                      {new Date(order.startAfter).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>
                      最終價格: {order.finalPrice}
                    </Text>
                    <Text style={styles.title}>
                      最後更新:{" "}
                      {new Date(order.updatedAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    {(user.role == 1 && order.starRatingByPassenger == 0) ||
                    (user.role == 2 && order.starRatingByRidder == 0) ? (
                      <Pressable
                        style={[styles.rateButton]}
                        onPress={() => setModalVisible(true)}
                        disabled={loading || lockButton}
                      >
                        <Text style={styles.rateButtonText}>評分</Text>
                      </Pressable>
                    ) : null}
                  </>
                ) : null}
              </View>
            </View>
            {order ? (
              <>
                <View style={{ marginTop: 15 }} />
                {(user.role == 1 && order.starRatingByRidder > 0) ||
                (user.role == 2 && order.starRatingByPassenger > 0) ? (
                  <View style={styles.card}>
                    <View style={styles.body}>
                      <Text style={styles.title}>
                        對方給你的評分：
                        {user.role == 1
                          ? order?.starRatingByRidder
                          : order?.starRatingByPassenger}
                      </Text>
                      <Text style={styles.title}>
                        對方給你的留言：
                        {user.role == 1
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
                  <Text style={styles.modalText}>請輸入評分(1-5):</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="評分"
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholderTextColor="gray"
                  />
                  <Text style={styles.modalText}>請輸入留言:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="留言"
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
                      <Text style={styles.textStyle}>返回</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        SendRate();
                      }}
                      disabled={loading || lockButton}
                    >
                      <Text style={styles.textStyle}>確認</Text>
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
