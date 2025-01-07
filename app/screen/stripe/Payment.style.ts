import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

export const Styles = (theme: Theme) => {
  const [_colors, _fonts] = [theme.colors, theme.fonts];

  return StyleSheet.create({
    header: {
      alignItems: "center",
      marginTop: verticalScale(20),
      marginBottom: verticalScale(30),
    },
    amount: {
      fontSize: moderateScale(40),
      fontWeight: "bold",
      color: _colors.text,
    },
    sectionTitle: {
      fontSize: moderateScale(16),
      color: _colors.text,
      marginBottom: verticalScale(15),
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    gridItem: {
      width: "30%",
      marginBottom: verticalScale(15),
    },
    amountBox: {
      padding: moderateScale(15),
      borderRadius: moderateScale(10),
      alignItems: "center",
      justifyContent: "center",
      height: verticalScale(80),
    },
    amountText: {
      color: _colors.text,
      fontSize: moderateScale(18),
      fontWeight: "bold",
    },
  });
};