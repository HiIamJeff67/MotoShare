import CheckOutForm from "@/app/screen/stripe/CheckOutForm";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function PaymentPage(): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: verticalScale(insets.top),
        paddingBottom: verticalScale(insets.bottom),
        paddingHorizontal: scale(20), // 設置水平間距
      }}
    >
      <Image source={require("@/assets/images/favicon.png")} style={{ width: "100%", height: verticalScale(200), borderRadius: moderateScale(12) }} />

      <View>
        <Text style={{ fontSize: moderateScale(20), fontWeight: "bold" }}>MotoShare</Text>
        <Text>They can run everywhere</Text>
      </View>

      <CheckOutForm />
    </View>
  );
}
