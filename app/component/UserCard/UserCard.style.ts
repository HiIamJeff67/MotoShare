import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const UserCardStyles = (theme: Theme, insets?: EdgeInsets) => {
  const [_colors, _fonts] = [theme.colors, theme.fonts];

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: verticalScale(15),
    },
    card: {
      marginBottom: verticalScale(15),
      borderWidth: moderateScale(1.5), 
      borderColor: _colors.border, 
      backgroundColor: _colors.card, 
      borderRadius: moderateScale(10),
      shadowColor: "#000", 
      shadowOffset: { width: scale(0), height: verticalScale(2) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(4),
      elevation: 5,
    },
    photoContainer: {
      marginTop: verticalScale(20),
      marginBottom: verticalScale(15),
      alignItems: "center",
      justifyContent: "center",
      width: '100%',
      height: moderateScale(120),
    },
    avatar: {
      width: 100,
      height: 100,
      marginBottom: moderateScale(8),
      borderWidth: moderateScale(0.5), 
      borderColor: _colors.border, 
      borderRadius: "50%", 
      tintColor: _colors.text, 
      padding: moderateScale(4), 
    },
    motoPhoto: {
      width: 300,
      height: 300,
    },
    body: {
      padding: moderateScale(16),
    },
    body2: {
      padding: moderateScale(16),
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      marginBottom: verticalScale(5),
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: _colors.text, 
    },
    title2: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: verticalScale(5),
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: _colors.text, 
    },
    button: {
      marginTop: verticalScale(10),
      height: verticalScale(40),
      backgroundColor: _colors.background, 
      borderRadius: scale(5),
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: _colors.text, 
      fontSize: moderateScale(16),
      fontWeight: "bold",
    },
  });
};

export const __styles = StyleSheet.create({});