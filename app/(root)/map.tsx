import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../(store)/index';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import debounce from 'lodash/debounce';

const MapWithBottomSheet = () => {
  const user = useSelector((state: RootState) => state.user);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY; // 正確讀取 API 金鑰

  // Bottom Sheet 相關設置
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  useEffect(() => {
    (async () => {
      try {
        // 請求權限
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('定位權限被拒絕');
          return;
        }

        // 獲取位置
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922, // 可以根據需要調整縮放比例
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        setErrorMsg('無法獲取位置');
      }
    })();
  }, []);

  // 將 onPress 包裝為 debounced 函數
  const handlePress = useCallback(
    debounce((data, details = null) => {
      if (details?.geometry?.location) {
        const { lat, lng } = details.geometry.location;

        // 更新目的地狀態
        setDestination({ latitude: lat, longitude: lng });

        // 更新地圖區域以居中選定位置
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005, // 調整縮放級別
          longitudeDelta: 0.005,
        });
      } else {
        Alert.alert('錯誤', '無法取得地點詳情。'); // "Error", "Unable to retrieve place details."
      }
    }, 500), // 延遲 500 毫秒
    [] // 空依賴陣列，確保 debounce 不會每次渲染重新創建
  );

  const onRegionChangeComplete = (region: Region) => {
    setRegion(region);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='flex-1'>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={onRegionChangeComplete}
          showsMyLocationButton
          showsUserLocation
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="當前位置" // "Current Position"
            description="地圖中心位置" // "Center of the Map"
          />
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
        </MapView>
        {/* Bottom Sheet 元件 */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
        >
          <BottomSheetView style={[styles.bottomSheetContent, { flex: 1 }]}>
            <View style={styles.searchContainer}>
              <GooglePlacesAutocomplete
                  placeholder="Search"
                  fetchDetails={true}
                  onPress={handlePress} // 使用 debounced 函數
                  query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: 'en',
                  }}
                  onFail={(error) => {
                    console.log('GooglePlacesAutocomplete Error:', error);
                    Alert.alert('錯誤', '無法載入地點。請檢查你的 API Key。');
                  }}
                  styles={{
                    textInputContainer: styles.textInputContainer,
                    textInput: styles.textInput,
                    predefinedPlacesDescription: styles.predefinedPlacesDescription,
                  }}
                />
            </View>
            {destination ? (
              <View>
                <Text style={styles.bottomSheetTitle}>目的地資訊</Text>
                <Text>緯度: {destination.latitude}</Text>
                <Text>經度: {destination.longitude}</Text>
              </View>
            ) : (
              <Text>請搜尋並選擇一個地點。</Text>
            )}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  textInput: {
    height: 40,
    color: '#5d5d5d',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: 10,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default MapWithBottomSheet;