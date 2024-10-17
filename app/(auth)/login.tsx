import React, { useState } from 'react';
import { router } from "expo-router";
import { TextInput, Text, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === '' || password === '') {
      Alert.alert('錯誤', '請輸入使用者名稱和密碼');
    } else {
      // 這裡可以處理登入邏輯，例如呼叫API
      Alert.alert('成功', `登入成功，使用者：${username}`);
      router.push("../(root)/(tabs)/home");
    }
  };

  const dismissKeyboard = () => {
    // 只在非 Web 平台上執行 Keyboard.dismiss()
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
        />
        
        <TextInput
          style={styles.input}
          placeholder="密碼"
          secureTextEntry={true} // 隱藏密碼
          value={password}
          onChangeText={setPassword}
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

export default LoginPage;
