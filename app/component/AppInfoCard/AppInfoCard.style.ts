import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const AppInfoCardStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            justifyContent: "center", 
            alignItems: "center", 
            backgroundColor: _colors.card, 
            borderColor: _colors.border, 
            borderRadius: scale(6), 
            borderWidth: scale(1), 
        }, 
        overlay: {
            justifyContent: "center", 
            alignItems: "center", 
        }, 
        overlayOpaqued: {
            opacity: 0.3, 
        }, 
        topBarContainer: {
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center", 
            width: "100%", 
            borderColor: _colors.border, 
            borderBottomWidth: scale(0.5), 
        }, 
        topBarInnerLeftContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: scale(24),  
            height: verticalScale(40), 
            paddingLeft: scale(16), 
        }, 
        topBarInnerRightContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: scale(24),  
            height: verticalScale(40), 
            paddingRight: scale(16), 
        }, 
        icon: {
            width: moderateScale(30),
            height: moderateScale(30),
        }, 
        iconDefaultColor: {
            tintColor: _colors.primary, 
        }, 
        title: {
            ...(_fonts.medium), 
            fontSize: scale(16), 
            color: _colors.text, 
        }, 
        statusIcon: {
            width: moderateScale(24), 
            height: moderateScale(24), 
        }, 
        statusIconGreen: {
            tintColor: _colors.primary, 
        }, 
        statusIconRed: {
            width: moderateScale(16), 
            height: moderateScale(16), 
            tintColor: "red", 
        }, 
        bottomBarContainer: {
            paddingHorizontal: scale(12), 
            paddingVertical: verticalScale(10), 
        }, 
        description: {
            ...(_fonts.regular), 
            color: _colors.text, 
            lineHeight: verticalScale(14), 
        }, 
    });
}

export const __style = StyleSheet.create({});