import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const MyCreateOrderDeStyles = (theme: Theme, insets?: EdgeInsets) => {
  const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

  return StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
      paddingHorizontal: scale(20), // 設置水平間距
      paddingTop: verticalScale(15), // 設置垂直間距
      paddingBottom: verticalScale(30), // 設置垂直間距
    },
    card: {
      backgroundColor: "white",
      borderRadius: moderateScale(10),
      shadowColor: "#000",
      shadowOffset: { width: scale(0), height: verticalScale(2) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(4),
      elevation: 5, // Android 的陰影
    },
    header: {
      borderBottomWidth: scale(2),
      borderBottomColor: "#ddd",
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(16),
    },
    orderNumber: {
      color: "#333",
      fontWeight: "bold",
      fontSize: moderateScale(16),
    },
    body: {
      padding: moderateScale(16),
    },
    title: {
      marginBottom: verticalScale(5),
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: "#333",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    searchBox: {
      height: verticalScale(40),
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      borderRadius: moderateScale(50),
      borderWidth: scale(1),
      borderColor: "gray",
      backgroundColor: "white",
      paddingHorizontal: scale(16),
    },
    searchInput: {
      marginLeft: scale(8),
      flex: 1,
      fontSize: moderateScale(20),
    },
    addButtonContainer: {
      padding: moderateScale(12),
      backgroundColor: "gray",
      borderRadius: moderateScale(50),
      marginLeft: scale(10),
    },
    inviteButton: {
      borderRadius: moderateScale(12),
      shadowColor: "#000",
      shadowOffset: { width: scale(0), height: verticalScale(2) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(4),
      backgroundColor: "#4CAF50", // green
      elevation: 5,
      height: verticalScale(40),
      justifyContent: "center",
      alignItems: "center",
    },
    inviteButtonText: {
      fontSize: moderateScale(18),
      fontWeight: "bold",
      color: "white",
    },
  });
};

export const __style = StyleSheet.create({});
