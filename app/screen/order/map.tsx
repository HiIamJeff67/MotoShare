import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/";
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
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  const [dropdownValue, setDropdownValue] = useState<string | null>("1");
  const [isDropdownFocus, setIsDropdownFocus] = useState(false);
  const GOOGLE_MAPS_APIKEY: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string;
  const mapRef = useRef<MapView>(null);
  const user = useSelector((state: RootState) => state.user);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [snapPoints, setSnapPoints] = useState(["25%", "50%", "85%"]); // 初始高度
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const anyLoadingTrue = Object.values(loading).some((value) => value === true);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true);
  const toggleSwitch = () => setIsSwitchEnabled((previousState) => !previousState);

  const toggleLoading = (key: string, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

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

      if (lockButton && showSearchOrderPage) {
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

      if (user.role == 2) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/searchBetterFirstPurchaseOrders`;
      } else if (user.role == 1) {
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
            },
          },
        ]);
        return;
      }

      let endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);

      const data = {
        startAddress: originAddress,
        endAddress: destinationAddress,
        startCordLongitude: origin?.longitude,
        startCordLatitude: origin?.latitude,
        endCordLongitude: destination?.longitude,
        endCordLatitude: destination?.latitude,
        ...(type === 1 && {
          description: orderDescription,
          initPrice: initialPrice,
          startAfter: selectedDate,
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
      };

      let url = "";
      let params = null;

      if (type === 1) {
        if (user.role == 1) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/createPurchaseOrder`;
        } else if (user.role == 2) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/supplyOrder/createSupplyOrder`;
        }
      } else if (type === 2) {
        if (user.role == 2) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/startPurchaseOrderWithoutInvite`;
        } else if (user.role == 1) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/SupplyOrder/startSupplyOrderWithoutInvite`;
        }

        params = {
          id: orderId,
        };
      } else if (type === 3) {
        if (user.role == 1) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/passenger/createPassengerInviteByOrderId`;
        } else if (user.role == 2) {
          url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/ridder/createRidderInviteByOrderId`;
        }

        params = {
          orderId: orderId,
        };
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
      setLockButton(true);
      Alert.alert("成功", "送出訂單成功");
      //console.log("Update Response:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [
          {
            onPress: () => {
              toggleLoading("createNewOrder", false);
              toggleLoading("inviteNow", false);
              toggleLoading("makeRequest", false);
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
    { label: "相似路徑", value: "1" },
    { label: "相似時間", value: "2" },
  ];

  return (
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
          keyboardBehavior="extend" // 設置鍵盤行為
          enablePanDownToClose={false}
          enableHandlePanningGesture={true}
          enableContentPanningGesture={true}
          index={Platform.OS === "ios" ? 2 : 1} // 設置初始索引
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
                  <Text style={styles.bottomSheetTitle}>地址詳細資訊</Text>
                  <Text style={styles.bottomSheetText}>起始位置: {originAddress}</Text>
                  <Text style={styles.bottomSheetText}>目的地址: {destinationAddress}</Text>
                  <View style={styles.dateContainer}>
                    <Text style={styles.bottomSheetText}>開始時間：</Text>
                    <Text style={styles.bottomSheetText}>
                      {selectedDate
                        ? selectedDate.toLocaleString("en-GB", {
                            timeZone: "Asia/Taipei",
                          })
                        : "未選擇日期"}
                    </Text>
                    <TouchableOpacity style={styles.bottomSheetDate} onPress={() => showDatePicker()}>
                      <Entypo name="calendar" size={moderateScale(24)} color="black" />
                    </TouchableOpacity>
                  </View>
                  <BottomSheetTextInput
                    style={styles.input}
                    placeholder="初始價格"
                    value={initialPrice}
                    onChangeText={setinitialPrice}
                    placeholderTextColor="gray"
                  />
                  <BottomSheetTextInput
                    style={styles.input}
                    placeholder="訂單描述"
                    value={orderDescription}
                    onChangeText={setorderDescription}
                    placeholderTextColor="gray"
                  />
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={isSwitchEnabled ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isSwitchEnabled}
                    />
                    <Text style={styles.bottomSheetText}>可直接開始</Text>
                  </View>
                  <DateTimePickerModal
                    date={selectedDate}
                    mode="datetime"
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
                      disabled={loading.fetchData}
                    >
                      <Text style={styles.buttonText}>返回</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, { backgroundColor: "#228B22" }]}
                      onPress={() => {
                        searchOrderData("1");
                      }}
                      disabled={loading.fetchData}
                    >
                      <Text style={styles.buttonText}>{loading.fetchData ? <ActivityIndicator size="large" /> : "搜尋訂單"}</Text>
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
                        style={[styles.dropdown, isDropdownFocus && { borderColor: "blue" }]}
                        selectedTextStyle={styles.dropdownselectedTextStyle}
                        placeholderStyle={styles.dropdownplaceholderStyle}
                        containerStyle={styles.dropdowncontainerStyle}
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
                          <AntDesign style={styles.dropdownicon} color={isDropdownFocus ? "blue" : "black"} name="Safety" size={20} />
                        )}
                      />
                    </View>

                    {loading.fetchData ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="black" />
                      </View>
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
                                      <FontAwesome name="user" size={50} color="black" />
                                    )}
                                  </View>

                                  <View style={styles.cardContent}>
                                    <View style={styles.cardLeftSection}>
                                      <View style={styles.cardTextContainer}>
                                        <Text style={styles.cardTitle}>使用者：{item.creatorName}</Text>
                                        <Text style={styles.cardSubtitle}>出發地：{item.startAddress}</Text>
                                        <Text style={styles.cardSubtitle}>目的地：{item.endAddress}</Text>
                                        <Text style={styles.cardSubtitle}>
                                          開車時間：
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
                                          {loading.makeRequest ? <ActivityIndicator size="large" /> : "提出要求"}
                                        </Text>
                                      </Pressable>
                                      <Pressable
                                        style={styles.inviteButton}
                                        disabled={anyLoadingTrue || lockButton}
                                        onPress={() => createOrderData(2, item.id)}
                                      >
                                        <Text style={styles.inviteButtonText}>
                                          {loading.inviteNow ? <ActivityIndicator size="large" /> : "接受訂單"}
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
                                        {loading.makeRequest ? <ActivityIndicator size="large" /> : "提出要求"}
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
                                        <FontAwesome name="user" size={50} color="black" style={styles.cardImage} />
                                      )}
                                      <View style={styles.cardTextContainer}>
                                        <Text style={styles.cardTitle}>使用者：{item.creatorName}</Text>
                                        <Text style={styles.cardSubtitle}>
                                          開車時間：
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
                      <Text style={styles.footerButtonText}>{loading.createNewOrder ? <ActivityIndicator size="large" /> : "自行建立"}</Text>
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
                  flex: 0.3,
                }}
              >
                <GooglePlacesAutocomplete
                  placeholder="搜尋起始位置"
                  textInputProps={{
                    placeholderTextColor: "#626262",
                    onFocus: () => (Platform.OS === "ios" ? handleSnapPress(3) : handleSnapPress(2)), // 當用戶聚焦輸入框時，觸發 handleSnapPress(2)
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
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                    predefinedPlacesDescription: styles.predefinedPlacesDescription,
                    listView: styles.listView,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.3,
                }}
              >
                <GooglePlacesAutocomplete
                  placeholder="搜尋目的地"
                  textInputProps={{
                    placeholderTextColor: "#626262",
                    onFocus: () => (Platform.OS === "ios" ? handleSnapPress(3) : handleSnapPress(2)), // 當用戶聚焦輸入框時，觸發 handleSnapPress(2)
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
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                    predefinedPlacesDescription: styles.predefinedPlacesDescription,
                    listView: styles.listView,
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textInputContainer: {
    zIndex: 1,
  },
  textInput: {
    height: verticalScale(40),
    color: "#5d5d5d",
    fontSize: moderateScale(16),
    backgroundColor: "#f1f4ff",
    borderRadius: moderateScale(10),
    paddingLeft: scale(10),
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  listView: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(5),
    elevation: 5,
    marginBottom: verticalScale(10),
  },
  bottomSheetTitle: {
    fontSize: moderateScale(25),
    fontWeight: "bold",
  },
  bottomSheetText: {
    fontSize: moderateScale(15),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  bottomSheetDate: {
    fontSize: moderateScale(15),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    marginLeft: scale(5),
  },
  input: {
    height: verticalScale(40),
    borderColor: "#ccc",
    borderWidth: scale(1),
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(10),
    marginBottom: verticalScale(10),
    backgroundColor: "#fff",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    height: verticalScale(40),
    width: scale(120),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(5),
    elevation: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  dropdowncontainer: {
    width: "50%",
    marginBlock: verticalScale(10),
  },
  dropdown: {
    height: verticalScale(40),
    borderColor: "gray",
    borderWidth: scale(0.5),
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(8),
  },
  dropdownicon: {
    marginRight: scale(5),
  },
  dropdownplaceholderStyle: {
    fontSize: moderateScale(16),
  },
  dropdownselectedTextStyle: {
    fontSize: moderateScale(16),
  },
  dropdowniconStyle: {
    width: scale(20),
    height: verticalScale(20),
  },
  dropdowncontainerStyle: {
    top: -verticalScale(70),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: verticalScale(80),
    marginVertical: verticalScale(1),
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
  },
  activeCard: {
    alignItems: "center",
    height: "auto",
    marginVertical: verticalScale(1),
    padding: moderateScale(15),
    borderWidth: scale(2),
    borderRadius: moderateScale(10),
  },
  cardText: {
    fontSize: scale(16),
    color: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  cardLeftSection: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "cover",
    marginRight: scale(10),
  },
  activeCardImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "cover",
  },
  cardImageContainer: {
    flexDirection: "column",
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardTextContainer: {
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#000",
  },
  cardSubtitle: {
    fontSize: moderateScale(14),
    color: "#6D6D6D",
    marginTop: verticalScale(5),
  },
  cardRightSection: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cardPrice: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#000",
  },
  fixedFooter: {
    paddingHorizontal: scale(20),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  footerButton: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    height: verticalScale(50),
    width: "100%",
    backgroundColor: "#000",
    borderRadius: scale(5),
    alignItems: "center",
    justifyContent: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  inviteButton: {
    marginTop: verticalScale(10),
    height: verticalScale(40),
    width: "45%",
    backgroundColor: "#000",
    borderRadius: scale(5),
    alignItems: "center",
    justifyContent: "center",
  },
  inviteButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});

export default MapWithBottomSheet;
