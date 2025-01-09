import { Theme } from "@/theme/theme";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, ScaledSheet, verticalScale } from "react-native-size-matters";

export const POrderDetailStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return ScaledSheet.create({
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        container: {
            flex: 1,
            paddingHorizontal: scale(20), // 設置水平間距
            paddingTop: verticalScale(15), // 設置垂直間距
            paddingBottom: verticalScale(30), // 設置垂直間距
        },
        card: {
            backgroundColor: _colors.card, 
            borderColor: _colors.border, 
            borderWidth: moderateScale(1.5), 
            borderRadius: moderateScale(10), 
            shadowColor: "#000",
            shadowOffset: { width: scale(0), height: verticalScale(2) },
            shadowOpacity: 0.2,
            shadowRadius: moderateScale(4),
            elevation: 5, // Android 的陰影
        },
        header: {
            borderBottomWidth: moderateScale(1), 
            borderBottomColor: _colors.text, 
            paddingVertical: verticalScale(10),
            paddingHorizontal: scale(16),
        },
        orderNumber: {
            color: _colors.text, 
            fontWeight: "bold",
            fontSize: moderateScale(16),
        },
        body: {
            padding: moderateScale(16),
        },
        title: {
            ...(_fonts.medium), 
            marginBottom: verticalScale(8),
            fontSize: moderateScale(14), 
            color: _colors.text, 
        }, 
        description: {
            ...(_fonts.regular), 
            marginBottom: verticalScale(16), 
            fontSize: moderateScale(14), 
            color: _colors.text, 
        }, 
        inviteButton: {
            borderRadius: moderateScale(12),
            shadowColor: "#000",
            shadowOffset: { width: scale(0), height: verticalScale(2) },
            shadowOpacity: 0.3,
            shadowRadius: moderateScale(4),
            backgroundColor: _colors.notification, 
            elevation: 5,
            height: verticalScale(40),
            justifyContent: "center",
            alignItems: "center",
        },
        inviteButtonText: {
            ...(_fonts.bold), 
            fontSize: moderateScale(18),
            color: _colors.background, 
        },
    });
}

export const __styles = ScaledSheet.create({});