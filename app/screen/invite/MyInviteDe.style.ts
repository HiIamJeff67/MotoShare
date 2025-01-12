import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const MyInviteDeStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scale(20), // 設置水平間距
            paddingBottom: verticalScale(30), // 設置垂直間距
        },
        card: {
            backgroundColor: _colors.card,
            borderWidth: moderateScale(1), 
            borderColor: _colors.border, 
            marginTop: verticalScale(15),
            borderRadius: moderateScale(10),
            shadowColor: "#000",
            shadowOffset: { width: scale(0), height: verticalScale(2) },
            shadowOpacity: 0.2,
            shadowRadius: moderateScale(4),
            elevation: 5, // Android 的陰影
        },
        header: {
            borderBottomWidth: moderateScale(0.5),
            borderBottomColor: _colors.border, 
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
            marginBottom: verticalScale(5),
            fontSize: moderateScale(15),
            ...(_fonts.heavy), 
            color: _colors.text,
        },
        maintitle: {
            marginBottom: verticalScale(10),
            fontSize: moderateScale(18),
            ...(_fonts.heavy), 
            color: _colors.text, 
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
        },
        inviteButton: {
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
            marginTop: verticalScale(6), 
        },
        inviteButtonText: {
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
            backgroundColor: "white",
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
            textAlign: "center",
            fontSize: moderateScale(16),
            marginBottom: verticalScale(15),
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