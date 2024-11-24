import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
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
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

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
        <View style={{
            flex: 1,
            paddingHorizontal: scale(20), // 設置水平間距
            paddingVertical: verticalScale(15), // 設置垂直間距
        }}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Feather name="search" size={moderateScale(24)} color="black" />
              <TextInput
                placeholder="使用者"
                style={styles.searchInput}
                placeholderTextColor="gray"
                value={searchInput}
                onChangeText={(text) => setSearchInput(text)}
                onSubmitEditing={SearchOrder} // 按下 "Enter" 時觸發搜尋
              />
            </View>

            <View style={styles.addButtonContainer}>
              <Pressable onPress={() => {}}>
                <Feather name="plus" size={moderateScale(24)} color="black" />
              </Pressable>
            </View>
          </View>

          <View style={{ paddingTop: verticalScale(15) }} />

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

const styles = ScaledSheet.create({
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderRadius: moderateScale(50),
    borderWidth: scale(1),
    borderColor: 'gray',
    backgroundColor: 'white',
    paddingHorizontal: scale(16),
    height: verticalScale(40),
  },
  searchInput: {
    marginLeft: scale(8),
    flex: 1,
    fontSize: moderateScale(15),
  },
  addButtonContainer: {
    padding: moderateScale(10),
    backgroundColor: 'gray',
    borderRadius: moderateScale(50),
    marginLeft: scale(10),
  },
});

export default Order;