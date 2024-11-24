import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../(store)/";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const Service = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: verticalScale(insets.top),
        paddingBottom: verticalScale(insets.bottom),
        paddingHorizontal: scale(20), // 設置水平間距
        paddingVertical: verticalScale(20), // 設置垂直間距
      }}
    >
      <Text style={styles.MainText}>服務</Text>
      <View
        style={{ marginTop: verticalScale(20) }}
        className="flex flex-row justify-between items-center"
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("map")}
        >
          <View className="items-center">
            <FontAwesome6 name="motorcycle" size={24} color="black" />
            <Text style={{ marginTop: 5 }}>建立訂單</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("order")}
        >
          <View className="items-center">
            <FontAwesome6 name="list" size={24} color="black" />
            <Text style={{ marginTop: 5 }}>查看訂單</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("myinvite")}
        >
          <View className="items-center">
            <Ionicons name="people" size={24} color="black" />
            <Text style={{ marginTop: 5 }}>查看邀請</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("myorder")}
        >
          <View className="items-center">
            <FontAwesome6 name="edit" size={24} color="black" />
            <Text style={{ marginTop: 5 }}>訂單管理</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  MainText: {
    fontSize: moderateScale(25),
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

export default Service;
