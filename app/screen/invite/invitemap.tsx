import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { View, StyleSheet, Alert, Text, Platform, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
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
import { Entypo } from "@expo/vector-icons";
import "react-native-get-random-values";
import { useNavigation, CommonActions, useRoute } from "@react-navigation/native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { z } from "zod";

const InviteMap = () => {
  const route = useRoute();
  const { orderId, orderStartAddress, orderEndAddress, orderInitPrice, orderStartAfter } = route.params as {
    orderId: string;
    orderStartAddress: string;
    orderEndAddress: string;
    orderInitPrice: number;
    orderStartAfter: string;
  };

  const parsedOrderStartAfter = new Date(orderStartAfter);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(parsedOrderStartAfter);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [initialPrice, setinitialPrice] = useState(orderInitPrice.toString());
  const [orderDescription, setorderDescription] = useState("");
  const [originAddress, setOriginAddress] = useState(orderStartAddress);
  const [destinationAddress, setDestinationAddress] = useState(orderEndAddress);
  const [region, setRegion] = useState<Region | null>(null);
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showDetailsPage, setShowDetailsPage] = useState(true); // 新增狀態用於控制是否顯示詳細資訊頁面
  const GOOGLE_MAPS_APIKEY: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string; // 正確讀取 API 金鑰
  const mapRef = useRef<MapView>(null);
  const user = useSelector((state: RootState) => state.user);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "85%"], []);
  const navigation = useNavigation();
  const [lockButton, setLockButton] = useState(false);

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
      Alert.alert("Validation Error", priceValidation.error.errors[0].message, [{ onPress: () => setLoading(false) }]);
      return false;
    }

    if (!descriptionValidation.success) {
      Alert.alert("Validation Error", descriptionValidation.error.errors[0].message, [{ onPress: () => setLoading(false) }]);
      return false;
    }

    if (!startAfterValidation.success) {
      Alert.alert("Validation Error", startAfterValidation.error.errors[0].message, [{ onPress: () => setLoading(false) }]);
      return false;
    }

    return true;
  };

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

  const updateOrderData = async () => {
    setLoading(true);

    if (!validateOrderData()) {
      return;
    }

    try {
      // 獲取 Token
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。", [{ onPress: () => setLoading(false) }]);
        return;
      }

      let endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);

      const data = {
        briefDescription: orderDescription,
        suggestPrice: initialPrice,
        startAddress: originAddress,
        endAddress: destinationAddress,
        startCordLongitude: origin?.longitude,
        startCordLatitude: origin?.latitude,
        endCordLongitude: destination?.longitude,
        endCordLatitude: destination?.latitude,
        suggestStartAfter: selectedDate,
        suggestEndedAt: endDate,
      };

      let url = "";

      if (user.role == 1) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/passengerInvite/passenger/createPassengerInviteByOrderId`;
      } else if (user.role == 2) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/ridderInvite/ridder/createRidderInviteByOrderId`;
      }

      console.log(user.role);

      // 使用獲取到的 Token 發送請求
      const response = await axios.post(url, data, {
        params: {
          orderId: orderId,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      setLockButton(true);
      console.log("Update Response:", response.data);
      setLoading(false);
      Alert.alert("成功", "送出邀請成功");
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
        mapRef.current?.animateToRegion(newRegion, 1000); // 在選擇地點後更新地圖
      } catch (error) {
        Alert.alert("無法獲取位置");
      }
    };

    getLocation();
  }, []);

  // 將 onPress 包裝為 debounced 函數
  const handleLocationPress = useCallback(
    debounce((data, details, type) => {
      if (details.geometry.location) {
        const { lat, lng } = details.geometry.location;

        if (type === "origin") {
          // 更新起始地狀態
          setOrigin({ latitude: lat, longitude: lng });
          setOriginAddress(data.description);
        } else if (type === "destination") {
          // 更新目的地狀態
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
        mapRef.current?.animateToRegion(newRegion, 1000); // 在選擇地點後更新地圖
      } else {
        Alert.alert("錯誤", "無法取得地點詳情。");
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (origin && destination) setShowDetailsPage(true);
  }, [origin, destination]);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region || undefined} // 確保在有 region 時才設置
        >
          {/* 起始位置標記 */}
          {origin && (
            <Marker
              coordinate={{
                latitude: origin.latitude,
                longitude: origin.longitude,
              }}
              title="起始位置" // "Origin"
              description="選定的起始地點" // "Selected origin"
            />
          )}
          {/* 條件渲染目的地標記 */}
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title="目的地" // "Destination"
              description="選定的位置" // "Selected location"
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
        {/* Bottom Sheet 元件 */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          keyboardBehavior="extend" // 設置鍵盤行為
          enablePanDownToClose={false}
          index={Platform.OS === "ios" ? 3 : 2} // 設置初始索引
        >
          <BottomSheetView
            style={{
              flex: 1,
              paddingHorizontal: scale(20), // 設置水平間距
              paddingVertical: verticalScale(20), // 設置垂直間距
            }}
          >
            {showDetailsPage ? (
              // 顯示目的地詳細資訊的頁面
              <View>
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
                    <Entypo name="calendar" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.bottomSheetText}>推薦價格:</Text>
                <BottomSheetTextInput
                  style={styles.input}
                  placeholder="推薦價格"
                  value={initialPrice}
                  onChangeText={setinitialPrice}
                  placeholderTextColor="gray"
                />
                <Text style={styles.bottomSheetText}>描述:</Text>
                <BottomSheetTextInput
                  style={styles.input}
                  placeholder="描述"
                  value={orderDescription}
                  onChangeText={setorderDescription}
                  placeholderTextColor="gray"
                />
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
                      setShowDetailsPage(false);
                    }}
                    disabled={loading || lockButton}
                  >
                    <Text style={styles.buttonText}>選擇地址</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button, { backgroundColor: "#228B22" }]}
                    onPress={() => updateOrderData()}
                    disabled={loading || lockButton}
                  >
                    <Text style={styles.buttonText}>{loading ? "邀請中..." : "邀請對方"}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              // 顯示搜尋欄的頁面
              <>
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
                      components: "country:tw", // 限制搜尋結果在台灣
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
                      components: "country:tw", // 限制搜尋結果在台灣
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
              </>
            )}
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
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
});

export default InviteMap;
