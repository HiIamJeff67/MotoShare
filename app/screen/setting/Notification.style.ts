import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const NotificationStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        outerContainer: {
            flex: 1, 
        }, 
        container: {
            flex: 1,
            paddingVertical: verticalScale(6), 
            paddingHorizontal: scale(6),
        },
        card: {
            backgroundColor: _colors.card, 
            borderRadius: moderateScale(10),
            shadowColor: "#000",
            shadowOffset: { width: scale(0), height: verticalScale(2) },
            shadowOpacity: 0.2,
            shadowRadius: moderateScale(4),
            elevation: 5, 
            borderColor: _colors.border, 
            borderWidth: moderateScale(1), 
        }, 
        readedCard: {
            opacity: 0.7, 
        }, 
        header: {
            borderBottomColor: _colors.border, 
            borderBottomWidth: moderateScale(0.5), 
            paddingVertical: verticalScale(10),
            paddingHorizontal: scale(16),
        },
        number: {
            ...(_fonts.bold), 
            fontSize: moderateScale(16),
            color: _colors.text, 
        },
        body: {
            padding: moderateScale(16),
        },
        title: {
            ...(_fonts.medium), 
            marginBottom: verticalScale(5),
            fontSize: moderateScale(15),
            color: _colors.text, 
        },
    });
}

export const __styles = StyleSheet.create({});