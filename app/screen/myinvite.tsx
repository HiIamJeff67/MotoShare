import { Text, View, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "../(store)/index";
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  description: string;
  startAfter: Date;
  initPrice: number;
  suggestPrice: number;
  startAddress: string;
  endAddress: string;
  updatedAt: Date;
  suggestStartAfter: Date;
  endedAt: Date;
}

const MyInvite = () => {
  const user = useSelector((state: RootState) => state.user);
  const [invites, setInvites] = useState<OrderType[]>([]);
  const navigation = useNavigation();
  let roleText = "載入中...";

  if (user.role == 1)
  {
    roleText = "乘客";
  }
  else if (user.role == 2)
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
    // 透過 orderId 取得訂單資料
    let response, url = "";

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
    }

    SearchOrder();
  }, []);

  return (
    <ScrollView>
        <View className='pt-5'/>

        {invites.map((invite) => (
          <View key={invite.id} style={styles.container}>
            <Pressable
              key={invite.id}
              onPress={() => navigation.navigate('myinvitede', { orderid: invite.id })}
            >
              <View style={styles.card}>
                  <View style={styles.header}>
                    <Text style={styles.orderNumber}>訂單編號: {invite.id}</Text>
                  </View>
          
                  <View style={styles.body}>
                    <Text style={styles.title}>起點：{invite.startAddress}</Text>
                    <Text style={styles.title}>終點：{invite.endAddress}</Text>
                    <Text style={styles.title}>初始價格: {invite.initPrice}</Text>
                    <Text style={styles.title}>推薦價格: {invite.suggestPrice}</Text>
                    <Text style={styles.title}>開始時間: {new Date(invite.startAfter).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                    <Text style={styles.title}>推薦開始時間: {new Date(invite.suggestStartAfter).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                    <Text style={styles.title}>結束時間: {new Date(invite.endedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                    <Text style={styles.title}>更新時間: {new Date(invite.updatedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  </View>
              </View>
            </Pressable>
          </View>
        ))}
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

export default MyInvite;