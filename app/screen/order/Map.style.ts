import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const MapStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        map: {
            ...StyleSheet.absoluteFillObject,
        }, 
        textInputContainer: {
            zIndex: 1,
        },
        textInput: {
            height: verticalScale(40),
            color: _colors.text, 
            fontSize: moderateScale(16),
            backgroundColor: _colors.card, 
            borderRadius: moderateScale(10),
            paddingLeft: scale(10),
        },
        description: {
            color: _colors.text, 
        }, 
        predefinedPlacesDescription: {
            color: "#1faadb",
        },
        listView: {
            backgroundColor: _colors.background, 
            borderWidth: moderateScale(1.5), 
            borderColor: _colors.border, 
            borderTopWidth: 0, 
            // I don't know why, but the below attributes will cause a huge error in ios
            // borderStartStartRadius: 0, 
            // borderStartEndRadius: 0, 
            borderRadius: moderateScale(5), 
            elevation: 5, 
            paddingTop: verticalScale(6), 
            marginBottom: verticalScale(10), 
            top: verticalScale(-10), 
        },
        poweredContainer: {
            backgroundColor: _colors.background, 
        }, 
        powered: {
            tintColor: _colors.text, 
        }, 
        row: {
            backgroundColor: _colors.background, 
        }, 
        bottomSheetTitle: {
            ...(_fonts.bold), 
            fontSize: moderateScale(25),
            color: _colors.text, 
        },
        bottomSheetText: {
            fontSize: moderateScale(15),
            color: _colors.text, 
            marginTop: verticalScale(10),
            marginBottom: verticalScale(10),
        },
        bottomSheetDate: {
            fontSize: moderateScale(15),
            color: _colors.text, 
            marginTop: verticalScale(10),
            marginBottom: verticalScale(10),
            marginLeft: scale(5),
        },
        input: {
            color: _colors.text, 
            height: verticalScale(40),
            borderColor: _colors.border, 
            borderWidth: scale(1),
            borderRadius: moderateScale(8),
            paddingHorizontal: scale(10),
            marginBottom: verticalScale(10),
            backgroundColor: _colors.card, 
        },
        dateContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        button: {
            height: verticalScale(40),
            width: scale(120),
            justifyContent: "center",
            alignItems: "center",
            borderRadius: moderateScale(10),
            shadowColor: "#000",
            shadowOpacity: 0.5,
            shadowRadius: moderateScale(5),
            elevation: 5,
        },
        buttonText: {
            ...(_fonts.bold), 
            color: _colors.text, 
            fontSize: moderateScale(16),
        },
        dropdowncontainer: {
            width: "50%",
            marginBlock: verticalScale(10),
        },
        dropdown: {
            height: verticalScale(40),
            borderColor: _colors.border, 
            borderWidth: scale(0.5),
            borderRadius: moderateScale(8),
            paddingHorizontal: scale(8), 
        },
        dropdownicon: {
            marginRight: scale(5),
            tintColor: _colors.text, 
        },
        dropdownplaceholderStyle: {
            fontSize: moderateScale(16), 
            color: _colors.text, 
        },
        dropdownselectedTextStyle: {
            fontSize: moderateScale(16), 
        },
        dropdowniconStyle: {
            width: scale(20),
            height: verticalScale(20), 
            tintColor: _colors.text, 
        },
        dropdowncontainerStyle: {
            height: verticalScale(90), 
            borderWidth: scale(1), 
            borderColor: _colors.border, 
            borderRadius: moderateScale(12), 
            overflow: "hidden", 
            backgroundColor: _colors.background, 
        },
        dropdownitemcontainerStyle: {
            height: verticalScale(40), 
            backgroundColor: _colors.background, 
        }, 
        dropdownitemtextStyle: {
            color: _colors.text, 
        }, 
        card: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: verticalScale(80),
            marginVertical: verticalScale(1), 
            padding: moderateScale(15),
            borderRadius: moderateScale(10),
        },
        activeCard: {
            alignItems: "center",
            height: "auto",
            gap: verticalScale(12), 
            marginVertical: verticalScale(1),
            padding: moderateScale(15),
            borderColor: _colors.border, 
            borderWidth: scale(2),
            borderRadius: moderateScale(10),
        },
        cardText: {
            fontSize: scale(16),
            color: _colors.text, 
        },
        cardContent: {
            tintColor: _colors.text, 
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
        },
        cardLeftSection: {
            flex: 5,
            flexDirection: "row",
            alignItems: "center",
        },
        cardImage: {
            width: 50,
            height: 50,
            borderRadius: 50,
            resizeMode: "cover",
            marginRight: scale(10),
            color: _colors.primary, 
        },
        activeCardImage: {
            width: 50,
            height: 50,
            borderRadius: 50,
            resizeMode: "cover",
        },
        cardImageContainer: {
            flexDirection: "column",
            width: 50,
            height: 50,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        },
        cardTextContainer: {
            flexDirection: "column",
        },
        cardTitle: {
            ...(_fonts.bold), 
            fontSize: moderateScale(16),
            color: _colors.text, 
        },
        cardSubtitle: {
            ...(_fonts.regular), 
            fontSize: moderateScale(14), 
            color: _colors.text, 
            marginTop: verticalScale(5),
        },
        cardRightSection: {
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "center",
        },
        cardPrice: {
            ...(_fonts.bold), 
            fontSize: moderateScale(16),
            color: _colors.text, 
        },
        fixedFooter: {
            paddingHorizontal: scale(20),
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: "#ccc", 
        },
        footerButton: {
            marginTop: verticalScale(10),
            marginBottom: verticalScale(25),
            height: verticalScale(50),
            width: "100%",
            backgroundColor: "#000",
            borderRadius: scale(5),
            alignItems: "center",
            justifyContent: "center",
        },
        footerButtonText: {
            ...(_fonts.bold), 
            color: _colors.text, 
            fontSize: moderateScale(16), 
        },
        inviteButton: {
            marginTop: verticalScale(10),
            height: verticalScale(40),
            width: "45%",
            backgroundColor: "#000", 
            borderRadius: scale(5),
            alignItems: "center",
            justifyContent: "center",
        },
        inviteButtonText: {
            ...(_fonts.bold), 
            color: _colors.text, 
            fontSize: moderateScale(16),
        },
        rowSwitch: {
            flexDirection: "column",
            justifyContent: "space-between", // 讓左右各自貼邊
            marginBottom: verticalScale(12), 
        },
        switchContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: scale(6), 
            // 可依需求在此調整左右間距
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
        },
        dropdownListContainer: {
            width: "60%",
            backgroundColor: _colors.card, 
            borderRadius: moderateScale(8),
            padding: moderateScale(8),
            // 下面是為了在 iOS 上讓內容不超出圓角
            overflow: "hidden",
        },
        dropdownItem: {
            paddingVertical: moderateScale(12),
            paddingHorizontal: moderateScale(8),
        },
        dropdownItemText: {
            fontSize: moderateScale(16),
            color: _colors.text, 
        },
    });
}

export const __styles = StyleSheet.create({});