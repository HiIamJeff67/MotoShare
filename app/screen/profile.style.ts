import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const ProfileScreenStyles = (theme: Theme, insets?: EdgeInsets) => {
  const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

  return StyleSheet.create({
    container: {
      flex: 1,
      ...(insets && {
        paddingBottom: verticalScale(insets.bottom),
      }),
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
      fontWeight: _fonts.bold.fontWeight,
      color: _colors.text,
    },
    description: {
      fontSize: moderateScale(12),
      color: _isDark ? "#777777" : "#999999",
      fontWeight: _fonts.regular.fontWeight, 
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
      backgroundColor: _colors.card,
      padding: moderateScale(12),
      borderRadius: moderateScale(8),
    },
    infoTitle: {
      fontSize: moderateScale(14),
      color: _colors.text,
      fontWeight: _fonts.medium.fontWeight, 
    },
    infoValue: {
      fontSize: moderateScale(18),
      fontWeight: _fonts.bold.fontWeight, 
      color: _colors.text,
      marginVertical: verticalScale(4),
    },
    infoHint: {
      fontSize: moderateScale(10),
      color: "#999",
      fontWeight: _fonts.regular.fontWeight, 
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: verticalScale(12),
      borderBottomWidth: scale(1),
      borderBottomColor: _colors.border,
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
      color: _colors.text,
      fontWeight: _fonts.bold.fontWeight, 
    },
    extra: {
      fontSize: moderateScale(12),
      color: _isDark ? "#777777" : "#999999",
      fontWeight: _fonts.heavy.fontWeight, 
    },
    badge: {
      backgroundColor: _colors.notification,
      color: _colors.text,
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