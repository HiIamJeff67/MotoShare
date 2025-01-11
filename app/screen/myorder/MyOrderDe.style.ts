import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const MyOrderDeStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scale(20), // 設置水平間距
            paddingTop: verticalScale(15), // 設置垂直間距
            paddingBottom: verticalScale(30), // 設置垂直間距
        },
        card: {
            backgroundColor: _colors.card, 
            borderWidth: moderateScale(1), 
            borderColor: _colors.border, 
            borderRadius: moderateScale(10),
            shadowColor: "#000",
            shadowOffset: { width: scale(0), height: verticalScale(2) },
            shadowOpacity: 0.2,
            shadowRadius: moderateScale(4),
            elevation: 5, // Android 的陰影
        },
        header: {
            borderBottomWidth: scale(0.5), 
            borderBottomColor: _colors.border, 
            paddingVertical: verticalScale(10),
            paddingHorizontal: scale(16),
        },
        orderNumber: {
            ...(_fonts.bold), 
            color: _colors.text, 
            fontSize: moderateScale(16),
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
        actionButton: {
            borderRadius: moderateScale(12),
            shadowColor: "#000",
            shadowOffset: { width: scale(0), height: verticalScale(2) },
            shadowOpacity: 0.3,
            shadowRadius: moderateScale(4),
            backgroundColor: "#4CAF50", // green
            elevation: 5,
            height: verticalScale(40),
            justifyContent: "center",
            alignItems: "center",
        },
        actionButtonText: {
            ...(_fonts.bold), 
            fontSize: moderateScale(18), 
            color: "white", 
        },
    });
}

export const __styles = StyleSheet.create({});