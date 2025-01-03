import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../(store)/";
import { useNavigation, useTheme } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { scale, verticalScale } from "react-native-size-matters";
import { Theme } from "../../theme/theme";
import { styles } from "./service.style";

const Service = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const { colors } = theme;

  return (
    <View
      style={{
        flex: 1,
        paddingTop: verticalScale(insets.top),
        paddingBottom: verticalScale(insets.bottom),
        paddingHorizontal: scale(20), // 設置水平間距
      }}
    >
      <Text style={{ ...styles.MainText, color: colors.text }}>服務</Text>

      <View style={{ marginTop: verticalScale(20) }} className="flex flex-row justify-between items-center">
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("map" as never)}>
          <View className="items-center">
            <FontAwesome6 name="motorcycle" size={24} color="black" />
            <Text style={{ marginTop: verticalScale(5) }}>建立訂單</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("order" as never)}>
          <View className="items-center">
            <FontAwesome6 name="list" size={24} color="black" />
            <Text style={{ marginTop: verticalScale(5) }}>查看訂單</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myinvite" as never)}>
          <View className="items-center">
            <Ionicons name="people" size={24} color="black" />
            <Text style={{ marginTop: verticalScale(5) }}>查看邀請</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("myorder" as never)}>
          <View className="items-center">
            <FontAwesome6 name="edit" size={24} color="black" />
            <Text style={{ marginTop: verticalScale(5) }}>訂單管理</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: verticalScale(20) }} className="flex flex-row justify-between items-center">
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("usersearch" as never)}>
          <View className="items-center">
            <FontAwesome6 name="motorcycle" size={24} color="black" />
            <Text style={{ marginTop: verticalScale(5) }}>搜尋用戶</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Service;
