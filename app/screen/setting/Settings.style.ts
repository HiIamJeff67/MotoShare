import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const SettingsStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1, 
            justifyContent: "flex-start", 
            alignItems: "baseline", 
            paddingLeft: scale(10), 
            paddingRight: scale(10), 
            backgroundColor: _colors.background, 
        }, 
        switcher: {
            marginRight: scale(15), 
        }, 
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',  // transparent
            justifyContent: 'flex-end',
        },
        modalContainer: {
            backgroundColor: _colors.card,
            borderRadius: scale(15), 
            padding: scale(16),
            alignItems: 'center',
            ...(insets && {
                marginBottom: verticalScale(insets.bottom), 
            }), 
        },
        modalTitle: {
            color: _colors.primary, 
            fontSize: 18,
            fontWeight: _fonts.bold.fontWeight, 
            marginBottom: 12,
        },
        optionButton: {
            width: '100%',
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: _colors.border,
            flexDirection: "row", 
            justifyContent: "space-between", 
        },
        optionText: {
            fontSize: 16,
            color: _colors.text,
            fontWeight: _fonts.heavy.fontWeight, 
        },
        cancelButton: {
            marginTop: 12,
            backgroundColor: _colors.notification,
            borderRadius: 10,
            width: '100%',
            padding: 12,
            alignItems: 'center',
        },
        cancelText: {
            fontSize: 16,
            color: _colors.text,
            fontWeight: _fonts.heavy.fontWeight, 
        },
    });
}

export const __style = StyleSheet.create({});