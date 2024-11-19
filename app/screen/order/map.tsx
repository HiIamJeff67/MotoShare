import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)/";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import debounce from "lodash/debounce";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Entypo } from "@expo/vector-icons";
import 'react-native-get-random-values';
import { useNavigation, CommonActions } from '@react-navigation/native';

const MapWithBottomSheet = () => {
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
  const [showDetailsPage, setShowDetailsPage] = useState<boolean>(false); // 新增狀態用於控制是否顯示詳細資訊頁面
  const GOOGLE_MAPS_APIKEY: string = process.env.EXPO_PUBLIC_GOOGLE_API_KEY as string; // 正確讀取 API 金鑰
  const mapRef = useRef<MapView>(null);
  const user = useSelector((state: RootState) => state.user);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const navigation = useNavigation();

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

  const dismissKeyboard = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  const updateOrderData = async () => {
    try {
      // 獲取 Token
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
        return;
      }
      
      let endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);

      const data = {
        description: orderDescription,
        startAddress: originAddress,
        endAddress: destinationAddress,
        initPrice: initialPrice,
        startCordLongitude: origin?.longitude,
        startCordLatitude: origin?.latitude,
        endCordLongitude: destination?.longitude,
        endCordLatitude: destination?.latitude,
        startAfter: selectedDate,
        endedAt: endDate,
        isUrgent: false,
      };

      let url = "";

      if (user.role == 1) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/purchaseOrder/createPurchaseOrder`;
      } else if (user.role == 2) {
        url = `${process.env.EXPO_PUBLIC_API_URL}/SupplyOrder/createSupplyOrder`;
      }

      // 使用獲取到的 Token 發送請求
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Update Response:", response.data);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'home' }],
        })
      );
      Alert.alert("成功", "送出訂單成功");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message));
      } else {
        console.log("An unexpected error occurred:", error);
        Alert.alert("錯誤", "伺服器錯誤");
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeAreaView className="flex-1">
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
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`
                  );
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
          <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
            <BottomSheetView style={[styles.bottomSheetContent, { flex: 1 }]}>
              {showDetailsPage ? (
                // 顯示目的地詳細資訊的頁面
                <View>
                  <Text style={styles.bottomSheetTitle}>地址詳細資訊</Text>
                  <View className= "h-5"/>
                  {origin && destination && (
                    <>
                      <Text style={styles.bottomSheetText}>起始位置: {originAddress}</Text>
                      <Text style={styles.bottomSheetText}>目的地址: {destinationAddress}</Text>
                      <View className="flex-row items-center">
                        <Text style={styles.bottomSheetText}>開始時間：</Text>
                        <Text style={styles.bottomSheetText}>
                          {selectedDate
                            ? selectedDate.toLocaleString('en-GB', {
                                timeZone: "Asia/Taipei",
                              })
                            : "未選擇日期"}
                        </Text>
                        <TouchableOpacity style={styles.bottomSheetDate} onPress={() => showDatePicker()}>
                          <Entypo name="calendar" size={24} color="black" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="初始價格"
                        value={initialPrice}
                        onChangeText={setinitialPrice}
                        placeholderTextColor="gray"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="訂單描述"
                        value={orderDescription}
                        onChangeText={setorderDescription}
                        placeholderTextColor="gray"
                      />
                    </>
                  )}
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
                  <View className="flex flex-row justify-center items-center">
                    <Pressable
                      style={{
                        height: 50,
                        width: 150,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#3498db",
                        marginRight: 60,
                      }}
                      className="rounded-full shadow-lg"
                      onPress={() => {
                        setOrigin(null);
                        setDestination(null);
                        setShowDetailsPage(false);
                      }}
                    >
                      <Text className="font-semibold text-lg">返回</Text>
                    </Pressable>
                    <View className="h-5"/>
                    <Pressable
                      style={{
                        height: 50,
                        width: 150,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#228B22",
                      }}
                      className="rounded-full shadow-lg"
                      onPress={() => updateOrderData()}
                    >
                      <Text className="font-semibold text-lg">送出訂單</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                // 顯示搜尋欄的頁面
                <>
                  <View style={styles.searchContainer}>
                    <GooglePlacesAutocomplete
                      placeholder="搜尋起始位置"
                      fetchDetails={true}
                      onPress={(data, details = null) => handleLocationPress(data, details, "origin")} // 使用 debounced 函數
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
                  <View style={styles.searchContainer}>
                    <GooglePlacesAutocomplete
                      placeholder="搜尋目的地"
                      fetchDetails={true}
                      onPress={(data, details = null) => handleLocationPress(data, details, "destination")} // 使用 debounced 函數
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
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    flex: 0.3,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  textInputContainer: {
    zIndex: 1,
  },
  textInput: {
    height: 50,
    color: "#5d5d5d",
    fontSize: 16,
    backgroundColor: "#f1f4ff",
    borderRadius: 10,
    paddingLeft: 10,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
  listView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginHorizontal: 10,
    elevation: 2,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
  bottomSheetText: {
    fontSize: 15,
    marginBottom: 15,
  },
  bottomSheetDate: {
    fontSize: 15,
    marginBottom: 15,
    marginLeft: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
});

export default MapWithBottomSheet;
