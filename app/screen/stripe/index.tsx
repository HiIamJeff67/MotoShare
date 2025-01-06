import CheckoutForm from "@/app/screen/stripe/checkout-form";
import { Image, ScrollView, Text, View } from "react-native";

export default function DonatePage(): JSX.Element {
  return (
    <ScrollView
      style={{ flex: 1, maxWidth: 600, paddingBottom: 24 }}
      contentContainerStyle={{ padding: 16, gap: 8 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Image
        source={require("@/assets/images/favicon.png")}
        style={{ width: "100%", height: 300, borderRadius: 12 }}
      />

      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Expo</Text>
        <Text>They can run everywhere</Text>
      </View>

      <CheckoutForm />
    </ScrollView>
  );
}
