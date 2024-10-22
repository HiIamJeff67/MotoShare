import { Text, View, StyleSheet, ScrollView, Pressable, TextInput, Switch, Alert, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../(store)/index';

const OrderAdd = () => {
  const [initialPrice, setinitialPrice] = useState('');
  const [startPosition, setstartPosition] = useState('');
  const [endPosition, setendPosition] = useState('');
  const [startTime, setstartTime] = useState('');
  const [orderDescription, setorderDescription] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const user = useSelector((state: RootState) => state.user);

  const Check = () => {
    const startCord = startPosition.replace(' ', '').split(',');
    const endCord = endPosition.replace(' ', '').split(',');

    axios
      .post(
        `https://moto-share-jeffs-projects-95ef1060.vercel.app/purchaseOrder/createPurchaseOrderByCreatorId?id=${user.id}`,
        {
            description: orderDescription,
            initPrice: initialPrice,
            startCordLongitude: startCord[0],
            startCordLatitude: startCord[1],
            endCordLongitude: endCord[0],
            endCordLatitude: endCord[1],
            isUrgent: isEnabled,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      )
      .then((response) => {
        if (response && response.data) {
          Alert.alert('成功', '成功送出。');
        }
        else
        {
          Alert.alert('錯誤', '無法送出。');
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('錯誤', '無法送出。');
      });
  };
  
  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeAreaView style={styles.container}>
            <View style={styles.card} className='py-10'>
                <View style={styles.body}>
                    <TextInput
                      style={styles.input}
                      placeholder="初始價格"
                      value={initialPrice}
                      onChangeText={setinitialPrice}
                      placeholderTextColor="gray"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="開始位置"
                      value={startPosition}
                      onChangeText={setstartPosition}
                      placeholderTextColor="gray"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="結束位置"
                      value={endPosition}
                      onChangeText={setendPosition}
                      placeholderTextColor="gray"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="開始時間"
                      value={startTime}
                      onChangeText={setstartTime}
                      placeholderTextColor="gray"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="訂單描述"
                      value={orderDescription}
                      onChangeText={setorderDescription}
                      placeholderTextColor="gray"
                    />

                    <View className="justify-center items-center flex-row">
                      <Text className="font-semibold text-l">沒有很急</Text>
                        <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                        />
                      <Text className="font-semibold text-l">拜託！我快遲到了！</Text>
                    </View>
                </View>
            </View>

            <View className="h-5"></View>

            <View className="justify-center items-center py-2">
                <Pressable 
                    style={{ 
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    className="rounded-[12px] bg-white shadow-lg w-full bg-green-500"
                    onPress={() => Check()}
                >
                <Text className="font-semibold text-lg">送出訂單</Text>
                </Pressable>
            </View>

          </SafeAreaView>
        </TouchableWithoutFeedback>
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
    marginBottom: 15,
    fontSize: 14,
    color: '#666',
  },
  title: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default OrderAdd;