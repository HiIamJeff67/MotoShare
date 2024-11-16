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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../(store)/userSlice';
import * as SecureStore from 'expo-secure-store';

const LoginForm = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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

    if (password !== conPassword) {
      Alert.alert('錯誤', '密碼不一致', [{ onPress: () => setLoading(false) }]);
      return;
    }
    
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/signUpPassenger`,
        {
          userName: username,
          email: email,
          password: password
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      
      if (response) {
        console.log(response);
        saveToken(response.data.accessToken);
        dispatch(setUser({ username: response.data.userName, role: 1 }));
        Alert.alert('成功', `註冊成功，使用者：${username}`, [{ onPress: () => setLoading(false) }]);
        navigation.navigate('home');
      } else {
        Alert.alert('錯誤', '註冊失敗。', [{ onPress: () => setLoading(false) }]);
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
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <View className="h-10"/>
        <View className="justify-center items-center">
          <Text className="text-4xl p-5 font-bold text-[#3498db]">乘客註冊</Text>
        </View>
        <View className="h-10"/>
        <TextInput
          style={styles.input}
          className="rounded-lg bg-[#f1f4ff]"
          placeholder="使用者名稱"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#626262"
        />
        <View className="h-1"/>
        <TextInput
          style={styles.input}
          className="rounded-lg bg-[#f1f4ff]"
          placeholder="電子郵件"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#626262"
        />
        <View className="h-1"/>
        <TextInput
          style={styles.input}
          className="rounded-lg bg-[#f1f4ff]"
          placeholder="密碼"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#626262"
        />
        <TextInput
          style={styles.input}
          className="rounded-lg bg-[#f1f4ff]"
          placeholder="確認密碼"
          secureTextEntry={true}
          value={conPassword}
          onChangeText={setConPassword}
          placeholderTextColor="#626262"
        />

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
              {loading ? '註冊中...' : '註冊'}
            </Text>
            </Pressable>
        </View>
        <View className="h-1"/>
        <View className="justify-center items-center">
          <Text className="text-xl p-5 text-[#3498db]">使用其他方式</Text>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
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
});

export default LoginForm;
