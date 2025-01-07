import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const Styles = (theme: Theme) => {
  const [_colors, _fonts] = [theme.colors, theme.fonts];

  return StyleSheet.create({
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
  });
};