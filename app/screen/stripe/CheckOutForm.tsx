import { Alert } from "react-native";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import CheckOutButton from "./CheckOutButton";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../(store)/index";
import { UserRoleType } from "@/app/(store)/interfaces/userState.interface";
import { setUserBalance } from "@/app/(store)/userSlice";
import { useNavigation, CommonActions } from "@react-navigation/native";

interface CheckOutFormProps {
  amount: number;
}

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

async function fetchPaymentSheetParams(amount: string, user: UserRoleType) {
  const token = await getToken();

  if (!token) {
    Alert.alert("Token failed", "unable to get token");
    throw new Error("Unable to get token");
  }

  let url = "";

  if (user === "Passenger") {
    url = `${process.env.EXPO_PUBLIC_API_URL}/passengerBank/createPaymentIntentForAddingBalanceByUserId`;
  } else if (user === "Ridder") {
    url = `${process.env.EXPO_PUBLIC_API_URL}/ridderBank/createPaymentIntentForAddingBalanceByUserId`;
  }

  try {
    const response = await axios.post(
      url,
      {
        amount: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 放在 headers 中
        },
      }
    );

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

export default function CheckOutScreen({ amount }: CheckOutFormProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const amountReal = (amount * 100).toString();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.role);
  const balance = useSelector((state: RootState) => state.user.balance);
  const newBalance = (balance ?? 0) + 100 * 100;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [lockButton, setLockButton] = useState(false);

  if (!user) {
    Alert.alert("錯誤", "請重新登入");
    return;
  }

  // 監控 loading 狀態變化，禁用或恢復返回
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (!loading) {
      // 禁用手勢返回並隱藏返回按鈕
      navigation.setOptions({
        gestureEnabled: false,
      });

      // 禁用物理返回按鈕
      unsubscribe = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault(); // 禁用返回
      });
    } else {
      // 恢復手勢返回和返回按鈕
      navigation.setOptions({
        gestureEnabled: true,
      });

      // 移除返回監聽器
      if (unsubscribe) {
        unsubscribe();
      }

      if (lockButton) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "home" }],
          })
        );
      }
    }

    // 在組件卸載時移除監聽器
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loading, navigation, lockButton]);

  const initializePaymentSheet = async () => {
    const paymentSheetParams = await fetchPaymentSheetParams(amountReal, user);
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
      dispatch(setUserBalance({ balance: newBalance }));
      Alert.alert("Success", "Your order is confirmed!");
      setLockButton(true);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return !loading ? (
    <CheckOutButton onPress={openPaymentSheet} disabled={!loading || lockButton} title="Loading..." />
  ) : (
    <CheckOutButton onPress={openPaymentSheet} disabled={!loading || lockButton} title={t("checkout")} />
  );
}
