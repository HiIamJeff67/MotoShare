import CheckOutForm from "@/app/screen/stripe/CheckOutForm";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { Styles } from "./Payment.style";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(store)";

const PaymentPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const [styles, setStyles] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const insets = useSafeAreaInsets();

  const amounts: { value: number; color: string }[] = [
    { value: 1, color: "#4CD964" },
    { value: 5, color: "#5B9EFF" },
    { value: 10, color: "#FFA500" },
    { value: 20, color: "#4169E1" },
    { value: 50, color: "#8A2BE2" },
    { value: 100, color: "#191970" },
  ];

  useEffect(() => {
    if (theme) {
      setStyles(Styles(theme));
    }
  }, [theme]);

  if (!styles) return null;

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: verticalScale(insets.bottom),
        paddingHorizontal: scale(20),
      }}
    >
      <View style={styles.header}>
        <Text style={styles.amount}>儲值 {selectedAmount.toFixed(2)} 元</Text>
      </View>

      <Text style={styles.sectionTitle}>選擇其他金額</Text>

      <View style={styles.gridContainer}>
        {amounts.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => item.value && setSelectedAmount(item.value)} style={styles.gridItem}>
            <View style={[styles.amountBox, { backgroundColor: item.color }]}>
              <Text style={styles.amountText}>{item.value}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <CheckOutForm amount={selectedAmount} />
    </View>
  );
};

export default PaymentPage;
