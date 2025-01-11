import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const RegisterStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        textInput: {
            flex: 1,
            height: "100%",
            borderWidth: 0, 
            backgroundColor: _colors.card, 
            color: _colors.text, 
            paddingLeft: scale(5),
        }, 
        icon: {
            tintColor: _colors.text, 
            width: scale(18),
            height: verticalScale(15),
            marginRight: scale(10),
        },
        inputWrapper: {
            marginTop: verticalScale(15),
            flexDirection: "row",
            alignItems: "center",
            height: verticalScale(40),
            backgroundColor: _colors.card, 
            borderWidth: moderateScale(1.5), 
            borderColor: _colors.border, 
            borderRadius: moderateScale(10),
            paddingHorizontal: scale(10), 
        },
        imageContainer: {
            justifyContent: "center",
            alignItems: "center",
        },
        image: {
            width: scale(150),
            height: verticalScale(150),
        },
        headerContainer: {
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: verticalScale(10),
        },
        headerText: {
            fontSize: moderateScale(28),
            fontWeight: "bold",
            color: _colors.primary, 
        },
        centerAlign: {
            justifyContent: "center",
            alignItems: "center",
        },
        registerButton: {
            width: "100%",
            marginTop: verticalScale(20),
            height: verticalScale(40),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: _colors.primary,
            borderRadius: moderateScale(10),
            shadowOpacity: 0.4,
            shadowRadius: moderateScale(10),
            shadowOffset: { width: scale(0), height: verticalScale(4) },
            shadowColor: "#000",
        },
        registerButtonText: {
            fontSize: moderateScale(18),
            fontWeight: "bold",
            color: "#fff",
        },
        forgotPasswordText: {
            marginTop: verticalScale(20),
            fontSize: moderateScale(16),
        },
        otherRegisterText: {
            marginTop: verticalScale(20),
            fontSize: moderateScale(16),
            color: _colors.primary,
        },
        socialContainer: {
            width: "100%",
            paddingHorizontal: scale(100),
            paddingTop: verticalScale(20),
            justifyContent: "center",
            alignItems: "center",
        },
        socialIcon: {
            width: scale(30),
            height: verticalScale(30),
            resizeMode: "contain",
        },
    });
}

export const __styles = StyleSheet.create({});