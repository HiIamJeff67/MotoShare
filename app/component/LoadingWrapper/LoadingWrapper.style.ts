import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";

export const LoadingWrapperStyles = (theme: Theme) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center", 
            alignItems: "center", 
        }, 
        icon: {
            color: _colors.text, 
        }
    });
}

export const __styles = StyleSheet.create({
    
});