import { Text, View, StyleSheet, ScrollView, Alert, Pressable, Modal, TextInput } from 'react-native';
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
  const [inputValue, setInputValue] = useState('');
  const [inputText, setInputText] = useState('');
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
      }
    }

    SearchOrder();
  }, []);

  const SendRate = async () => {
    try {
        let response, url = "";

        if (user.role == 1) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/history/passenger/rateAndCommentHistoryById`;
        } else if (user.role == 2) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/history/ridder/rateAndCommentHistoryById`;
        }
        
        // 獲取 Token
        const token = await getToken();
        
        if (!token) {
          Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
          return;
        }

        response = await axios.post(url,
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
        navigation.dispatch(
          CommonActions.reset({
            index: 1, // 設為 1，因為我們要有兩個頁面：HomeScreen 和 InvScreen
            routes: [{ name: 'home' }, { name: 'myorder' }],
          })
        );
        Alert.alert("成功", "評分成功");
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
                {order ? (
                  <>
                    <Text style={styles.orderNumber}>歷史編號: {order?.id}</Text>
                  </>
                  ) : (
                    <Text style={styles.title}>正在加載歷史資料...</Text>
                )}
              </View>
              
              <View style={styles.body}>
                {order ? (
                <>
                  <Text style={styles.title}>{roleText}：{user.role == 1 ? order.ridderName : order.passengerName}</Text>
                  <Text style={styles.title}>起點：{order.finalStartAddress}</Text>
                  <Text style={styles.title}>終點：{order.finalEndAddress}</Text>
                  <Text style={styles.title}>開始時間: {new Date(order.startAfter).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  <Text style={styles.title}>最終價格: {order.finalPrice}</Text>
                  <Text style={styles.title}>最後更新: {new Date(order.updatedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  {(user.role == 1 && order.starRatingByPassenger == 0) || (user.role == 2 && order.starRatingByRidder == 0) ? ( 
                    <View className="justify-center items-center py-2">
                    <Pressable
                      style={{
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="rounded-[12px] shadow-lg w-full bg-green-500"
                      onPress={() => setModalVisible(true)}
                    >
                      <Text className="font-semibold text-lg">評分</Text>
                    </Pressable>
                  </View>
                  ) : null }
                </>
                ) : (
                  <Text style={styles.title}>正在加載歷史資料...</Text>
                )}
              </View>
          </View>
          {order ? (
            <>
            <View className="h-5"/>
            {(user.role == 1 && order.starRatingByRidder > 0) || (user.role == 2 && order.starRatingByPassenger > 0) ? (
              <View style={styles.card}>
                <View style={styles.body}>
                  <Text style={styles.title}>對方給你的評分：{user.role == 1 ? order?.starRatingByRidder : order?.starRatingByPassenger}</Text>
                  <Text style={styles.title}>對方給你的留言：{user.role == 1 ? order?.commentByRidder : order?.commentByPassenger}</Text>
                </View>
              </View>
            ) : null}
            </>
          ) : null }
          {/* 彈出窗口 */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
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
                <View style={{ flexDirection: 'row' }}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>返回</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      SendRate();
                    }}>
                    <Text style={styles.textStyle}>確認</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
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

export default MyOrderHistoryDetail;