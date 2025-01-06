import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const EditProfileStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_isDark, _colors, _fonts] = [theme.dark, theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: _colors.background,
        },
        innerContainer: {
            flexGrow: 1,
            width: '100%',
            alignItems: 'center',
            paddingTop: verticalScale(15),
            ...(insets && { paddingBottom: verticalScale(insets.bottom) }),
            paddingHorizontal: scale(20),
        }, 
        profileHeader: {
            position: "relative", 
            alignItems: "center",
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
        editAvatarButton: {
            position: "absolute", 
            width: moderateScale(80), 
            height: moderateScale(20), 
            justifyContent: "center", 
            alignItems: "center", 
            bottom: 0, 
            backgroundColor: "rgba(0, 0, 0, 0.3)", 
        }, 
        cameraIcon: {
            height: moderateScale(12), 
            width: moderateScale(12), 
            tintColor: _colors.text, 
        }, 
        editableInputContainer: {
            width: "100%", 
            flexDirection: "column", 
            justifyContent: "flex-start", 
            gap: verticalScale(16), 
            marginTop: verticalScale(12), 
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

export const __style = StyleSheet.create({});