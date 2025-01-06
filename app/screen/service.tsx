import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../(store)";
import { useNavigation, useTheme } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { scale, verticalScale } from "react-native-size-matters";
import { Theme } from "../../theme/theme";
import { useTranslation } from "react-i18next";

const Service = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const { colors } = theme;
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: verticalScale(insets.top),
        paddingBottom: verticalScale(insets.bottom),
        paddingHorizontal: scale(16), // 調整水平間距
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ ...styles.mainText, color: colors.text }}>{t("service")}</Text>

      {/* 第一行卡片 */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("map" as never)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <FontAwesome6 name="motorcycle" size={scale(30)} color={colors.primary} />
            <Text style={[styles.cardText, { color: colors.text }]}>{t("make an order")}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("order" as never)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <FontAwesome6 name="list" size={scale(30)} color={colors.primary} />
            <Text style={[styles.cardText, { color: colors.text }]}>{t("check order")}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 第二行卡片 */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("myinvite" as never)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <Ionicons name="people" size={scale(30)} color={colors.primary} />
            <Text style={[styles.cardText, { color: colors.text }]}>{t("invite details")}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("myorder" as never)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <FontAwesome6 name="edit" size={scale(30)} color={colors.primary} />
            <Text style={[styles.cardText, { color: colors.text }]}>{t("order manage")}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 第三行卡片 */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("usersearch" as never)}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <FontAwesome6 name="magnifying-glass" size={scale(30)} color={colors.primary} />
            <Text style={[styles.cardText, { color: colors.text }]}>{t("Search User")}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainText: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(16), // 卡片行之間的間距
  },
  card: {
    width: "48%", // 卡片寬度為父容器的一半，減去間距
    height: verticalScale(120),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 }, // 陰影向下延伸更多
    shadowOpacity: 1, // 增加陰影透明度
    shadowRadius: 10, // 增加陰影模糊半徑
    elevation: 10, // Android 陰影效果
  },
  cardContent: {
    alignItems: "center",
  },
  cardText: {
    marginTop: verticalScale(10),
    fontSize: scale(14),
    fontWeight: "500",
  },
});

export default Service;