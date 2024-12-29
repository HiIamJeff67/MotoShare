import { Text, Image, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../(store)/";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import AntDesign from "@expo/vector-icons/AntDesign";
import { clearUser } from "../(store)/userSlice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { ProfileScreenStyles } from "./profile.style";
import { useState } from "react";
import { getUserTheme, ThemeType } from "@/theme";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.user);

  const [themeName, setThemeName] = useState<ThemeType>(user.theme ?? "DarkTheme");
  const styles = ProfileScreenStyles(getUserTheme(themeName));

  const listData = [
    { id: "1", icon: "shopping-cart", label: "我的訂單" },
    { id: "2", icon: "notifications", label: "消息通知", badge: 24 },
    { id: "3", icon: "person", label: "更新個人資料", page: "editprofile" },
    { id: "4", icon: "home", label: "綁定門戶", extra: "未綁定" },
    { id: "5", icon: "help", label: "幫助中心" },
    { id: "6", icon: "settings", label: "設置" },
  ];

  const renderItem = ({ item }: any) => (
    <Pressable style={styles.listItem} onPress={() => navigation.navigate(item.page as never)}>
      <View style={styles.iconContainer}>
        <AntDesign name="right" size={24} color="black" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{item.label}</Text>
        {item.extra && <Text style={styles.extra}>{item.extra}</Text>}
      </View>
      {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
    </Pressable>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: verticalScale(insets.top),
        paddingBottom: verticalScale(insets.bottom),
        paddingHorizontal: scale(20), // 設置水平間距
      }}
    >
      <View style={styles.container}>
        {/* 頭像部分 */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }} // 替換為你的頭像 URL
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.description}>加入跑子環保的第240天</Text>
        </View>

        {/* 積分和回收部分 */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>環保積分</Text>
            <Text style={styles.infoValue}>680.00</Text>
            <Text style={styles.infoHint}>積分可進行提現兌換</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>回收總量</Text>
            <Text style={styles.infoValue}>24.0 公斤</Text>
            <Text style={styles.infoHint}>感謝您為環保貢獻的力量</Text>
          </View>
        </View>

        {/* 功能列表 */}
        <FlashList data={listData} renderItem={renderItem} keyExtractor={(item) => item.id} estimatedItemSize={282} />
      </View>
    </View>
  );
};

export default Profile;
