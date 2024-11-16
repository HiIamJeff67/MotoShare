import { Text, View, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "../(store)/index";
import * as SecureStore from 'expo-secure-store';
import { useRoute } from '@react-navigation/native';

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
  orderUpdatedAt: Date;
  endedAt: Date;
}

const MyInviteDetail = () => {
  const user = useSelector((state: RootState) => state.user);
  const [invite, setInvite] = useState<OrderType>();
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };

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
      url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/passenger/getMyPassengerInviteById`;
    } else if (user.role == 2) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/ridder/getMyRidderInviteById`;
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
          //console.log(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        } else {
          console.log("An unexpected error occurred:", error);
        }
      }
    }

    SearchInvite();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View className='pt-5'/>
          <View style={styles.card}>
              <View style={styles.header}>
                {invite ? (
                  <>
                    <Text style={styles.orderNumber}>訂單編號: {invite?.id}</Text>
                  </>
                  ) : (
                    <Text style={styles.title}>正在加載訂單資料...</Text>
                )}
              </View>
      
              <View style={styles.body}>
                {invite ? (
                <>
                  <Text style={styles.title}>起點：{invite.startAddress}</Text>
                  <Text style={styles.title}>終點：{invite.endAddress}</Text>
                  <Text style={styles.title}>描述: {invite.description}</Text>
                  <Text style={styles.title}>初始價格: {invite.initPrice}</Text>
                  <Text style={styles.title}>開始時間: {new Date(invite.startAfter).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>結束時間: {new Date(invite.endedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>更新時間: {new Date(invite.orderUpdatedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
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

export default MyInviteDetail;