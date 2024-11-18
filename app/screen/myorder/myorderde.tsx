import { Text, View, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/index";
import * as SecureStore from 'expo-secure-store';
import { useRoute } from '@react-navigation/native';
import { useNavigation, CommonActions } from '@react-navigation/native';

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
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
  const navigation = useNavigation();
  let roleText = "載入中...";

  if (user.role == 2) //home.tsx才正確
  {
    roleText = "乘客";
  }
  else if (user.role == 1)
  {
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
    const SearchOrder = async () => {
      try {
        // 透過 orderId 取得訂單資料
        let response, url = "";

        if (user.role == 1) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/passenger/getOrderById`;
        } else if (user.role == 2) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/order/ridder/getOrderById`;
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
      }
    }

    SearchOrder();
  }, []);

  const OrderStatus = async (status: number) => {
    try {
        let response, url = "", message = "";

        if (status == 1) {
            if (user.role == 1) {
              url = `${process.env.EXPO_PUBLIC_API_URL}/order/passenger/toFinishedStatusById`;
            } else if (user.role == 2) {
              url = `${process.env.EXPO_PUBLIC_API_URL}/order/ridder/toFinishedStatusById`;
            }

            message = "完成訂單成功";
        } else if (status == 2) {
            if (user.role == 1) {
            url = `${process.env.EXPO_PUBLIC_API_URL}/order/passenger/toStartedStatusById`;
            } else if (user.role == 2) {
            url = `${process.env.EXPO_PUBLIC_API_URL}/order/ridder/toStartedStatusById`;
            }
        } else if (status == 3) {
          if (user.role == 1) {
            url = `${process.env.EXPO_PUBLIC_API_URL}/order/passenger/toUnpaidStatusById`;
            } else if (user.role == 2) {
            url = `${process.env.EXPO_PUBLIC_API_URL}/order/ridder/toUnpaidStatusById`;
          }

          message = "付款成功";
      }

        // 獲取 Token
        const token = await getToken();

        if (!token) {
          Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
          return;
        }

        response = await axios.post(
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

        if (status != 2)
        {
          navigation.dispatch(
            CommonActions.reset({
              index: 1, // 設為 1，因為我們要有兩個頁面：HomeScreen 和 InvScreen
              routes: [{ name: 'home' }, { name: 'myorder' }],
            })
          );
          Alert.alert("成功", message);
        }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        if (status != 2)
        {
          Alert.alert("錯誤", JSON.stringify(error.response?.data.message));
        }

      } else {
        console.log("An unexpected error occurred:", error);

        if (status != 2)
        {
          Alert.alert("錯誤", "發生未知錯誤");
        }
      }
    }
  }

  useEffect(() => {
    if (order)
    {
        console.log(order.ridderStatus);
        console.log(order.passengerStatus);

        if (user.role == 1 && order.passengerStatus == "UNSTARTED" && new Date(order.startAfter) <= new Date())
        {
            console.log("set訂單1");
            OrderStatus(2);
        }

        if (user.role == 2 && order.ridderStatus == "UNSTARTED" && new Date(order.startAfter) <= new Date())
        {
            console.log("set訂單2");
            OrderStatus(2);
        }
    }
  }, [order]);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View className='pt-5'/>
          <View style={styles.card}>
              <View style={styles.header}>
                {order ? (
                  <>
                    <Text style={styles.orderNumber}>我的訂單編號: {order?.id}</Text>
                  </>
                  ) : (
                    <Text style={styles.title}>正在加載訂單資料...</Text>
                )}
              </View>
      
              <View style={styles.body}>
                {order ? (
                <>
                  <Text style={styles.title}>{roleText}：{user.role == 1 ? order.ridderName : order.passengerName}</Text>
                  <Text style={styles.title}>起點：{order.finalStartAddress}</Text>
                  <Text style={styles.title}>終點：{order.finalEndAddress}</Text>
                  <Text style={styles.title}>開車時間: {new Date(order.startAfter).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>最終價格: {order.finalPrice}</Text>
                  <Text style={styles.title}>我的備註: {user.role == 1 ? order.passengerDescription : order.ridderDescription}</Text>
                  <Text style={styles.title}>對方備註: {user.role == 1 ? order.ridderDescription : order.passengerDescription}</Text> 
                  <Text style={styles.title}>更新時間: {new Date(order.updatedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  {(user.role == 1 && order.passengerStatus == "STARTED") || (user.role == 2 && order.ridderStatus == "STARTED") ? (
                    <View className="justify-center items-center py-2">
                        <Pressable
                        style={{
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        className="rounded-[12px] shadow-lg w-full bg-green-500"
                        onPress={() => OrderStatus(3)}
                        >
                        <Text className="font-semibold text-lg">付款</Text>
                        </Pressable>
                    </View>
                    ) : null}
                  {(user.role == 1 && order.passengerStatus == "UNPAID") || (user.role == 2 && order.ridderStatus == "UNPAID") ? (
                    <View className="justify-center items-center py-2">
                        <Pressable
                        style={{
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        className="rounded-[12px] shadow-lg w-full bg-green-500"
                        onPress={() => OrderStatus(1)}
                        >
                        <Text className="font-semibold text-lg">完成</Text>
                        </Pressable>
                    </View>
                    ) : null}
                </>
                ) : (
                  <Text style={styles.title}>正在加載訂單資料...</Text>
                )}
              </View>
          </View>
        </SafeAreaView>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, // Android 的陰影
    },
    header: {
      borderBottomWidth: 2,
      borderBottomColor: '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    orderNumber: {
      color: '#333',
      fontWeight: 'bold',
      fontSize: 16,
    },
    body: {
      padding: 16,
    },
    textBase: {
      marginBottom: 10,
      fontSize: 14,
      color: '#666',
    },
    title: {
      marginBottom: 10,
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      height: 40,
      width: 80,
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      margin: 10,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
      height: 50,
      width: 200,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 20,
      backgroundColor: "#fff",
    },
});

export default MyOrderDetail;