import React from "react";
import { Text, View, ScrollView, Alert, Pressable, Modal, TextInput, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/index";
import * as SecureStore from "expo-secure-store";
import { useRoute } from "@react-navigation/native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { MyInviteDeStyles } from "./MyInviteDe.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";

// 定義每個訂單的資料結構
interface OrderType {
  id: string;
  description: string;
  startAfter: Date;
  initPrice: number;
  suggestPrice: number;
  startAddress: string;
  suggestStartAddress: string;
  suggestEndAddress: string;
  suggestStartAfter: Date;
  phoneNumber: string;
  endAddress: string;
  inviteUdpatedAt: Date;
  inviteBriefDescription: string;
  inviteStatus: string;
}

const MyInviteDetail = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { t } = useTranslation();
  const { orderid } = route.params as { orderid: string };
  
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  const [invite, setInvite] = useState<OrderType>();
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(MyInviteDeStyles(theme, insets));
    }
  }, [theme]);

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

  useEffect(() => {
    // 透過 orderId 取得訂單資料
    let response,
      url = "";

    if (user.role === "Passenger") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/passenger/getMyPassengerInviteById`;
    } else if (user.role === "Ridder") {
      url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/ridder/getMyRidderInviteById`;
    }

    const SearchInvite = async () => {
      try {
        // 獲取 Token
        const token = await getToken();

        if (!token) {
          Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
          return;
        }

        response = await axios.get(url, {
          params: {
            id: orderid,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        });

        setInvite(response.data);
        console.log(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        } else {
          console.log("An unexpected error occurred:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    SearchInvite();
  }, []);

  // 監控 loading 狀態變化，禁用或恢復返回
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (loading) {
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
            index: 1,
            routes: [{ name: "home" }, { name: "myinvite" }],
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
  }, [loading, navigation]);

  const InviteStatus = async () => {
    setLoading(true);

    try {
      let response,
        url = "";

      if (user.role === "Passenger") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/passenger/updateMyPassengerInviteById`;
      } else if (user.role === "Ridder") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/ridder/updateMyRidderInviteById`;
      }

      // 獲取 Token
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。", [{ onPress: () => setLoading(false) }]);
        return;
      }

      response = await axios.patch(
        url,
        {
          status: "CANCEL", // 這裡是 body 的部分，應該放在第二個參數
          briefDescription: inputValue,
        },
        {
          params: {
            id: orderid, // 查詢參數，會變成 `?id=orderid`
          },
          headers: {
            Authorization: `Bearer ${token}`, // 放在 headers 中
          },
        }
      );

      setLockButton(true);
      setLoading(false);
      Alert.alert(t("success"), t("cancel invite success"));
      //console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [{ onPress: () => setLoading(false) }]);
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤", [{ onPress: () => setLoading(false) }]);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <LoadingWrapper />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.orderNumber}>{t("invite id")}: {invite?.id}</Text>
              </View>

              <View style={styles.body}>
                {invite ? (
                  <>
                    <Text style={styles.maintitle}>{t("my recommend")}</Text>
                    <Text style={styles.title}>{t("starting point")}：{invite.suggestStartAddress}</Text>
                    <Text style={styles.title}>{t("destination")}：{invite.suggestEndAddress}</Text>
                    <Text style={styles.title}>
                      {t("start driving")}:{" "}
                      {new Date(invite.suggestStartAfter).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>{t("price")}: {invite.suggestPrice}</Text>
                    <Text style={styles.title}>
                      {t("update time")}:{" "}
                      {new Date(invite.inviteUdpatedAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>{t("remark")}: {invite.inviteBriefDescription}</Text>
                    {invite.inviteStatus == "CHECKING" && (
                      <Pressable style={[styles.inviteButton]} onPress={() => setModalVisible(true)} disabled={loading || lockButton}>
                        <Text style={styles.inviteButtonText}>{t("cancel invite")}</Text>
                      </Pressable>
                    )}
                  </>
                ) : null}
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.body}>
                {invite ? (
                  <>
                    <Text style={styles.maintitle}>{t("original order")}</Text>
                    <Text style={styles.title}>{t("starting point")}：{invite.startAddress}</Text>
                    <Text style={styles.title}>{t("destination")}：{invite.endAddress}</Text>
                    <Text style={styles.title}>
                      {t("start driving")}:{" "}
                      {new Date(invite.startAfter).toLocaleString("en-GB", {
                        timeZone: "Asia/Taipei",
                      })}
                    </Text>
                    <Text style={styles.title}>{t("price")}: {invite.initPrice}</Text>
                    <Text style={styles.title}>{t("remark")}: {invite.description}</Text>
                  </>
                ) : null}
              </View>
            </View>
            {/* 彈出窗口 */}
            {invite?.inviteStatus == "CHECKING" && (
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>{t("Please enter the reason for cancellation")}:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={t("reason for cancellation")}
                      value={inputValue}
                      onChangeText={setInputValue}
                      placeholderTextColor="gray"
                    />
                    <View style={{ flexDirection: "row" }}>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                        disabled={loading || lockButton}
                      >
                        <Text style={styles.textStyle}>{t("back")}</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          InviteStatus();
                        }}
                        disabled={loading || lockButton}
                      >
                        <Text style={styles.textStyle}>{loading ? t("confirmation") : t("confirm")}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyInviteDetail;
