import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const OtherInviteStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1,
            paddingBottom: verticalScale(15),
        },
        card: {
            backgroundColor: _colors.card, 
            borderWidth: moderateScale(1), 
            borderColor: _colors.border, 
            borderRadius: moderateScale(10), 
            shadowColor: "#000",
            shadowOffset: { width: scale(0), height: verticalScale(2) },
            shadowOpacity: 0.2,
            shadowRadius: moderateScale(4),
            elevation: 5,
        },
        header: {
            borderBottomWidth: moderateScale(0.5), 
            borderBottomColor: _colors.border, 
            paddingVertical: verticalScale(10),
            paddingHorizontal: scale(16),
        },
        orderNumber: {
            ...(_fonts.bold), 
            color: _colors.text, 
            fontSize: moderateScale(16),
        },
        body: {
            padding: moderateScale(16),
        },
        title: {
            ...(_fonts.medium), 
            fontSize: moderateScale(15),
            color: _colors.text, 
            marginBottom: verticalScale(5), 
        },
    });
}

export const __styles = StyleSheet.create({});