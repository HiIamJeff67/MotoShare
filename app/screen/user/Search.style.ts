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
      borderColor: _colors.border,
      backgroundColor: "gray",
      paddingHorizontal: scale(16),
      height: verticalScale(40),
    },
    searchInput: {
      ...(_fonts.heavy), 
      color: _colors.text, 
      marginLeft: scale(8),
      flex: 1,
      fontSize: moderateScale(15),
    }, 
    searchResultContainer: {
      marginBottom: verticalScale(10), 
      borderWidth: moderateScale(1), 
      borderColor: _colors.border, 
      borderRadius: moderateScale(12), 
      flexDirection: "row", 
      width: "100%", 
      height: verticalScale(50), 
      justifyContent: "flex-start", 
      alignItems: "center", 
      paddingLeft: scale(8), 
      gap: scale(12), 
      overflow: "hidden", 
    }, 
    searchResultIcon: { 
      width: moderateScale(36), 
      height: moderateScale(36), 
      borderWidth: moderateScale(0.5), 
      borderColor: _colors.border, 
      borderRadius: moderateScale(18), 
      tintColor: _colors.text, 
      overflow: "hidden", 
      padding: moderateScale(3), 
    }, 
    searchResultUserName: {
      color: _colors.text, 
    }, 
    searchResultOnlineContainer: {
      position: "absolute", 
      right: 0, 
      marginRight: scale(12), 
    }, 
    searchResultIsOnline: {
      width: moderateScale(12), 
      height: moderateScale(12), 
      borderWidth: moderateScale(0.5), 
      borderColor: _colors.border, 
      borderRadius: moderateScale(6), 
      backgroundColor: "green", 
    }, 
    searchResultIsOffline: {
      width: moderateScale(12), 
      height: moderateScale(12), 
      borderWidth: moderateScale(0.5), 
      borderColor: _colors.border, 
      borderRadius: moderateScale(6), 
      backgroundColor: "red", 
    }, 
  });
};

export const __styles = StyleSheet.create({});