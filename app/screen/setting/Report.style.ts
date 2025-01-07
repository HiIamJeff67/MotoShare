import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const ReportStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];
    
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: _colors.background,
        }, 
        scrollContainer: {
            flexGrow: 1,
            padding: moderateScale(20), 
        }, 
        input: {
            borderWidth: moderateScale(1),
            borderColor: _colors.border,
            borderRadius: moderateScale(8),
            padding: moderateScale(12),
            marginBottom: verticalScale(16),
            fontSize: moderateScale(16), 
            color: _colors.text, 
        },
        textArea: {
            width: "100%", 
            height: verticalScale(240), 
            borderWidth: moderateScale(1),
            borderColor: _colors.border,
            borderRadius: moderateScale(8),
            padding: moderateScale(12),
            marginBottom: verticalScale(20),
            fontSize: moderateScale(16),
            textAlignVertical: 'top', 
            color: _colors.text, 
        },
        submitButton: {
            backgroundColor: _colors.primary, 
            padding: moderateScale(15),
            borderRadius: moderateScale(12),
            alignItems: 'center'
        },
        submitButtonText: {
            color: _colors.text, 
            fontSize: moderateScale(16),
            fontWeight: 'bold'
        }, 
        note: {
            ...(_fonts.regular), 
            fontSize: moderateScale(14), 
            opacity: 0.7, 
            paddingHorizontal: scale(2), 
            paddingTop: verticalScale(10), 
            lineHeight: verticalScale(16), 
            color: _colors.text, 
        }, 
    });
}

export const __styles = StyleSheet.create({});