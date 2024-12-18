import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../(store)/";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import React, { useEffect, useState } from "react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  let roleText = "載入中...";

  if (user.role == 1) {
    roleText = "乘客";
  } else if (user.role == 2) {
    roleText = "車主";
  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // 當所有互動完成後更新狀態
      setIsLoading(false);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            paddingTop: verticalScale(insets.top),
            paddingBottom: verticalScale(insets.bottom),
            paddingHorizontal: scale(20), // 設置水平間距
          }}
        >
          <Text style={styles.welcomeText}>
            歡迎{roleText}, {user.username}
          </Text>

          <TouchableWithoutFeedback onPress={() => navigation.navigate("map")}>
            <View style={styles.inputWrapper}>
              <Image source={require("../../assets/images/search.png")} style={styles.icon} />
              <TextInput style={styles.textInput} placeholder="要去哪裡？" placeholderTextColor="#000000" editable={false}/>
            </View>
          </TouchableWithoutFeedback>

          <Text style={styles.MainText}>建議</Text>
          <View style={{ marginTop: verticalScale(20) }} className="flex flex-row justify-between items-center">
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("map")}>
              <View className="items-center">
                <FontAwesome6 name="motorcycle" size={moderateScale(24)} color="black" />
                <Text style={{ marginTop: verticalScale(5) }}>建立訂單</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("order")}>
              <View className="items-center">
                <FontAwesome6 name="list" size={moderateScale(24)} color="black" />
                <Text style={{ marginTop: verticalScale(5) }}>查看訂單</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myinvite")}>
              <View className="items-center">
                <Ionicons name="people" size={moderateScale(24)} color="black" />
                <Text style={{ marginTop: verticalScale(5) }}>查看邀請</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myorder")}>
              <View className="items-center">
                <FontAwesome6 name="edit" size={moderateScale(24)} color="black" />
                <Text style={{ marginTop: verticalScale(5) }}>訂單管理</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1, // 使輸入框填滿剩餘空間
    color: "#000", // 文字顏色
  },
  inputWrapper: {
    flexDirection: "row", // 讓圖標和輸入框水平排列
    alignItems: "center", // 垂直居中
    height: verticalScale(40),
    backgroundColor: "#e3e1e1", // 背景色
    borderRadius: moderateScale(50), // 圓角
    paddingHorizontal: scale(20), // 左右內邊距
    borderColor: "#0000000",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  welcomeText: {
    fontSize: moderateScale(25),
    fontWeight: "bold",
  },
  icon: {
    width: scale(22),
    height: verticalScale(20),
    marginRight: scale(10), // 圖標與文字之間的距離
  },
  MainText: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
  },
  card: {
    width: scale(70),
    height: verticalScale(60),
    backgroundColor: "white",
    borderRadius: moderateScale(10),
    shadowColor: "black",
    shadowOffset: {
      width: scale(0),
      height: verticalScale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(3.84),
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
});

export default Home;
