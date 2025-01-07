import { StyleSheet } from "react-native";
import { LightTheme, Theme } from "@/theme/theme";

import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { EdgeInsets } from "react-native-safe-area-context";

export const RecordButtonStyles = (theme: Theme) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            position: "relative", 
            borderWidth: scale(1), 
            borderStyle: "solid", 
            borderRadius: moderateScale(10), 
            borderColor: _colors.border, 
            backgroundColor: _colors.card,
            flexDirection: "row", 
            justifyContent: "space-evenly", 
            alignItems: "center", 
            shadowColor: "#000", 
            shadowOffset: {
                width: scale(2), 
                height: verticalScale(2), 
            }, 
            shadowOpacity: 0.1, 
        }, 
        recordIcon: {
            tintColor: _colors.text, 
            backgroundColor: _colors.card, 
            borderColor: _colors.border, 
            borderWidth: scale(1), 
            borderRadius: scale(10),
            padding: scale(2), 
            width: scale(40), 
            height: verticalScale(35), 
        }, 
        recordInfo: {
            width: scale(225), 
            height: verticalScale(45), 
            justifyContent: "center", 
            alignItems: "baseline",
            gap: verticalScale(5), 
            paddingLeft: scale(10), 
        }, 
        recordTitle: {
            color: _colors.text, 
            fontWeight: _fonts.bold.fontWeight, 
            fontSize: scale(12), 
        }, 
        recordAddress: {
            color: _colors.text, 
            fontWeight: _fonts.medium.fontWeight, 
            fontSize: scale(10), 
        }, 
        goToRecordIcon: {
            tintColor: _colors.text, 
            width: scale(10), 
            height: verticalScale(10), 
        }, 
    });
}