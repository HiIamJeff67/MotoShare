import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    imageWrapper: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: verticalScale(20),
    },
    text: {
      fontSize: moderateScale(16),
      padding: verticalScale(2),
      fontWeight: "bold",
      color: "#000000",
      marginTop: verticalScale(10),
    },
    image: {
      width: scale(120), // 圖片寬度
      height: verticalScale(120), // 圖片高度
      resizeMode: "contain",
    },
  });