import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const EditableInputStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];
    
    return StyleSheet.create({
        container: {
            width: "100%", 
            height: verticalScale(56), 
            justifyContent: "center", 
            gap: verticalScale(4), 
        }, 
        label: {
            ...(_fonts.heavy), 
            fontSize: scale(12),
            color: _colors.text, 
            paddingLeft: scale(6), 
        }, 
        input: {
            flex: 1, 
            ...(_fonts.medium), 
            fontSize: scale(14),
            color: _colors.text,
            width: "100%", 
            paddingLeft: scale(12), 
            opacity: 0.8,
            backgroundColor: _colors.card, 
            borderColor: _colors.border, 
            borderWidth: moderateScale(1), 
            borderStyle: "solid", 
            borderRadius: moderateScale(12), 
            overflow: "hidden", 
        }, 
        inputOnFocus: {
            opacity: 1,
        }, 
        inputUnEditable: {
            opacity: 0.5, 
        }, 
    });
}

export const __style = StyleSheet.create({});