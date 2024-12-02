import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
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
  initPrice: number;
  suggestPrice: number;
  startAddress: string;
  suggestStartAddress: string;
  suggestEndAddress: string;
  suggestStartAfter: Date;
  phoneNumber: string;
  endAddress: string;
  inviteUdpatedAt: Date;
  inviteBriefDescription: string;
}

const OtherInviteDetail = () => {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invite, setInvite] = useState<OrderType>();
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
  const [lockButton, setLockButton] = useState(false);
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
            routes: [{ name: "home" }, { name: "myinvite" }],
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
    // 透過 orderId 取得訂單資料
    let response,
      url = "";

    if (user.role == 1) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/passenger/getMyRidderInviteById`;
    } else if (user.role == 2) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/ridder/getMyPassengerInviteById`;
    }

    const SearchInvite = async () => {
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

        setInvite(response.data);
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

    SearchInvite();
  }, []);

  const InviteStatus = async (decide: number) => {
    setLoading(true);

    try {
      let response,
        url = "",
        decideT = "",
        message = "";

      if (user.role == 1) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/passenger/decideRidderInviteById`;
      } else if (user.role == 2) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/ridder/decidePassengerInviteById`;
      }

      if (decide == 1) {
        decideT = "ACCEPTED";
        message = "接受邀請成功";
      } else {
        decideT = "REJECTED";
        message = "拒絕邀請成功";
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
          status: decideT, // 這裡是 body 的部分，應該放在第二個參數
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

      setLockButton(true);
      setLoading(false);
      Alert.alert("成功", message);
      //console.log(response.data);
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
                <Text style={styles.orderNumber}>邀請編號: {invite?.id}</Text>
              </View>

              <View style={styles.body}>
                {invite ? (
                  <>
                    <Text style={styles.maintitle}>別人推薦</Text>
                    <Text style={styles.title}>
                      起點：{invite.suggestStartAddress}
                    </Text>
                    <Text style={styles.title}>
                      終點：{invite.suggestEndAddress}
                    </Text>
                    <Text style={styles.title}>
                      開車時間:{" "}
                      {new Date(invite.suggestStartAfter).toLocaleString(
                        "en-GB",
                        {
                          timeZone: "Asia/Taipei",
                        }
                      )}
                    </Text>
                    <Text style={styles.title}>
                      價格: {invite.suggestPrice}
                    </Text>
                    <Text style={styles.title}>
                      更新時間:{" "}
                      {new Date(invite.inviteUdpatedAt).toLocaleString(
                        "en-GB",
                        {
                          timeZone: "Asia/Taipei",
                        }
                      )}
                    </Text>
                    <Text style={styles.title}>
                      備註: {invite.inviteBriefDescription}
                    </Text>
                    <Pressable
                      style={[styles.inviteButton]}
                      onPress={() => InviteStatus(1)}
                      disabled={loading || lockButton}
                    >
                      <Text style={styles.inviteButtonText}>接受邀請</Text>
                    </Pressable>
                    <View style={{ marginTop: 10 }} />
                    <Pressable
                      style={[
                        styles.inviteButton,
                        {
                          height: verticalScale(40),
                          justifyContent: "center",
                          alignItems: "center",
                        },
                      ]}
                      onPress={() => InviteStatus(2)}
                      disabled={loading || lockButton}
                    >
                      <Text style={styles.inviteButtonText}>拒絕邀請</Text>
                    </Pressable>
                  </>
                ) : null}
              </View>
            </View>
            <View style={{ marginTop: 15 }} />
            <View style={styles.card}>
              <View style={styles.body}>
                {invite ? (
                  <>
                    <Text style={styles.maintitle}>原本訂單</Text>
                    <Text style={styles.title}>
                      起點：{invite.startAddress}
                    </Text>
                    <Text style={styles.title}>終點：{invite.endAddress}</Text>
                    <Text style={styles.title}>
                      開車時間:{" "}
                      {new Date(invite.startAfter).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>價格: {invite.initPrice}</Text>
                    <Text style={styles.title}>備註: {invite.description}</Text>
                  </>
                ) : (
                  null
                )}
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
  maintitle: {
    marginBottom: verticalScale(10),
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
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

export default OtherInviteDetail;
