import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const UserDetailStyles = (theme: Theme) => {
  const [_colors, _fonts] = [theme.colors, theme.fonts];

  return StyleSheet.create({
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.3)", 
      position: "absolute", 
      width: "100%", 
      height: "100%", 
      zIndex: 500, 
    }, 
    container: {
      position: "relative", 
      width: "100%", 
      height: "60%", 
      left: 0, 
      paddingHorizontal: scale(12), 
      paddingVertical: verticalScale(36), 
    },
    card: {
      marginBottom: verticalScale(15),
      backgroundColor: _colors.card,
      borderRadius: moderateScale(10),
      shadowColor: "#000",
      shadowOffset: { width: scale(0), height: verticalScale(2) },
      shadowOpacity: 0.2,
      shadowRadius: moderateScale(4),
      width: "100%", 
      height: "100%", 
      elevation: 5,
      zIndex: 1200,
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
      borderRadius: moderateScale(40),
      marginBottom: moderateScale(8),
    },
    motoPhoto: {
      width: 300,
      height: 300,
    },
    body: {
      padding: moderateScale(16),
    },
    title: {
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
  });
};

export const __styles = StyleSheet.create({});