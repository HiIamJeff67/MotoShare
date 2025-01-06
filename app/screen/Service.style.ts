import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    MainText: {
      fontSize: moderateScale(25),
      fontWeight: "bold",
    },
    card: {
      width: scale(70),
      height: verticalScale(60),
      backgroundColor: "white",
      borderRadius: moderateScale(10),
      shadowColor: "black",
      shadowOffset: {
        width: scale(0),
        height: verticalScale(2),
      },
      shadowOpacity: 0.25,
      shadowRadius: moderateScale(3.84),
      elevation: 5,
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
  });