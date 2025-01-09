import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const POrderStyles = (theme: Theme, insets?: EdgeInsets) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        container: {
            flex: 1,
            paddingBottom: verticalScale(15),
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
            elevation: 5,
        },
        header: {
            borderBottomWidth: moderateScale(0.5), 
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
            ...(_fonts.heavy), 
            marginBottom: verticalScale(5),
            fontSize: moderateScale(15),
            color: _colors.text, 
        },
        searchContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: verticalScale(15),
        },
        searchBox: {
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
            borderRadius: moderateScale(50),
            borderWidth: scale(1),
            borderColor: "gray",
            backgroundColor: "white",
            paddingHorizontal: scale(16),
            height: verticalScale(40),
        },
        searchInput: {
            marginLeft: scale(8),
            flex: 1,
            fontSize: moderateScale(15),
        },
        addButtonContainer: {
            padding: moderateScale(10),
            backgroundColor: "gray",
            borderRadius: moderateScale(50),
            marginLeft: scale(10),
        },
    });
}

export const __styles = StyleSheet.create({});