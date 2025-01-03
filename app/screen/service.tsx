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
import { useTranslation } from 'react-i18next';

const Service = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const { colors } = theme;
  const {t} = useTranslation();

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
      <Text style={{...styles.MainText, color: colors.text}}>{t("service")}</Text>
      <View
        style={{ marginTop: verticalScale(20) }}
        className="flex flex-row justify-between items-center"
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("map" as never)}
        >
          <View className="items-center">
            <FontAwesome6 name="motorcycle" size={24} color="black" />
            <Text style={{ marginTop: 5 }}>{t("make an order")}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("order" as never)}
        >
          <View className="items-center">
            <FontAwesome6 name="list" size={24} color="black" />
            <Text style={{ marginTop: 5 }}>{t("check order")}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("myinvite" as never)}
        >
          <View className="items-center">
            <Ionicons name="people" size={24} color="black" />
            <Text style={{ marginTop: 5 }}>{t("invite details")}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("myorder" as never)}
        >
          <View className="items-center">
            <FontAwesome6 name="edit" size={24} color="black" />
            <Text style={{ marginTop: 5 }}>{t("order manage")}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Service;
