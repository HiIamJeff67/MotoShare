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
      color: "#333",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: verticalScale(15),
    },
    searchBox: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      borderRadius: moderateScale(50),
      borderWidth: scale(1),
      borderColor: "gray",
      backgroundColor: "white",
      paddingHorizontal: scale(16),
      height: verticalScale(40),
    },
    searchInput: {
      marginLeft: scale(8),
      flex: 1,
      fontSize: moderateScale(15),
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
