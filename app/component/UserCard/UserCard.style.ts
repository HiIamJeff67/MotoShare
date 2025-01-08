import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const Styles = (theme: Theme) => {
  const [_colors, _fonts] = [theme.colors, theme.fonts];

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: verticalScale(15),
    },
    card: {
      marginBottom: verticalScale(15),
      backgroundColor: "white",
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
    body2: {
      padding: moderateScale(16),
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      marginBottom: verticalScale(5),
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: "#333",
    },
    title2: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: verticalScale(5),
      fontSize: moderateScale(15),
      fontWeight: "600",
      color: "#333",
    },
    button: {
      marginTop: verticalScale(10),
      height: verticalScale(40),
      backgroundColor: "#000",
      borderRadius: scale(5),
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: moderateScale(16),
      fontWeight: "bold",
    },
  });
};