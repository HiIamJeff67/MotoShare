import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import CheckOutButton from "./CheckOutButton";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      return token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

async function fetchPaymentSheetParams() {
  const token = await getToken();

  if (!token) {
    Alert.alert("Token failed", "unable to get token");
    throw new Error("Unable to get token");
  }

  let url: string = `${process.env.EXPO_PUBLIC_API_URL}/passengerBank/getCustomerId`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // 放在 headers 中
      },
    });

    const { paymentIntent, ephemeralKey, customer } = response.data;
    return { paymentIntent, ephemeralKey, customer };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      Alert.alert("錯誤", JSON.stringify(error.response?.data.message));
    } else {
      console.log("An unexpected error occurred:", error);
      Alert.alert("錯誤", "伺服器錯誤");
    }
    throw error;
  }
}

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async () => {
    const paymentSheetParams = await fetchPaymentSheetParams();
    const { paymentIntent, ephemeralKey, customer } = paymentSheetParams;

    // Use Mock payment data: https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet#react-native-test
    const { error } = await initPaymentSheet({
      merchantDisplayName: "MotoShare, Inc.",

      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "MotoShare, Inc.",
        email: "motoshare767@gmail.com",
        phone: "0958123456",
      },
      returnURL: Linking.createURL("stripe-redirect"),

      // Enable Apple Pay:
      // https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet#add-apple-pay
      applePay: {
        merchantCountryCode: "US",
      },
      googlePay: {
        merchantCountryCode: "US",
        testEnv: true, // use test environment
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return <CheckOutButton style={{}} onPress={openPaymentSheet} disabled={!loading} title="Checkout" />;
}
