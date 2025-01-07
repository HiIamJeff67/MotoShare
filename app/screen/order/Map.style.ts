import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const MapStyles = (theme: Theme, insets: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        autoCompleteConatiner: {
            overflow: "hidden", 
        }, 
        textInputContainer: {
            zIndex: 1,
        },
        textInput: {
            color: _colors.text, 
            height: verticalScale(40),
            fontSize: moderateScale(16),
            backgroundColor: _colors.card, 
            borderRadius: moderateScale(10),
            paddingLeft: scale(10),
        },
        predefinedPlacesDescription: {
            color: "#1faadb",
        },
        listView: {
            backgroundColor: _colors.background,
            borderRadius: moderateScale(6),
            borderTopLeftRadius: moderateScale(0), 
            borderTopRightRadius: moderateScale(0), 
            elevation: 5,
            marginBottom: verticalScale(24),
            overflow: "hidden", 
            marginTop: verticalScale(-12), 
            paddingTop: verticalScale(6), 
            paddingHorizontal: scale(1), 
            borderColor: _colors.border, 
            borderWidth: scale(1), 
            borderTopWidth: scale(0), 
        },
        autoCompleteDescription: {
            ...(_fonts.heavy), 
            color: _colors.text, 
        }, 
        autoCompletePowerContainer: {
            backgroundColor: _colors.background, 
        }, 
        autoCompletePowered: {
            tintColor: _colors.text, 
        }, 
        autoCompleteSeparator: {
            height: verticalScale(0.5), 
            backgroundColor: _colors.border, 
        }, 
        autoCompleteRow: {
            backgroundColor: _colors.background
        }, 
        bottomSheetBackground: {
            backgroundColor: _colors.card, 
        }, 
        bottomSheetHandle: {
            backgroundColor: _colors.card, 
        }, 
        bottomSheetHandleIndicator: {
            backgroundColor: _colors.text, 
        }, 
        bottomSheetContainer: {
            flex: 1,
            paddingHorizontal: scale(20), 
            paddingVertical: verticalScale(20), 
            backgroundColor: _colors.background, 
        }, 
        bottomSheetTitle: {
            ...(_fonts.bold), 
            fontSize: moderateScale(25),
            color: _colors.text, 
        },
        bottomSheetText: {
            ...(_fonts.medium), 
            fontSize: moderateScale(15),
            color: _colors.text, 
            marginTop: verticalScale(10),
            marginBottom: verticalScale(10),
        },
        bottomSheetDate: {
            fontSize: moderateScale(12),
            marginLeft: scale(10),
            justifyContent: "center", 
            alignItems: "center", 
        },
        input: {
            color: _colors.text, 
            height: verticalScale(40),
            borderColor: _colors.border,
            borderWidth: scale(1),
            borderRadius: moderateScale(8),
            paddingHorizontal: scale(10),
            marginBottom: verticalScale(10),
            backgroundColor: _colors.background,
        }, 
        switcherContainer: {
            flexDirection: "row", 
            width: "100%", 
            alignItems: "center", 
            gap: scale(12), 
            marginBottom: verticalScale(12), 
        }, 
        dateContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginTop: verticalScale(10),
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
            color: _colors.text,
            fontSize: moderateScale(16),
            fontWeight: "bold",
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
        },
        dropdownplaceholderStyle: {
            fontSize: moderateScale(16),
        },
        dropdownselectedTextStyle: {
            fontSize: moderateScale(16),
        },
        dropdowniconStyle: {
            width: scale(20),
            height: verticalScale(20),
        },
        dropdowncontainerStyle: {
            top: -verticalScale(70),
        },
        card: {
            backgroundColor: _colors.card,
            borderRadius: moderateScale(10),
            padding: moderateScale(15),
            marginBottom: verticalScale(10),
            overflow: 'hidden',
            elevation: 3,
        },
        activeCard: {
            backgroundColor: _colors.card,
            borderRadius: moderateScale(10),
            padding: moderateScale(15),
            marginBottom: verticalScale(10),
            overflow: 'hidden',
            elevation: 5,
        },
        cardText: {
            fontSize: scale(16),
            color: _colors.text, 
        },
        cardContent: {
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
        },
        activeCardImage: {
            width: 50,
            height: 50,
            borderRadius: 50,
            resizeMode: "cover",
        },
        cardImageContainer: {
            flexDirection: "column",
            width: 100, 
            height: 100, 
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        },
        cardTextContainer: {
            flexDirection: "column",
        },
        cardTitle: {
            fontSize: moderateScale(16),
            fontWeight: "bold",
            color: _colors.text, 
        },
        cardSubtitle: {
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
            fontSize: moderateScale(16),
            fontWeight: "bold",
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
            color: "#fff",
            fontSize: moderateScale(16),
            fontWeight: "bold",
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
            color: "#fff",
            fontSize: moderateScale(16),
            fontWeight: "bold",
        },
    });
}

export const __styles = StyleSheet.create({});