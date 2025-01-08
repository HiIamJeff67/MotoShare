import CheckOutForm from "@/app/screen/stripe/CheckOutForm";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { Styles } from "./Payment.style";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(store)";
import { useTranslation } from "react-i18next";

const PaymentPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const [styles, setStyles] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const amounts: { value: number; color: string }[] = [
    { value: 1, color: "#4CD964" },
    { value: 5, color: "#5B9EFF" },
    { value: 10, color: "#FFA500" },
    { value: 20, color: "#4169E1" },
    { value: 50, color: "#8A2BE2" },
    { value: 100, color: "#ADD8E6" },
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
        <Text style={styles.amount}>{t("top up")} {selectedAmount.toFixed(2)} {t("dollar")}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t("Choose another amount")}</Text>

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
