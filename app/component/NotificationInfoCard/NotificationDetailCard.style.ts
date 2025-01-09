import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const NotificationDetailCardStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        overlay: {
            flex: 1, 
            position: "absolute", 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            width: "100%", 
            height: "100%", 
        }, 
        container: {
            width: "80%", 
            height: "auto", 
            position: "absolute", 
            backgroundColor: _colors.card,
            borderRadius: 10, 
            borderColor: _colors.border, 
            borderWidth: moderateScale(1.5), 
        }, 
        innerContainer: {
            flex: 1, 
        }, 
        header: {
            borderBottomColor: _colors.border, 
            borderBottomWidth: moderateScale(1), 
            paddingVertical: verticalScale(10),
            paddingHorizontal: scale(12), 
            alignItems: "center", 
        },
        number: {
            ...(_fonts.bold), 
            fontSize: moderateScale(16),
            color: _colors.text, 
        },
        body: {
            paddingHorizontal: scale(16),
            paddingBottom: verticalScale(6), 
        }, 
        title: {
            ...(_fonts.heavy), 
            fontSize: moderateScale(16),
            color: _colors.text, 
        }, 
        isReadContainer: {

        }, 
        isRead: {
            position: "absolute", 
            right: scale(-8), 
            bottom: 0, 
            width: scale(36), 
            height: verticalScale(36), 
            tintColor: _colors.notification, 
        }, 
        descriptionContainer: {
            paddingHorizontal: scale(2), 
            marginVertical: verticalScale(6), 
            gap: verticalScale(4), 
        }, 
        descriptionTitle: {
            ...(_fonts.heavy), 
            fontSize: moderateScale(14),
            color: _colors.text, 
        }, 
        description: {
            ...(_fonts.regular), 
            fontSize: moderateScale(14),
            color: _colors.text, 
        }, 
        linkContainer: {
            paddingHorizontal: scale(2), 
            marginVertical: verticalScale(6), 
            gap: verticalScale(4), 
        }, 
        linkTypeTitle: {
            ...(_fonts.heavy), 
            fontSize: moderateScale(14),
            color: _colors.text, 
        }, 
        linkTypeContent: {
            ...(_fonts.regular), 
            fontSize: moderateScale(14),
            color: _colors.text, 
        }, 
        linkIdTitle: {
            ...(_fonts.heavy), 
            fontSize: moderateScale(14),
            color: _colors.text, 
        }, 
        linkIdContent: {
            ...(_fonts.regular), 
            fontSize: moderateScale(14),
            color: _colors.primary, 
            textDecorationLine: "underline", 
        }, 
        createdAtTitle: {
            ...(_fonts.heavy), 
            fontSize: moderateScale(14),
            color: _colors.text, 
            marginBottom: verticalScale(6), 
        }, 
        createdAtContent: {
            ...(_fonts.regular), 
            fontSize: moderateScale(14),
            color: _colors.text, 
        }, 
    });
}

export const __styles = StyleSheet.create({});