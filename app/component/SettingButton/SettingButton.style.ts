import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const SettingButtonStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

    return StyleSheet.create({
        items: {
            flexDirection: "row",
            justifyContent: "space-around", 
            alignItems: "center",
            height: verticalScale(40), 
            borderBottomWidth: scale(1),
            borderBottomColor: _colors.border,
        }, 
        itemTitleContainer: {
            flex: 1,
            marginLeft: scale(15), 
            flexDirection: "column", 
            gap: verticalScale(2), 
        }, 
        itemTitle: {
            color: _colors.text, 
            fontSize: moderateScale(16), 
            fontWeight: _fonts.bold.fontWeight,
        }, 
        extraContent: {
            fontSize: moderateScale(12),
            color: _isDark ? "#777777" : "#999999",
            fontWeight: _fonts.heavy.fontWeight, 
        },
        badge: {
            backgroundColor: _colors.notification,
            color: _colors.text,
            fontSize: moderateScale(12),
            marginRight: scale(6), 
            paddingHorizontal: scale(8),
            paddingVertical: verticalScale(4),
            borderRadius: moderateScale(8),
            overflow: "hidden",
        },
        goToButton: {
            tintColor: _colors.text, 
            width: scale(7), 
            height: verticalScale(7), 
            marginRight: scale(15), 
        }, 
    });
}

export const __styles = StyleSheet.create({});