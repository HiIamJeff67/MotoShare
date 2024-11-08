import React, { useState } from 'react';
import { router } from "expo-router";
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

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
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
        'https://moto-share-jeffs-projects-95ef1060.vercel.app/ridder/signInRidderByEamilAndPassword ',
        {
          email: username,
          password: password,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      
      if (response && response.data[0].email === username) {
        dispatch(setUser({ id: response.data[0].id, username: response.data[0].userName, role: 2 }));
        Alert.alert('成功', `登入成功，使用者：${username}`, [{ onPress: () => setLoading(false) }]);
        router.push('../(root)/(tabs)/home');
      } else {
        Alert.alert('錯誤', '登入失敗，請檢查您的使用者名稱和密碼。', [{ onPress: () => setLoading(false) }]);
      }
    } catch (error) {
      Alert.alert('錯誤', '無法連接到伺服器。', [{ onPress: () => setLoading(false) }]);
      console.log(error);
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
          <Text className="text-4xl p-5 font-bold text-[#3498db]">車主登入</Text>
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
          placeholder="密碼"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
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
