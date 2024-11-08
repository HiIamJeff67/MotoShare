import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../(store)/index';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const UserInfo = () => {
  const user = useSelector((state: RootState) => state.user);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg('無法獲取位置');
      }
    })();
  }, []);

  return (
    <SafeAreaView>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            showsUserLocation
            showsMyLocationButton
            region={{
              latitude: location?.coords.latitude || 37.78825,
              longitude: location?.coords.longitude || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
          </MapView>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  info: {
    fontSize: 20,
    paddingBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default UserInfo;
