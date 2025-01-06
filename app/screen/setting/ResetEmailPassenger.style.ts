import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const ResetEmailPasswordStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: _colors.background,
        }, 
        innerContainer: {
            flexGrow: 1,
            width: "100%", 
            alignItems: 'center',
            paddingTop: verticalScale(15),
            ...(insets && { paddingBottom: verticalScale(insets.bottom) }),
            paddingHorizontal: scale(20),
        }, 
        profileHeader: {
            position: "relative", 
            alignItems: "center",
            marginTop: moderateScale(16), 
            width: moderateScale(80),
            height: moderateScale(80),
            borderRadius: moderateScale(40),
            borderColor: _colors.card, 
            borderWidth: moderateScale(2), 
            borderStyle: "solid", 
            overflow: "hidden", 
        }, 
        avatar: {
            width: moderateScale(80),
            height: moderateScale(80),
            borderRadius: moderateScale(40),
        }, 
        editableInputContainer: {
            flex: 1,
            width: "100%", 
            flexDirection: "column", 
            justifyContent: "flex-start", 
            gap: verticalScale(16), 
            marginTop: verticalScale(12), 
        }, 
        authCodeContainer: {
            width: "100%", 
            height: verticalScale(56), 
            justifyContent: "center", 
            gap: verticalScale(4), 
        }, 
        authCodeLabel: {
            ...(_fonts.heavy), 
            fontSize: scale(12),
            color: _colors.text, 
            paddingLeft: scale(6), 
        }, 
        authCodeInput: {
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
        authCodeInputOnFocus: {
            opacity: 1,
        }, 
        sendAuthCodeButton: {
            bottom: 0, 
            right: 0, 
            width: "30%", 
            height: "70%", 
            position: "absolute", 
            backgroundColor: _colors.text, 
            borderRadius: moderateScale(10), 
            justifyContent: "center", 
            alignItems: "center", 
            borderColor: _colors.border, 
            borderWidth: moderateScale(1), 
            borderStyle: "solid", 
        }, 
        sendAuthCodeButtonTitle: {
            ...(_fonts.bold), 
            fontSize: scale(12), 
            color: _colors.background, 
        }, 
        sendAuthCodeButtonExtra: {
            position: "absolute", 
            bottom: verticalScale(-14), 
            left: 0, 
            marginLeft: scale(12), 
            color: "#808080", 
        }, 
        sendAuthCodeButtonDisable: {
            opacity: 0.9, 
        }, 
        saveButton: {
            width: "100%", 
            height: verticalScale(36), 
            justifyContent: "center", 
            alignItems: "center", 
            backgroundColor: _colors.primary, 
            borderRadius: moderateScale(12), 
            marginTop: verticalScale(16), 
        }, 
        saveButtonTitle: {
            ...(_fonts.bold), 
            fontSize: moderateScale(16), 
            color: _colors.text, 
        }, 
    });
}

export const __styles = StyleSheet.create({});