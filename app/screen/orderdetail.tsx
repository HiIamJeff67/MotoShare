import { Text, View, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "../(store)/index";
import * as SecureStore from 'expo-secure-store';
import { useRoute, useNavigation } from '@react-navigation/native';

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
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
  const navigation = useNavigation();
  let roleText = "載入中...";

  if (user.role == 1)
  {
    roleText = "車主";
  }
  else if (user.role == 2)
  {
    roleText = "乘客";
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
    let response, url = "";

    if (user.role == 1) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/getSupplyOrderById`;
    } else if (user.role == 2) {
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
      }
    }

    SearchOrder();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View className='pt-5'/>
          <View style={styles.card}>
              <View style={styles.header}>
                {order ? (
                  <>
                    <Text style={styles.orderNumber}>訂單編號: {order?.id}</Text>
                  </>
                  ) : (
                    <Text style={styles.title}>正在加載訂單資料...</Text>
                )}
              </View>
      
              <View style={styles.body}>
                {order ? (
                <>
                  <Text style={styles.title}>{roleText}：{order.creator.userName}</Text>
                  <Text style={styles.title}>車種：{order.creator.info.motocycleType}</Text>
                  <Text style={styles.title}>起點：{order.startAddress}</Text>
                  <Text style={styles.title}>終點：{order.endAddress}</Text>
                  <Text style={styles.title}>描述: {order.description}</Text>
                  <Text style={styles.title}>初始價格: {order.initPrice}</Text>
                  {user.role == 1 ? (
                    <Text style={styles.title}>路徑偏差距離: {order.tolerableRDV}</Text>
                  ) : null}
                  <Text style={styles.title}>開始時間: {new Date(order.startAfter).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>結束時間: {new Date(order.endedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>更新時間: {new Date(order.updatedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <View className="justify-center items-center py-2">
                    <Pressable
                      style={{
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="rounded-[12px] shadow-lg w-full bg-green-500"
                      onPress={() => navigation.navigate('invitemap', { orderid: orderid })}
                    >
                      <Text className="font-semibold text-lg">建立邀請</Text>
                    </Pressable>
                  </View>
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
});

export default OrderDetail;