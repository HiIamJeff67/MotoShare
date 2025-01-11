import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const MyOrderHisDeStyles = (theme: Theme, insets?: EdgeInsets) => {
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
            borderBottomWidth: scale(2),
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
        rateButton: {
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
        rateButtonText: {
            ...(_fonts.bold), 
            fontSize: moderateScale(18),
            color: "white",
        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        modalView: {
            backgroundColor: _colors.card, 
            borderRadius: moderateScale(20),
            padding: moderateScale(30),
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
            width: scale(0),
            height: verticalScale(2),
            },
            shadowOpacity: 0.25,
            shadowRadius: moderateScale(4),
            elevation: 5,
        },
        button: {
            height: verticalScale(40),
            width: scale(80),
            borderRadius: moderateScale(20),
            elevation: 2,
            margin: moderateScale(10),
            justifyContent: "center",
            alignItems: "center",
        },
        buttonOpen: {
            backgroundColor: _colors.primary, 
        },
        buttonClose: {
            backgroundColor: _colors.notification, 
        },
        textStyle: {
            ...(_fonts.bold), 
            color: _colors.text, 
            textAlign: "center", 
        },
        modalText: {
            ...(_fonts.bold), 
            marginBottom: verticalScale(15),
            textAlign: "center",
            fontSize: moderateScale(16),
        },
        input: {
            height: verticalScale(40),
            width: scale(200),
            borderColor: _colors.border, 
            borderWidth: scale(1),
            borderRadius: moderateScale(8),
            paddingHorizontal: verticalScale(10),
            marginBottom: verticalScale(15),
            backgroundColor: _colors.card, 
        },
    });
}

export const __styles = StyleSheet.create({});