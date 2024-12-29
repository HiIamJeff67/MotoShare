import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const ProfileScreenStyles = (theme: Theme, insets?: EdgeInsets) => {
  const [_colors, _fonts] = [theme.colors, theme.fonts];

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    profileHeader: {
      alignItems: "center",
      marginBottom: moderateScale(16),
    },
    avatar: {
      width: moderateScale(80),
      height: moderateScale(80),
      borderRadius: moderateScale(40),
      marginBottom: moderateScale(8),
    },
    name: {
      fontSize: moderateScale(18),
      fontWeight: "bold",
      color: "#333",
    },
    description: {
      fontSize: moderateScale(12),
      color: "#999",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: moderateScale(16),
    },
    infoBox: {
      flex: 1,
      alignItems: "center",
      marginHorizontal: scale(8),
      backgroundColor: "#f5f5f5",
      padding: moderateScale(12),
      borderRadius: moderateScale(8),
    },
    infoTitle: {
      fontSize: moderateScale(14),
      color: "#666",
    },
    infoValue: {
      fontSize: moderateScale(18),
      fontWeight: "bold",
      color: "#333",
      marginVertical: verticalScale(4),
    },
    infoHint: {
      fontSize: moderateScale(10),
      color: "#999",
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: verticalScale(12),
      borderBottomWidth: scale(1),
      borderBottomColor: "#eee",
    },
    iconContainer: {
      width: moderateScale(40),
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      flex: 1,
      marginLeft: scale(8),
    },
    label: {
      fontSize: moderateScale(14),
      color: "#333",
    },
    extra: {
      fontSize: moderateScale(12),
      color: "#999",
    },
    badge: {
      backgroundColor: "red",
      color: "#fff",
      fontSize: moderateScale(12),
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(2),
      borderRadius: moderateScale(8),
      overflow: "hidden",
    },
  });
}

export const __styles = StyleSheet.create({

});