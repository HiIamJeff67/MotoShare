import { RootState } from '@/app/(store)';
import * as SecureStore from "expo-secure-store";
import LoadingWrapper from '@/app/component/LoadingWrapper/LoadingWrapper';
import PreferenceCard from '@/app/component/PreferenceCard/PreferenceCard';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MyPreferencesStyles } from './MyPreferences.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { SearchUserPreferencesInterface } from '@/interfaces/userPreferences.interface';
import { isExist } from '@/app/methods/isExist';
import { FlashList } from '@shopify/flash-list';
import AnimatedCheckMessage from '@/app/component/CheckMessage/AnimatedCheckMessage';
import UserDetail from '@/app/component/UserDetail/UserDetail';

const MyPreferences = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQeury] = useState("");
  const [searchResult, setSearchResult] = useState<SearchUserPreferencesInterface[]>([]);
  const [specifiedUserName, setSpecifiedUserName] = useState<string | null>(null);
  const [specifiedUserInfo, setSpecifiedUserInfo] = useState<any>(null);
  const [userNameToDelete, setUserNameToDelete] = useState<string | null>(null);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(MyPreferencesStyles(theme, insets));
    }
  }, [theme]);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    }

    fetchToken();
  }, []);

  useEffect(() => {
    getUserPreferences();
  }, [token]);

  useEffect(() => {
    getPreferenceUserDetail();
  }, [specifiedUserName]);

  const getUserPreferences = async () => {
    setIsLoading(true);
    if (token && token.length !== 0) {
      try {
        const response = await axios.get(
          user.role === "Passenger" 
            ? `${process.env.EXPO_PUBLIC_API_URL}/passengerPreferences/searchMyPaginationPreferences`
            : `${process.env.EXPO_PUBLIC_API_URL}/ridderPreferences/searchMyPaginationPreferences`, 
            {
              params: {
                preferenceUserName: searchQuery, 
                limit: 10, 
                offset: 0, 
              }, 
              headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
                Authorization: `Bearer ${token}`, 
              }
            }
        );
        console.log(response.data);
        setSearchResult(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        } else {
          console.log("An unexpected error occurred:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  const getPreferenceUserDetail = async () => {
    if (token && token.length !== 0 
      && specifiedUserName && specifiedUserName.length !== 0) {
        setIsDataLoading(true);
        try {
          const response = await axios.get(
            user.role === "Passenger"
              ? `${process.env.EXPO_PUBLIC_API_URL}/ridder/getRidderWithInfoByUserName`
              : `${process.env.EXPO_PUBLIC_API_URL}/passenger/getPassengerWithInfoByUserName`, 
            {
              params: {
                userName: specifiedUserName, 
              }, 
              headers: {
                Authorization: `Bearer ${token}`, 
              }
            }
          )
          
          console.log(response.data)
          setSpecifiedUserInfo(response.data);
        } catch (error) {
          Alert.alert("獲取用戶資料錯誤")
        } finally {
          setIsDataLoading(false);
        }
    }
  }

  const deleteUserPreferenceByUserName = async (preferenceUserName: string) => {
    setIsLoading(true);
    if (token && token.length !== 0) {
      try {
        const response = await axios.delete(
          user.role === "Passenger" 
            ? `${process.env.EXPO_PUBLIC_API_URL}/passengerPreferences/deleteMyPreferenceByUserName`
            : `${process.env.EXPO_PUBLIC_API_URL}/ridderPreferences/deleteMyPreferenceByUserName`, 
            {
              params: {
                preferenceUserName: preferenceUserName, 
              }, 
              headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
                Authorization: `Bearer ${token}`, 
              }
            }
        );

        if (response && response.status === 200) {
          setSearchResult((prev) => prev.filter(value => value.preferenceUserName !== preferenceUserName));
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        } else {
          console.log("An unexpected error occurred:", error);
        }
      } finally {
        setUserNameToDelete(null);
        setIsLoading(false);
      }
    }
  }

  return (
    isLoading || !styles || !theme
      ? <LoadingWrapper />
      : <View style={styles.container}>
          {specifiedUserName && specifiedUserName.length !== 0 && specifiedUserInfo && 
            <UserDetail 
              userInfo={specifiedUserInfo}
              isDataLoading={isDataLoading}
              onClose={() => setSpecifiedUserName(null)}
            />
          }
          <View style={styles.itemContainer}>
            <FlashList 
              data={searchResult}
              keyExtractor={(searchResult) => searchResult.preferenceUserName}
              renderItem={({ item }) => 
                <PreferenceCard 
                  iconSource={isExist(item.preferenceUserAvatorUrl) ? { uri: item.preferenceUserAvatorUrl } : require("../../../assets/images/user.png")}
                  title={item.preferenceUserName}
                  description={item.preferenceUserSelfIntroduction ?? undefined}
                  callBack={() => {
                    setSpecifiedUserName(item.preferenceUserName);
                  }}
                  status={item.isPreferenceUserOnline}
                  statusCallBack={() => setUserNameToDelete(item.preferenceUserName)}
                  theme={theme}
                  isNotColorful={!isExist(item.preferenceUserAvatorUrl)}
                />
              }
            >
            </FlashList>
            {userNameToDelete &&
              <AnimatedCheckMessage 
                title='您確定要解除此偏好關係'
                content={`您的偏好${user.role === "Passenger" ? "車主" : "乘客"} ${userNameToDelete}？`}
                theme={theme}
                leftOptionTitle='確認'
                leftOptionCallBack={() => deleteUserPreferenceByUserName(userNameToDelete)}
                rightOptionTitle='取消'
                rightOptionCallBack={() => setUserNameToDelete(null)}
              />
            }
          </View>
        </View>
  )
}

export default MyPreferences;
