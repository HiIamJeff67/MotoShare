import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/";
import { useNavigation } from '@react-navigation/native';

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  tolerableRDV: number;
  updatedAt: Date;
  startAddress: string;
  endAddress: string;
  creatorName: string;
}

const Order = () => {
  const user = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [searchInput, setSearchInput] = useState("");
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

  const dismissKeyboard = () => {
    // 只在非 Web 平台上執行 Keyboard.dismiss()
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  const SearchOrder = async () => {
    let response, url = "";

    if (user.role == 1) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/searchPaginationSupplyOrders`;
    } else if (user.role == 2) {
      url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/searchPaginationPurchaseOrders`;
    }

    try {
      response = await axios.get(url, {
        params: {
          creatorName: searchInput,
          limit: 10,
          offset: 0,
        },
      });

      setOrders(response.data);
      //console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  useEffect(() => {
    SearchOrder();
  }, []);

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="pt-5">
          <View className="flex-row items-center space-x-2 px-4 pb-2">
            <View className="flex-row flex-1 items-center p-3 rounded-full border border-gray-300 bg-white">
              <Feather name="search" size={24} color="black" />
              <TextInput
                placeholder="使用者"
                className="ml-2 flex-1"
                placeholderTextColor="gray"
                value={searchInput}
                onChangeText={(text) => setSearchInput(text)}
                onSubmitEditing={SearchOrder} // 按下 "Enter" 時觸發搜尋
              />
            </View>

            <View className="p-3 bg-gray-300 rounded-full ml-2.5">
              <Pressable onPress={() => {}}>
                <Feather name="plus" size={24} color="black" />
              </Pressable>
            </View>
          </View>

          {orders.map((order) => (
            <View key={order.id} style={styles.container}>
              <Pressable
                key={order.id}
                onPress={() => navigation.navigate('orderdetail', { orderid: order.id })}
              >
                <View style={styles.card}>
                  <View style={styles.header}>
                    <Text style={styles.orderNumber}>訂單編號: {order.id}</Text>
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.title}>{roleText}：{order.creatorName}</Text>
                    <Text style={styles.title}>起點：{order.startAddress}</Text>
                    <Text style={styles.title}>終點：{order.endAddress}</Text>
                    <Text style={styles.title}>更新時間: {new Date(order.updatedAt).toLocaleString('en-GB', { timeZone: "Asia/Taipei" })}</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      </TouchableWithoutFeedback>
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
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android 的陰影
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  orderNumber: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  body: {
    padding: 16,
  },
  textBase: {
    marginBottom: 10,
    fontSize: 14,
    color: "#666",
  },
  title: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});

export default Order;
