import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export const HomeScreenStyles = (theme: Theme, insets?: EdgeInsets) => {
  const [_colors, _fonts] = [theme.colors, theme.fonts];

  return StyleSheet.create({
    container: {
      flex: 1,
      ...(insets && {
        paddingTop: verticalScale(insets.top),
        paddingBottom: verticalScale(insets.bottom),
      }),
      paddingHorizontal: scale(20), // 設置水平間距
      backgroundColor: _colors.background,
    },
    mapContainer: {
      marginBottom: verticalScale(15),
      marginTop: verticalScale(15),
      height: verticalScale(200),
      width: "100%",
      borderRadius: moderateScale(10),
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: scale(2),
        height: verticalScale(2),
      },
      shadowOpacity: 0.15,
      shadowRadius: moderateScale(3.84),
      elevation: 5,
    },
    map: {
      width: "100%",
      height: "100%",
    },
    welcomeText: {
      paddingLeft: scale(5),
      fontSize: moderateScale(25),
      fontWeight: _fonts.heavy.fontWeight,
      color: _colors.text,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    textInput: {
      flex: 1, // 使輸入框填滿剩餘空間
      color: _colors.text, // 文字顏色
    },
    inputWrapper: {
      flexDirection: "row", // 讓圖標和輸入框水平排列
      alignItems: "center", // 垂直居中
      height: verticalScale(40),
      backgroundColor: _colors.card, // 背景色
      color: _colors.text,
      borderColor: _colors.border,
      borderRadius: moderateScale(50), // 圓角
      paddingHorizontal: scale(20), // 左右內邊距
      marginTop: verticalScale(20),
      marginBottom: verticalScale(20),
    },
    recordContainer: {
      position: "relative",
      flexDirection: "column",
      gap: verticalScale(10),
      marginBottom: verticalScale(15),
    },
    icon: {
      width: scale(22),
      height: verticalScale(20),
      marginRight: scale(10), // 圖標與文字之間的距離
      tintColor: _colors.text,
    },
    MainText: {
      fontSize: moderateScale(20),
      fontWeight: "bold",
      color: _colors.text,
    },
    card: {
      width: scale(70),
      height: verticalScale(60),
      borderRadius: moderateScale(10),
      backgroundColor: _colors.card,
      shadowColor: "#000",
      shadowOffset: {
        width: scale(2),
        height: verticalScale(2),
      },
      shadowOpacity: 0.15,
      shadowRadius: moderateScale(3.84),
      elevation: 5,
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
    cardIcon: {
      fontWeight: _fonts.regular.fontWeight,
      color: _colors.text,
    },
    cardText: {
      marginTop: verticalScale(5),
      color: _colors.text,
    },
  });
};

export const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];
