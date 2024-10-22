import React, { useEffect, useState } from 'react';
import { router } from "expo-router";
import { Text, View, TouchableWithoutFeedback, StyleSheet, Pressable, TextInput, Platform, Keyboard, ScrollView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import axios from 'axios';

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  tolerableRDV: number;
  startAfter: Date;
  initPrice: number;
}

const Order = () => {
    const [orders, setOrders] = useState<OrderType[]>([]); // 設定 orders 的類型
    const [Search, setSearch] = useState('');

    const dismissKeyboard = () => {
      // 只在非 Web 平台上執行 Keyboard.dismiss()
      if (Platform.OS !== 'web') {
        Keyboard.dismiss();
      }
    };
    
    const SearchOrder = async () => {
      const response = await axios.get('https://moto-share-jeffs-projects-95ef1060.vercel.app/supplyOrder/getSupplyOrders', {
        params: {
          limit: 10,
          offset: 0,
        },
      });

      if (response)
      {
        //response.data.id
        //response.data.tolerableRDV
        //response.data.startAfter
        //response.data.initPrice
        setSearch(response.data);
        setOrders(response.data);
      }
    }

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
                  <TextInput placeholder="訂單編號" className="ml-2 flex-1" placeholderTextColor="gray" />
                </View>

                <View className="p-3 bg-gray-300 rounded-full ml-2.5">
                  <Pressable onPress={() => router.push("../orderadd")}>
                    <Feather name="plus" size={24} color="black" />
                  </Pressable>
                </View>
              </View>

                {orders.map((order, index) => (
                  <View key={order.id} style={styles.container}>
                    <Pressable 
                        key={order.id} 
                        onPress={() => router.push("../orderdetail")}
                    >
                        <View style={styles.card}>
                            <View style={styles.header}>
                                <Text style={styles.orderNumber}>訂單編號: {order.id}</Text>
                            </View>
                            <View style={styles.body}>
                              <Text style={styles.title}>起點：台灣海洋大學</Text>
                              <Text style={styles.title}>終點：基隆火車站</Text>
                              <Text style={styles.title}>路徑偏差距離: {order.tolerableRDV}</Text>
                              <Text style={styles.title}>開始時間: {order.startAfter.toLocaleString()}</Text>
                              <Text style={styles.title}>初始價格: {order.initPrice}</Text>
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
  });

export default Order;