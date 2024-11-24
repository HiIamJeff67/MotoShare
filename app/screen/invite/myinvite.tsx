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
  scale,
  verticalScale,
  moderateScale,
} from "react-native-size-matters";

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
  status: String;
  receiverName: string;
}

const MyInvite = () => {
  const user = useSelector((state: RootState) => state.user);
  const [invites, setInvites] = useState<OrderType[]>([]);
  const navigation = useNavigation();
  let roleText = "載入中...";

  if (user.role == 1) {
    roleText = "乘客";
  } else if (user.role == 2) {
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

  useEffect(() => {
    // 透過 orderId 取得訂單資料
    let response,
      url = "";

    if (user.role == 1) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/passenger/searchMyPaginationPassengerInvites`;
    } else if (user.role == 2) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/ridder/searchMyPaginationRidderInvites`;
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
            limit: 10,
            offset: 0,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        });

        setInvites(response.data);
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
        {invites.map((invite) =>
          invite.status == "CHECKING" ? (
            <View key={invite.id} style={styles.container}>
              <Pressable
                key={invite.id}
                onPress={() =>
                  navigation.navigate("myinvitede", { orderid: invite.id })
                }
              >
                <View style={styles.card}>
                  <View style={styles.header}>
                    <Text style={styles.orderNumber}>
                      邀請編號: {invite.id}
                    </Text>
                  </View>

                  <View style={styles.body}>
                    <Text style={styles.title}>
                      你邀請了：{invite.receiverName}
                    </Text>
                    <Text style={styles.title}>
                      推薦起點：{invite.suggestStartAddress}
                    </Text>
                    <Text style={styles.title}>
                      推薦終點：{invite.suggestEndAddress}
                    </Text>
                    <Text style={styles.title}>
                      更新時間:{" "}
                      {new Date(invite.updatedAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          ) : null
        )}
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

export default MyInvite;
