import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

export const BindingsStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: "flex-start", 
            alignItems: "baseline", 
            gap: verticalScale(12), 
            paddingLeft: scale(10), 
            paddingRight: scale(10), 
            backgroundColor: _colors.background, 
            marginTop: verticalScale(8), 
            marginBottom: verticalScale(8), 
        }, 

    });
}

export const __style = StyleSheet.create({});