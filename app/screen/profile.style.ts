import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const ProfileScreenStyles = (theme: Theme, insets?: EdgeInsets) => {
  const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

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
    bottomButtonContainer: {
      gap: verticalScale(8), 
    }, 
    logoutButton: {
      height: verticalScale(34), 
      borderRadius: scale(10), 
      borderWidth: scale(1), 
      borderStyle: "solid", 
      borderColor: "rgba(225, 0, 0, 1)", 
      justifyContent: "center",
      alignItems: "center", 
    }, 
    logoutText: {
      color: "red", 
      fontSize: scale(14), 
      fontWeight: _fonts.bold.fontWeight, 
    }, 
    deleteAccountButton: {
      height: verticalScale(36), 
      borderRadius: scale(10), 
      justifyContent: "center",
      alignItems: "center", 
    }, 
    deleteMeText: {
      fontSize: scale(14), 
      fontWeight: _fonts.bold.fontWeight, 
    }, 
  });
}

export const __styles = StyleSheet.create({});