import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../(store)/userSlice';
import * as SecureStore from 'expo-secure-store';

const RidderLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    Alert.alert('社交登入', `您選擇了 ${provider} 登入`);
  };
  
  const saveToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync('userToken', token);
      console.log('Token 保存成功');
    } catch (error) {
      console.error('保存 Token 出錯:', error);
    }
  };
  
  const handleLogin = async () => {
    setLoading(true);

    const unsafeChars = /[<>#$%^&*()\[\]{};:'"|\`~]/g;

    if (unsafeChars.test(username) || unsafeChars.test(password)) {
      Alert.alert('錯誤', '使用者名稱或密碼包含不安全的字元', [{ onPress: () => setLoading(false) }]);
      return;
    }

    if (username === '' || password === '') {
      Alert.alert('錯誤', '請輸入使用者名稱和密碼', [{ onPress: () => setLoading(false) }]);
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/signInRidder`,
        {
          userName: username,
          password: password,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      
      if (response && response.data) {
        saveToken(response.data.accessToken);
        dispatch(setUser({ username: username, role: 2 }));
        Alert.alert('成功', `登入成功，使用者：${username}`, [{ onPress: () => setLoading(false) }]);
        navigation.navigate('home');
      } else {
        Alert.alert('錯誤', '登入失敗，請檢查您的使用者名稱和密碼。', [{ onPress: () => setLoading(false) }]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(JSON.stringify(error.response?.data.message));
        Alert.alert('錯誤', JSON.stringify(error.response?.data.message), [{ onPress: () => setLoading(false) }]);
      } else {
        console.log('An unexpected error occurred:', JSON.stringify(error));
        Alert.alert('錯誤', '無法連接到伺服器。', [{ onPress: () => setLoading(false) }]);
      }
    }
  };

  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <View className="h-10"/>
        <View className="flex-0 justify-start items-center">
          <Image
            source={require('../../assets/images/motorbike.jpg')}
            className="w-64 h-64 "
            resizeMode="contain"
          />
        </View>
        <View className="justify-center items-center">
          <Text className="text-4xl p-5 font-bold text-[#3498db]">車主登入</Text>
        </View>

        <View className="h-5"/>
        <View style={styles.inputWrapper}>
          <Image 
            source={require('../../assets/images/user.png')}  // 修改為你自己的圖片
            style={styles.icon} 
          />
          <TextInput           
            style={styles.textInput}
            className="rounded-lg bg-[#f1f4ff]"
            placeholder="使用者名稱"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#626262"
          />
        </View>

        <View className="h-1"/>
        <View style={styles.inputWrapper}>
        <Image 
            source={require('../../assets/images/password.png')}  // 修改為你自己的圖片
            style={styles.icon} 
          />
        <TextInput
          style={styles.textInput}
          className="rounded-lg bg-[#f1f4ff]"
          placeholder="密碼"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#626262"
        />
        </View>

        <View className="justify-center items-center">
            <Pressable 
                style={{ 
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className="rounded-lg bg-[#3498db] shadow-2xl shadow-sky-400 w-full"
                onPress={handleLogin}
                disabled={loading} // 按鈕在loading時不可點擊
            >
            <Text className="font-bold text-white text-lg">
              {loading ? '登入中...' : '登入'}
            </Text>
            </Pressable>
        </View>
        <View className="h-1"/>
        <View className="justify-center items-center">
          <Text className="text-xl p-5">忘記密碼?</Text>
        </View>
        <View className="justify-center items-center">
          <Text className="text-xl p-5 text-[#3498db]">使用其他方式</Text>
        </View>
        <View style={styles.socialContainer}>
        <TouchableWithoutFeedback onPress={() => handleSocialLogin('Google')}>
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.socialIcon}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => handleSocialLogin('Apple')}>
          <Image
            source={require('../../assets/images/apple.png')}
            style={styles.socialIcon}
          />
        </TouchableWithoutFeedback>
      </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
    </TouchableWithoutFeedback>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: 'hidden',
  },
  textInput: {
    flex: 1, // 使輸入框填滿剩餘空間
    height: '100%', // 確保輸入框高度和容器一致
    borderWidth: 0,
    color: '#000', // 文字顏色
    paddingLeft: 5, // 防止文字貼邊
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10, // 圖標與文字之間的距離
  },
  inputWrapper: {
    flexDirection: 'row', // 讓圖標和輸入框水平排列
    alignItems: 'center', // 垂直居中
    height: 50,
    backgroundColor: '#f1f4ff', // 背景色
    borderRadius: 10, // 圓角
    paddingHorizontal: 10, // 左右內邊距
    marginBottom: 20,
  },
  outerContainer:{
    flex: 1,
    backgroundColor: '#000000', // 設為黑色背景
  },
  input: {
    height: 50,
    borderWidth: 0,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ee',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 改為 `space-between` 可以避免按鈕重疊
    alignItems: 'center', // 確保按鈕垂直居中
    width: '100%', // 設為 `100%` 以確保按鈕不會超出屏幕
    paddingHorizontal: 130, // 添加水平內邊距，避免按鈕貼邊
    paddingTop: 10,
  },

  socialIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default RidderLogin;
