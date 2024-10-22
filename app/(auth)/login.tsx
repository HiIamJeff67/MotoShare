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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../(store)/userSlice';

const LoginForm = () => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  
  const handleLogin = () => {
    if (username === '' || password === '') {
      Alert.alert('錯誤', '請輸入使用者名稱和密碼');
    } else {
      axios
        .post(
          'https://moto-share-jeffs-projects-95ef1060.vercel.app/passenger/signInPassengerByEamilAndPassword',
          {
            email: username,
            password: password,
          },
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          }
        )
        .then((response) => {
          if (response && response.data[0].email == username) {
            dispatch(setUser({ id: response.data[0].id, username: response.data[0].userName, role: '乘客' }));
            Alert.alert('成功', `登入成功，使用者：${username}`);
            router.push('../(root)/(tabs)/home');
          }
        })
        .catch((error) => {
          Alert.alert('錯誤', '登入失敗，請檢查您的使用者名稱和密碼。');
          console.log(error);
        });
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
          <Text style={styles.title}>登入</Text>

          <TextInput
            style={styles.input}
            placeholder="使用者名稱"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.input}
            placeholder="密碼"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="gray"
          />

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>登入</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
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
