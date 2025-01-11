import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Platform,
  Keyboard,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import debounce from "lodash/debounce";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import "react-native-get-random-values";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { z } from "zod";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { MapStyles } from "./Map.style";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { addMinutes } from "@/app/methods/timeCalculate";

interface DataType {
  id: string;
  creatorName: string;
  avatorUrl: string;
  updatedAt: Date;
  startAddress: string;
  endAddress: string;
  autoAccept: boolean;
  startAfter: Date;
  initPrice: number;
}

const MapWithBottomSheet = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchData, setSearchData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    fetchData: false,
    createNewOrder: false,
    makeRequest: false,
    inviteNow: false,
    periodicOrder: false,
  });
  const [selectedDate, setSelectedDate] = useState(addMinutes(10));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [initialPrice, setinitialPrice] = useState("");
  const [orderDescription, setorderDescription] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [region, setRegion] = useState<Region | null>(null);
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showSetPage, setShowSetPage] = useState<boolean>(false);
  const [lockButton, setLockButton] = useState(false);
  const [showSearchOrderPage, setShowSearchOrderPage] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string | null>("");
  const [isDropdownFocus, setIsDropdownFocus] = useState(false);
  const GOOGLE_MAPS_APIKEY: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string;
  const mapRef = useRef<MapView>(null);
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [snapPoints, setSnapPoints] = useState(["25%", "50%", "85%"]); // 初始高度
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const anyLoadingTrue = Object.values(loading).some((value) => value === true);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true);
  const toggleSwitch = () => setIsSwitchEnabled((previousState) => !previousState);
  const [isSwitchTwoEnabled, setIsSwitchTwoEnabled] = useState(false);
  const toggleSwitchTwo = () => setIsSwitchTwoEnabled((previousState) => !previousState);
  const { t } = useTranslation();
  const toggleLoading = (key: string, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [autoCompleteInputOnFocus, setAutoCompleteInputOnFocus] = useState(false);
  const [autocompleteInputOnFocus2, setAutocompleteInputOnFocus2] = useState(false);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(MapStyles(theme, insets));
    }
  }, [theme]);

  const lockHeight = useCallback((height: string) => {
    setSnapPoints([height]); // 鎖定到單一高度
    bottomSheetRef.current?.expand(); // 確保展開到新高度
  }, []);

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const dismissKeyboard = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  const validateOrderData = () => {
    const priceSchema = z
      .string()
      .regex(/^[0-9]*$/, "Price must be a valid number")
      .min(1, "Initial price cannot be empty")
      .max(4, "Price must be less than 3000")
      .refine((val) => {
        const price = parseInt(val, 10);
        return price >= 5 && price <= 3000;
      }, "Price must be between 5 and 3000");

    const descriptionSchema = z
      .string()
      .regex(/^[一-龥a-zA-Z0-9\s.,!?]*$/, "Order description contains illegal characters")
      .max(100, "Order description must be less than 100 characters");

    const startAfterSchema = z.date().refine((date) => date > new Date(), "Start date must be in the future");
    const priceValidation = priceSchema.safeParse(initialPrice);
    const descriptionValidation = descriptionSchema.safeParse(orderDescription);
    const startAfterValidation = startAfterSchema.safeParse(selectedDate);

    if (!priceValidation.success) {
      Alert.alert("Validation Error", priceValidation.error.errors[0].message, [{ onPress: () => toggleLoading("fetchData", false) }]);
      return false;
    }

    if (!descriptionValidation.success) {
      Alert.alert("Validation Error", descriptionValidation.error.errors[0].message, [{ onPress: () => toggleLoading("fetchData", false) }]);
      return false;
    }

    if (!startAfterValidation.success) {
      Alert.alert("Validation Error", startAfterValidation.error.errors[0].message, [{ onPress: () => toggleLoading("fetchData", false) }]);
      return false;
    }

    return true;
  };

  // 監控 loading 狀態變化，禁用或恢復返回
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (anyLoadingTrue) {
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

      if (lockButton && (showSearchOrderPage || isSwitchTwoEnabled)) {
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
  }, [anyLoadingTrue, navigation]);

  const searchOrderData = async (mode: string) => {
    toggleLoading("fetchData", true);

    if (!validateOrderData()) {
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。", [{ onPress: () => toggleLoading("fetchData", false) }]);
        return;
      }

      let endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);

      const data = {
        startCordLongitude: origin?.longitude,
        startCordLatitude: origin?.latitude,
        endCordLongitude: destination?.longitude,
        endCordLatitude: destination?.latitude,
        startAfter: selectedDate,
        endedAt: endDate,
      };

      let url = "";

      if (user.role == "Ridder") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/searchBetterFirstPurchaseOrders`;
      } else if (user.role == "Passenger") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/searchBetterFirstSupplyOrders`;
      }

      const response = await axios.post(url, data, {
        params: {
          limit: 5,
          offset: 0,
          searchPriorities: mode === "1" ? "RTSDU" : "TRSDU",
        },
      });

      setSearchData(response.data);
      setShowSearchOrderPage(true);
      toggleLoading("fetchData", false);
      lockHeight("85%");
      //console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [{ onPress: () => toggleLoading("fetchData", false) }]);
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤", [{ onPress: () => toggleLoading("fetchData", false) }]);
      }
    }
  };

  const createOrderData = async (type: number, orderId?: String) => {
    if (type === 1) {
      toggleLoading("createNewOrder", true);
    } else if (type === 2) {
      toggleLoading("inviteNow", true);
    } else if (type === 3) {
      toggleLoading("makeRequest", true);
    } else if (type === 4) {
      toggleLoading("periodicOrder", true);
    }

    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。", [
          {
            onPress: () => {
              toggleLoading("createNewOrder", false);
              toggleLoading("inviteNow", false);
              toggleLoading("makeRequest", false);
              toggleLoading("periodicOrder", false);
            },
          },
        ]);
        return;
      }

      let startTime;
      let endDate = new Date(selectedDate);
      const DAYSDB = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const weekDay = DAYSDB[selectedDay];
      const pSelectedDate = new Date("9999-12-31T00:00:00Z");
      pSelectedDate.setHours(selectedDate.getHours());
      pSelectedDate.setMinutes(selectedDate.getMinutes());
      pSelectedDate.setSeconds(selectedDate.getSeconds());

      if (isSwitchTwoEnabled) {
        startTime = pSelectedDate;
        endDate = new Date("9999-12-31T23:59:59Z");
      } else {
        startTime = selectedDate;
        endDate.setDate(endDate.getDate() + 1);
      }

      const data = {
        startAddress: originAddress,
        endAddress: destinationAddress,
        startCordLongitude: origin?.longitude,
        startCordLatitude: origin?.latitude,
        endCordLongitude: destination?.longitude,
        endCordLatitude: destination?.latitude,
        ...((type === 1 || type === 4) && {
          description: orderDescription,
          initPrice: initialPrice,
          startAfter: startTime,
          endedAt: endDate,
          isUrgent: false,
          autoAccept: isSwitchEnabled,
        }),
        ...(type === 3 && {
          briefDescription: orderDescription,
          suggestPrice: initialPrice,
          suggestStartAfter: selectedDate,
          suggestEndedAt: endDate,
        }),
        ...(type === 4 && {
          scheduledDay: weekDay,
        }),
      };

      let url = "";
      let params = null;

      if (type === 1) {
        if (user.role == "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/createPurchaseOrder`;
        } else if (user.role == "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/createSupplyOrder`;
        }
      } else if (type === 2) {
        if (user.role == "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/startPurchaseOrderWithoutInvite`;
        } else if (user.role == "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/SupplyOrder/startSupplyOrderWithoutInvite`;
        }

        params = {
          id: orderId,
        };
      } else if (type === 3) {
        if (user.role == "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/passenger/createPassengerInviteByOrderId`;
        } else if (user.role == "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/ridder/createRidderInviteByOrderId`;
        }

        params = {
          orderId: orderId,
        };
      } else if (type === 4) {
        if (user.role == "Passenger") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/periodicPurchaseOrder/createMyPeriodicPurchaseOrder`;
        } else if (user.role == "Ridder") {
          url = `${process.env.EXPO_PUBLIC_API_URL}/periodicSupplyOrder/createMyPeriodicSupplyOrder`;
        }
      }

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });

      toggleLoading("createNewOrder", false);
      toggleLoading("inviteNow", false);
      toggleLoading("makeRequest", false);
      toggleLoading("periodicOrder", false);
      setLockButton(true);

      if (response.data.hasConflict) {
        Alert.alert(t("Conflict"), t("Conflict Message"));
      } else {
        Alert.alert(t("success"), t("Ordersentsuccessfully"));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [
          {
            onPress: () => {
              toggleLoading("createNewOrder", false);
              toggleLoading("inviteNow", false);
              toggleLoading("makeRequest", false);
              toggleLoading("periodicOrder", false);
            },
          },
        ]);
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤", [
          {
            onPress: () => {
              toggleLoading("createNewOrder", false);
              toggleLoading("inviteNow", false);
              toggleLoading("makeRequest", false);
              toggleLoading("periodicOrder", false);
            },
          },
        ]);
      }
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("定位權限被拒絕");
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const newRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      } catch (error) {
        Alert.alert("無法獲取位置");
      }
    };

    getLocation();
  }, []);

  const handleLocationPress = useCallback(
    debounce((data, details, type) => {
      if (details.geometry.location) {
        const { lat, lng } = details.geometry.location;

        if (type === "origin") {
          setOrigin({ latitude: lat, longitude: lng });
          setOriginAddress(data.description);
        } else if (type === "destination") {
          setDestination({ latitude: lat, longitude: lng });
          setDestinationAddress(data.description);
        }

        const newRegion = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      } else {
        Alert.alert("錯誤", "無法取得地點詳情。");
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (origin && destination) setShowSetPage(true);
  }, [origin, destination]);

  const dropDownData = [
    { label: t("Similar paths"), value: "1" },
    { label: t("Similar time"), value: "2" },
  ];

  const DAYS = [t("Monday"), t("Tuesday"), t("Wednesday"), t("Thursday"), t("Friday"), t("Saturday"), t("Sunday")];

  // 切換下拉清單開啟或關閉
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 選擇星期後，更新狀態並關閉下拉清單
  const onSelectDay = (day: number) => {
    setSelectedDay(day);
    setIsDropdownOpen(false);
  };

  return (
    styles && theme && 
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <GestureHandlerRootView style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <MapView ref={mapRef} style={styles.map} region={region || undefined}>
          {origin && (
            <Marker
              coordinate={{
                latitude: origin.latitude,
                longitude: origin.longitude,
              }}
              title="起始位置"
              description="選定的起始地點"
            />
          )}
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title="目的地"
              description="選定的位置"
            />
          )}
          {origin && destination && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              language="zh-TW"
              strokeColor="hotpink"
              strokeWidth={4}
              onStart={(params) => {
                console.log(`Started routing between ${params.origin} and ${params.destination}`);
              }}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
              }}
              onError={(errorMessage) => {
                console.log(errorMessage);
              }}
            />
          )}
        </MapView>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableHandlePanningGesture={true}
          enableContentPanningGesture={true}
          index={Platform.OS === "ios" ? 2 : 1} // 設置初始索引
          backgroundStyle={{
            backgroundColor: theme.colors.background, 
          }}
        >
          {showSetPage ? (
            <>
              {!showSearchOrderPage ? (
                <BottomSheetView
                  style={{
                    flex: 1,
                    paddingHorizontal: scale(20), // 設置水平間距
                    paddingVertical: verticalScale(20), // 設置垂直間距
                  }}
                >
                  <Text style={styles.bottomSheetTitle}>{t("address detail information")}</Text>
                  <Text style={styles.bottomSheetText}>
                    {t("starting point")}: {originAddress}
                  </Text>
                  <Text style={styles.bottomSheetText}>
                    {t("destination")}: {destinationAddress}
                  </Text>
                  <View style={styles.dateContainer}>
                    <Text style={styles.bottomSheetText}>{t("start time")}：</Text>
                    <Text style={styles.bottomSheetText}>
                      {isSwitchTwoEnabled
                        ? selectedDate.toLocaleTimeString("en-GB", {
                            timeZone: "Asia/Taipei",
                          })
                        : selectedDate.toLocaleString("en-GB", {
                            timeZone: "Asia/Taipei",
                          })}
                    </Text>
                    <TouchableOpacity style={styles.bottomSheetDate} onPress={() => showDatePicker()}>
                      <Entypo name="calendar" size={moderateScale(24)} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>
                  {isSwitchTwoEnabled && (
                    <View style={styles.dateContainer}>
                      <Text style={styles.bottomSheetText}>
                        {t("Selected Weekday")}：{DAYS[selectedDay]}
                      </Text>
                      <TouchableOpacity
                        style={styles.bottomSheetDate}
                        onPress={() => {
                          toggleDropdown();
                        }}
                      >
                        <Entypo name="calendar" size={moderateScale(24)} color={theme.colors.text} />
                      </TouchableOpacity>
                    </View>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder={t("Initial price")}
                    value={initialPrice}
                    onChangeText={setinitialPrice}
                    placeholderTextColor="gray"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t("Order Description")}
                    value={orderDescription}
                    onChangeText={setorderDescription}
                    placeholderTextColor="gray"
                  />

                  <View>
                    <View style={styles.rowSwitch}>
                      {/* 左側：Switch + Text */}
                      <View style={styles.switchContainer}>
                        <Switch
                          trackColor={{ false: "#767577", true: "#81b0ff" }}
                          thumbColor={isSwitchEnabled ? "#f4f3f4" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={toggleSwitch}
                          value={isSwitchEnabled}
                          disabled={loading.fetchData || loading.periodicOrder}
                        />
                        <Text style={styles.bottomSheetText}>{t("start directly")}</Text>
                      </View>

                      {/* 右側：Text + Switch */}
                      <View style={styles.switchContainer}>
                        <Switch
                          trackColor={{ false: "#767577", true: "#81b0ff" }}
                          thumbColor={isSwitchTwoEnabled ? "#f4f3f4" : "#f4f3f4"}
                          ios_backgroundColor="#3e3e3e"
                          onValueChange={toggleSwitchTwo}
                          value={isSwitchTwoEnabled}
                          disabled={loading.fetchData || loading.periodicOrder}
                        />
                        <Text style={styles.bottomSheetText}>{t("Periodic Order")}</Text>
                      </View>
                    </View>
                  </View>

                  {/* 模擬「下拉清單」的 Modal */}
                  <Modal visible={isDropdownOpen} transparent animationType="fade" onRequestClose={() => setIsDropdownOpen(false)}>
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsDropdownOpen(false)}>
                      <View style={styles.dropdownListContainer}>
                        {DAYS.map((day: string, index: number) => (
                          <TouchableOpacity key={day} style={styles.dropdownItem} onPress={() => onSelectDay(index)}>
                            <Text style={styles.dropdownItemText}>{day}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </TouchableOpacity>
                  </Modal>

                  <DateTimePickerModal
                    date={selectedDate}
                    mode={isSwitchTwoEnabled ? "time" : "datetime"}
                    locale="zh-tw"
                    is24Hour={true}
                    minimumDate={new Date()}
                    isVisible={isDatePickerVisible}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    timeZoneName={"Asia/Taipei"}
                  />
                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={[styles.button, { backgroundColor: "#3498db" }]}
                      onPress={() => {
                        setOrigin(null);
                        setDestination(null);
                        setShowSetPage(false);
                      }}
                      disabled={loading.fetchData || loading.periodicOrder || lockButton}
                    >
                      <Text style={styles.buttonText}>{t("back")}</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, { backgroundColor: "#228B22" }]}
                      onPress={() => {
                        if (isSwitchTwoEnabled) {
                          createOrderData(4);
                        } else {
                          searchOrderData("1");
                        }
                      }}
                      disabled={loading.fetchData || loading.periodicOrder || lockButton}
                    >
                      {isSwitchTwoEnabled ? (
                        <Text style={styles.buttonText}>{loading.periodicOrder ? <ActivityIndicator size="large" /> : t("Create POrder")}</Text>
                      ) : (
                        <Text style={styles.buttonText}>{loading.fetchData ? <ActivityIndicator size="large" /> : t("search order")}</Text>
                      )}
                    </Pressable>
                  </View>
                </BottomSheetView>
              ) : (
                <>
                  <ScrollView
                    style={{
                      flex: 1,
                      paddingHorizontal: scale(20), // 設置水平間距
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.dropdowncontainer}>
                      <Dropdown
                        style={[styles.dropdown, isDropdownFocus && { borderColor: theme.colors.primary }]}
                        selectedTextStyle={styles.dropdownselectedTextStyle}
                        placeholderStyle={{ ...styles.dropdownplaceholderStyle, ...(isDropdownFocus ? { color: theme.colors.primary } : { color: theme.colors.text }) }}
                        containerStyle={styles.dropdowncontainerStyle}
                        itemContainerStyle={styles.dropdownitemcontainerStyle}
                        itemTextStyle={styles.dropdownitemtextStyle}
                        iconStyle={styles.dropdowniconStyle}
                        dropdownPosition="bottom"
                        data={dropDownData}
                        labelField="label"
                        valueField="value"
                        placeholder={!isDropdownFocus ? "請選擇" : "..."}
                        value={dropdownValue}
                        onFocus={() => setIsDropdownFocus(true)}
                        onBlur={() => setIsDropdownFocus(false)}
                        onChange={(item) => {
                          setSearchData([]);
                          setIsDropdownFocus(false);
                          setDropdownValue(item.value);
                          searchOrderData(item.value);
                        }}
                        renderLeftIcon={() => (
                          <AntDesign style={styles.dropdownicon} color={isDropdownFocus ? theme.colors.primary : theme.colors.text} name="Safety" size={20} />
                        )}
                      />
                    </View>

                    {loading.fetchData ? (
                      <LoadingWrapper />
                    ) : (
                      <>
                        {searchData.map((item, index) => {
                          const isActive = index === activeIndex;

                          return (
                            <TouchableWithoutFeedback key={index} onPress={() => setActiveIndex(index)}>
                              {isActive ? (
                                <View style={styles.activeCard}>
                                  <View style={styles.cardImageContainer}>
                                    {item.avatorUrl ? (
                                      <Image source={{ uri: item.avatorUrl }} style={styles.activeCardImage} />
                                    ) : (
                                      <FontAwesome name="user" size={50} color={theme.colors.primary} />
                                    )}
                                  </View>

                                  <View style={styles.cardContent}>
                                    <View style={styles.cardLeftSection}>
                                      <View style={styles.cardTextContainer}>
                                        <Text style={styles.cardTitle}>
                                          {t("userName")}: {item.creatorName}
                                        </Text>
                                        <Text style={styles.cardSubtitle}>
                                          {t("starting point")}: {item.startAddress}
                                        </Text>
                                        <Text style={styles.cardSubtitle}>
                                          {t("destination")}: {item.endAddress}
                                        </Text>
                                        <Text style={styles.cardSubtitle}>
                                          {t("start driving")}:{" "}
                                          {new Date(item.startAfter).toLocaleString("en-GB", {
                                            timeZone: "Asia/Taipei",
                                          })}
                                        </Text>
                                      </View>
                                    </View>
                                    <View style={styles.cardRightSection}>
                                      <Text style={styles.cardPrice}>${item.initPrice}</Text>
                                    </View>
                                  </View>

                                  {item.autoAccept ? (
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                      <Pressable
                                        style={styles.inviteButton}
                                        disabled={anyLoadingTrue || lockButton}
                                        onPress={() => createOrderData(3, item.id)}
                                      >
                                        <Text style={styles.inviteButtonText}>
                                          {loading.makeRequest ? <ActivityIndicator size="large" /> : t("make a request")}
                                        </Text>
                                      </Pressable>
                                      <Pressable
                                        style={styles.inviteButton}
                                        disabled={anyLoadingTrue || lockButton}
                                        onPress={() => createOrderData(2, item.id)}
                                      >
                                        <Text style={styles.inviteButtonText}>
                                          {loading.inviteNow ? <ActivityIndicator size="large" /> : t("accept order")}
                                        </Text>
                                      </Pressable>
                                    </View>
                                  ) : (
                                    <Pressable
                                      style={styles.inviteButton}
                                      disabled={anyLoadingTrue || lockButton}
                                      onPress={() => createOrderData(3, item.id)}
                                    >
                                      <Text style={styles.inviteButtonText}>
                                        {loading.makeRequest ? <ActivityIndicator size="large" /> : t("make a request")}
                                      </Text>
                                    </Pressable>
                                  )}
                                </View>
                              ) : (
                                <View style={styles.card}>
                                  <View style={styles.cardContent}>
                                    <View style={styles.cardLeftSection}>
                                      {item.avatorUrl ? (
                                        <Image source={{ uri: item.avatorUrl }} style={styles.cardImage} />
                                      ) : (
                                        <FontAwesome name="user" size={50} color={theme.colors.primary} style={styles.cardImage} />
                                      )}
                                      <View style={styles.cardTextContainer}>
                                        <Text style={styles.cardTitle}>
                                          {t("userName")}：{item.creatorName}
                                        </Text>
                                        <Text style={styles.cardSubtitle}>
                                          {t("start driving")}：
                                          {new Date(item.startAfter).toLocaleString("en-GB", {
                                            timeZone: "Asia/Taipei",
                                          })}
                                        </Text>
                                      </View>
                                    </View>
                                    <View style={styles.cardRightSection}>
                                      <Text style={styles.cardPrice}>${item.initPrice}</Text>
                                    </View>
                                  </View>
                                </View>
                              )}
                            </TouchableWithoutFeedback>
                          );
                        })}
                      </>
                    )}
                  </ScrollView>
                  <View style={[styles.fixedFooter, { marginBottom: insets.bottom }]}>
                    <Pressable style={styles.footerButton} onPress={() => createOrderData(1)} disabled={anyLoadingTrue || lockButton}>
                      <Text style={styles.footerButtonText}>
                        {loading.createNewOrder ? <ActivityIndicator size="large" /> : t("Build it yourself")}
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </>
          ) : (
            <BottomSheetView
              style={{
                flex: 1,
                paddingHorizontal: scale(20), // 設置水平間距
                paddingVertical: verticalScale(20), // 設置垂直間距
              }}
            >
              <View
                style={{
                  flex: autoCompleteInputOnFocus ? 0.5 : 0.1,
                }}
              >
                <GooglePlacesAutocomplete
                  placeholder={t("search starting point")}
                  textInputProps={{
                    placeholderTextColor: "#626262",
                    onFocus: () => {
                      // 當用戶聚焦輸入框時，觸發 handleSnapPress(2)
                      if (Platform.OS === "ios") handleSnapPress(3);
                      else handleSnapPress(2);
                    }, 
                    onEndEditing: () => {
                      console.log("submit text...")
                      setAutoCompleteInputOnFocus(false);
                    }, 
                    onChange: () => {
                      setAutoCompleteInputOnFocus(true);
                    }, 
                  }}
                  fetchDetails={true}
                  onPress={(data, details = null) => handleLocationPress(data, details, "origin")}
                  query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: "zh-TW",
                    components: "country:tw",
                  }}
                  onFail={(error) => {
                    console.log("GooglePlacesAutocomplete Error:", error);
                    Alert.alert("錯誤", "無法載入地點。請檢查你的 API Key。");
                  }}
                  styles={{
                    description: styles.description, 
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                    predefinedPlacesDescription: styles.predefinedPlacesDescription,
                    listView: { ...styles.listView, ...(autoCompleteInputOnFocus ? {} : { display: "none" }), }, 
                    poweredContainer: styles.poweredContainer, 
                    powered: styles.powered, 
                    row: styles.row, 
                  }}
                />
              </View>
              <View
                style={{
                  flex: autoCompleteInputOnFocus ? 0.1 : 0.5, 
                }}
              >
                <GooglePlacesAutocomplete
                  placeholder={t("search destination")}
                  textInputProps={{
                    placeholderTextColor: "#626262",
                    onFocus: () => {
                      // 當用戶聚焦輸入框時，觸發 handleSnapPress(2)
                      if (Platform.OS === "ios") handleSnapPress(3);
                      else handleSnapPress(2);
                    }, 
                    onEndEditing: () => {
                      setAutocompleteInputOnFocus2(false);
                    }, 
                    onChange: () => {
                      setAutocompleteInputOnFocus2(true);
                    }
                  }}
                  fetchDetails={true}
                  onPress={(data, details = null) => handleLocationPress(data, details, "destination")}
                  query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: "zh-TW",
                    components: "country:tw",
                  }}
                  onFail={(error) => {
                    console.log("GooglePlacesAutocomplete Error:", error);
                    Alert.alert("錯誤", "無法載入地點。請檢查你的 API Key。");
                  }}
                  styles={{
                    description: styles.description, 
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                    predefinedPlacesDescription: styles.predefinedPlacesDescription,
                    listView: { ...styles.listView, ...(autocompleteInputOnFocus2 ? {} : { display: "none" }), }, 
                    poweredContainer: styles.poweredContainer, 
                    powered: styles.powered, 
                    row: styles.row, 
                  }}
                />
              </View>
            </BottomSheetView>
          )}
        </BottomSheet>
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
};

export default MapWithBottomSheet;
