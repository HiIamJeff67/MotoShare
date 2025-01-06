import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

export const MyPreferencesStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1, 
            paddingVertical: verticalScale(6), 
            paddingHorizontal: scale(12), 
        }, 
        itemContainer: {
            justifyContent: "center", 
            gap: verticalScale(12), 
            padding: scale(10), 
        }, 
    });
}

export const __styles = StyleSheet.create({});