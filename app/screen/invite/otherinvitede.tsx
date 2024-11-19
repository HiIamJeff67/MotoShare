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
  const [invite, setInvite] = useState<OrderType>();
  const route = useRoute();
  const { orderid } = route.params as { orderid: string };
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

  useEffect(() => {
    // 透過 orderId 取得訂單資料
    let response, url = "";

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
      }
    }

    SearchInvite();
  }, []);

  const InviteStatus = async (decide: number) => {
    try {
        let response, url = "", decideT = "", message = "";

        if (user.role == 1) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/passenger/decideRidderInviteById`;
        } else if (user.role == 2) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/ridder/decidePassengerInviteById`;
        }
    
        if (decide == 1) {
            decideT = "ACCEPTED";
            message = "接受邀請成功";
        }
        else {
            decideT = "REJECTED";
            message = "拒絕邀請成功";
        }
        
        // 獲取 Token
        const token = await getToken();

        if (!token) {
          Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
          return;
        }

        console.log(token);

        response = await axios.post(url,
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

        //console.log(response.data);
        navigation.dispatch(
          CommonActions.reset({
            index: 1, // 設為 1，因為我們要有兩個頁面：HomeScreen 和 InvScreen
            routes: [{ name: 'home' }, { name: 'myinvite' }],
          })
        );
        Alert.alert("成功", message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message));
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤");
      }
    }
  }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View className='pt-5'/>
        <View style={styles.card}>
              <View style={styles.header}>
                {invite ? (
                  <>
                    <Text style={styles.orderNumber}>邀請編號: {invite?.id}</Text>
                  </>
                  ) : (
                    <Text style={styles.title}>正在加載訂單資料...</Text>
                )}
              </View>
      
              <View style={styles.body}>
                {invite ? (
                <>
                  <Text style={styles.maintitle}>別人推薦</Text>
                  <Text style={styles.title}>起點：{invite.suggestStartAddress}</Text>
                  <Text style={styles.title}>終點：{invite.suggestEndAddress}</Text>
                  <Text style={styles.title}>開車時間: {new Date(invite.suggestStartAfter).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>價格: {invite.suggestPrice}</Text>
                  <Text style={styles.title}>更新時間: {new Date(invite.inviteUdpatedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>備註: {invite.inviteBriefDescription}</Text>
                  <View className="justify-center items-center py-2">
                    <Pressable
                      style={{
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="rounded-[12px] shadow-lg w-full bg-green-500"
                      onPress={() => InviteStatus(1)}
                    >
                      <Text className="font-semibold text-lg">接受邀請</Text>
                    </Pressable>
                  </View>
                  <View className="justify-center items-center py-2">
                    <Pressable
                      style={{
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="rounded-[12px] shadow-lg w-full bg-green-500"
                      onPress={() => InviteStatus(2)}
                    >
                      <Text className="font-semibold text-lg">拒絕邀請</Text>
                    </Pressable>
                  </View>
                </>
                ) : (
                  <Text style={styles.title}>正在加載訂單資料...</Text>
                )}
              </View>
          </View>
          <View className="h-5"/>
          <View style={styles.card}>
              <View style={styles.body}>
                {invite ? (
                <>
                  <Text style={styles.maintitle}>原本訂單</Text>
                  <Text style={styles.title}>起點：{invite.startAddress}</Text>
                  <Text style={styles.title}>終點：{invite.endAddress}</Text>
                  <Text style={styles.title}>開車時間: {new Date(invite.startAfter).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>價格: {invite.initPrice}</Text>
                  <Text style={styles.title}>備註: {invite.description}</Text>
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
    maintitle: {
      marginBottom: 10,
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    },
});

export default OtherInviteDetail;