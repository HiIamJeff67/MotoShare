import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Image,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../(store)/userSlice";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const PassengerReg = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, (event) => {
      Animated.timing(translateY, {
        toValue: -Math.min(event.endCoordinates.height / 2, 150),
        duration: Platform.OS === "ios" ? event.duration || 200 : 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, (event) => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: Platform.OS === "ios" ? event.duration || 200 : 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [translateY]);

  const handleSocialLogin = (provider: "Google" | "Apple") => {
    Alert.alert("社交登入", `您選擇了 ${provider} 登入`);
  };

  const saveToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync("userToken", token);
      console.log("Token 保存成功");
    } catch (error) {
      console.error("保存 Token 出錯:", error);
    }
  };

  const handleRegister = async () => {
    setLoading(true);

    const unsafeChars = /[<>#$%^&*()\[\]{};:'"|\`~]/g;

    if (unsafeChars.test(username) || unsafeChars.test(password)) {
      Alert.alert("錯誤", "使用者名稱或密碼包含不安全的字元", [
        { onPress: () => setLoading(false) },
      ]);
      return;
    }

    if (username === "" || password === "") {
      Alert.alert("錯誤", "請輸入使用者名稱和密碼", [
        { onPress: () => setLoading(false) },
      ]);
      return;
    }

    if (password !== conPassword) {
      Alert.alert("錯誤", "密碼不一致", [{ onPress: () => setLoading(false) }]);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/signUpPassenger`,
        {
          userName: username,
          email: email,
          password: password,
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      if (response) {
        console.log(response);
        saveToken(response.data.accessToken);
        dispatch(setUser({ username: response.data.userName, role: 1 }));
        Alert.alert("成功", `註冊成功，使用者：${username}`, [
          { onPress: () => setLoading(false) },
        ]);
        navigation.navigate("home");
      } else {
        Alert.alert("錯誤", "註冊失敗。", [
          { onPress: () => setLoading(false) },
        ]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(JSON.stringify(error.response?.data.message));
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [
          { onPress: () => setLoading(false) },
        ]);
      } else {
        console.log("An unexpected error occurred:", JSON.stringify(error));
        Alert.alert("錯誤", "無法連接到伺服器。", [
          { onPress: () => setLoading(false) },
        ]);
      }
    }
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        transform: [{ translateY }],
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: "#ffffff",
          paddingTop: verticalScale(insets.top),
          paddingBottom: verticalScale(insets.bottom),
          paddingHorizontal: scale(20), // 設置水平間距
        }}
        keyboardShouldPersistTaps="handled" // 確保使用者能點擊非鍵盤區域關閉鍵盤
      >
        {/* 根據平台條件設置 StatusBar */}
        {Platform.OS === "ios" ? (
          <StatusBar barStyle="dark-content" />
        ) : (
          <StatusBar barStyle="light-content" hidden={true} />
        )}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/motorbike.jpg")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>乘客註冊</Text>
        </View>
        <View style={styles.inputWrapper}>
          <Image
            source={require("../../../assets/images/user.png")} // 修改為你自己的圖片
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

        <View style={styles.inputWrapper}>
          <Image
            source={require("../../../assets/images/email.png")} // 修改為你自己的圖片
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            className="rounded-lg bg-[#f1f4ff]"
            placeholder="電子郵件"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Image
            source={require("../../../assets/images/password.png")} // 修改為你自己的圖片
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

        <View style={styles.inputWrapper}>
          <Image
            source={require("../../../assets/images/password.png")} // 修改為你自己的圖片
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            className="rounded-lg bg-[#f1f4ff]"
            placeholder="確認密碼"
            secureTextEntry={true}
            value={conPassword}
            onChangeText={setConPassword}
            placeholderTextColor="#626262"
          />
        </View>

        <View style={styles.centerAlign}>
          <Pressable
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading} // 按鈕在loading時不可點擊
          >
            <Text style={styles.registerButtonText}>
              {loading ? "註冊中..." : "註冊"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.centerAlign}>
          <Text style={styles.otherRegisterText}>使用其他方式</Text>
        </View>
        <View style={styles.socialContainer}>
          <TouchableWithoutFeedback onPress={() => handleSocialLogin("Google")}>
            <Image
              source={require("../../../assets/images/google.png")}
              style={styles.socialIcon}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => handleSocialLogin("Apple")}>
            <Image
              source={require("../../../assets/images/apple.png")}
              style={styles.socialIcon}
            />
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    height: "100%",
    borderWidth: scale(0),
    color: "#000",
    paddingLeft: scale(5),
  },
  icon: {
    width: scale(18),
    height: verticalScale(15),
    marginRight: scale(10),
  },
  inputWrapper: {
    marginTop: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(40),
    backgroundColor: "#f1f4ff",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(10),
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: scale(150),
    height: verticalScale(150),
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(10),
  },
  headerText: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#3498db",
  },
  centerAlign: {
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    width: "100%",
    marginTop: verticalScale(20),
    height: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
    borderRadius: moderateScale(10),
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(10),
    shadowOffset: { width: scale(0), height: verticalScale(4) },
    shadowColor: "#000",
  },
  registerButtonText: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#fff",
  },
  forgotPasswordText: {
    marginTop: verticalScale(20),
    fontSize: moderateScale(16),
  },
  otherRegisterText: {
    marginTop: verticalScale(20),
    fontSize: moderateScale(16),
    color: "#3498db",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: scale(100),
    paddingTop: verticalScale(20),
  },
  socialIcon: {
    width: scale(30),
    height: verticalScale(30),
    resizeMode: "contain",
  },
});

export default PassengerReg;
