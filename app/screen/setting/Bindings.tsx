import React, { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";
import { Alert, ScrollView, View } from 'react-native';
import { BindingsStyles } from './Bindings.style';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/(store)';
import LoadingWrapper from '@/app/component/LoadingWrapper/LoadingWrapper';
import AppInfoCard from '@/app/component/AppInfoCard/AppInfoCard';
import AnimatedInputMessage from '@/app/component/InputMessage/AnimatedInputMessage';
import axios from 'axios';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { setUserAuths } from '@/app/(store)/userSlice';
import { isAuthCode } from '@/app/methods/isAuthCode';

export type ValidateOptionNameInterface = 
  "MotoShare" |
  "Email"     |
  "Phone"     |
  "Google"    ;

const Bindings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL, 
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [lockButton, setLockButton] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [validateOptionName, setValidateOptionName] = useState<ValidateOptionNameInterface | null>(null);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isLoading) {
      navigation.setOptions({
        gestureEnabled: false,
      });

      unsubscribe = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      if (lockButton) {
        navigation.setOptions({
          gestureEnabled: true,
        });
        if (unsubscribe) {
          unsubscribe();
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "welcome" }],
          })
        );
      }
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoading, navigation]);

  useEffect(() => {
    if (theme) {
      setStyles(BindingsStyles(theme));
    }
  }, [theme]);

  useEffect(() => {
    const fetchToken = async() => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    }

    fetchToken();
  }, []);

  const handleBindDefaultAuthentication = async (inputValues: string[]) => {
    const showAlertMessage = (title: string, content: string) => {
      Alert.alert(
        title,
        content,
        [
          {
            text: "確認",
            onPress: () => {},
            style: "cancel", 
          },
        ],
        { cancelable: true }
      );
    }

    setIsLoading(true);
    setLockButton(true);
    inputValues = inputValues.filter(value => value);
    const [email, password] = [inputValues[0], inputValues[1]];
    if (token && token.length !== 0) {
      try {
        const response = await api.put(
          user.role === "Passenger" ? "/passengerAuth/bindDefaultAuth" : "/ridderAuth/bindDefaultAuth", 
          { email: email, password: password },
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            }
          }
        )
        
        if (response.status === 200) {
          dispatch(setUserAuths({ isDefaultAuthenticated: true }));
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data); // 檢查伺服器回應
          showAlertMessage("綁定錯誤", error.response?.data);
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsLoading(false);
        setLockButton(false);
        setValidateOptionName(null);
      }
    }
  }

  const handleSendAuthCodeForEmailAuthentication = async () => {
    if (token && token.length !== 0) {
      try {
        await api.get(
          user.role === "Passenger" ? "/passengerAuth/sendAuthCodeForEmail" : "/ridderAuth/sendAuthCodeForEmail", 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            }
          }
        );
      } catch (error) {
        console.log(error);
        Alert.alert("寄送驗證碼至此電子信箱失敗");
      }
    }
  }

  const handleValidateAuthCodeForEmailAuthentication = async (inputValues: string[]) => {
    const showAlertMessage = () => {
      Alert.alert(
        "驗證碼錯誤",
        "你必須輸入正確的驗證碼才能繼續",
        [
          {
            text: "確認",
            onPress: () => {},
            style: "cancel", 
          },
        ],
        { cancelable: true }
      );
    }

    setIsLoading(true);
    setLockButton(true);
    const authCode = inputValues.filter(value => value)[0];
    if (!isAuthCode(authCode)) showAlertMessage();
    
    if (token && token.length !== 0) {
      try {
          const response = await api.post(
            user.role === "Passenger" ? "/passengerAuth/validateAuthCodeForEmail" : "/ridderAuth/validateAuthCodeForEmail", 
            { authCode: authCode },
            {
              headers: {
                Authorization: `Bearer ${token}`, 
              }
            }
          )

          if (response.status === 200) {
            dispatch(setUserAuths({ isEmailAuthenticated: true }));
          }
      } catch (error) {
        console.log(error);
        showAlertMessage();
      } finally {
        setIsLoading(false);
        setLockButton(false);
        setValidateOptionName(null);
      }
    }
  }



  return (
    isLoading || !styles || !theme || !user.auth
      ? <LoadingWrapper />
      : <ScrollView>
          <View style={styles.container}>
            <AppInfoCard 
              iconSource={require('../../../assets/images/motorbike.jpg')}
              title='MotoShare（預設）'
              description='提供您的Email以及Password來綁定我們軟體內的預設的帳戶，之後可透過這些資訊登入。'
              status={user.auth.isDefaultAuthenticated}
              callBack={() => setValidateOptionName("MotoShare")}
              isOpaqued={user.auth.isDefaultAuthenticated}
              theme={theme}
            />
            {validateOptionName === "MotoShare" && 
              <AnimatedInputMessage 
                title='綁定MotoShare（預設）'
                content='如果之前使用的註冊或綁定方式有提供給我們Email，你也可以選擇保留並繼續使用該Email。'
                theme={theme}
                inputAttributes={[
                  { 
                    placeholder: '電子郵件', 
                    isSecureText: false, 
                    defaultValue: user.email,  
                  }, 
                  { 
                    placeholder: '密碼', 
                    isSecureText: true 
                  }
                ]}
                leftOptionTitle='綁定'
                leftOptionCallBack={handleBindDefaultAuthentication}
                rightOptionTitle='取消'
                rightOptionCallBack={() => setValidateOptionName(null)}
              />
            }
            <AppInfoCard 
              iconSource={require('../../../assets/images/email.png')}
              title='電子郵件'
              description='請驗證您的Email來讓我們確認您的身份，透過這項驗證您才能在訂單完成後給予評價或是星級。'
              status={user.auth.isEmailAuthenticated}
              callBack={() => setValidateOptionName("Email")}
              isOpaqued={user.auth.isEmailAuthenticated}
              theme={theme}
              isNotColorful={true}
            />
            {validateOptionName === "Email" && 
              <AnimatedInputMessage 
                title='驗證電子郵件'
                content={`這項舉動會發送一封帶有驗證碼的信到您目前的電子信箱(${user.email})，請在收到驗證碼之後輸入至下方並送出以讓我們知道是你。`}
                theme={theme}
                inputAttributes={[{ 
                  placeholder: '驗證碼', 
                  isSecureText: false, 
                  inputSideButton: { 
                    title: '發送驗證信', 
                    callback: handleSendAuthCodeForEmailAuthentication, 
                  } 
                }]}
                leftOptionTitle='驗證'
                leftOptionCallBack={handleValidateAuthCodeForEmailAuthentication}
                rightOptionTitle='發送驗證碼'
                rightOptionCallBack={() => setValidateOptionName(null)}
              />
            }
            <AppInfoCard 
              iconSource={require('../../../assets/images/phone-call.png')}
              title='電話號碼'
              description='請驗證您的電話號碼來讓我們確認您的身份，這雖然不會直接影響你的使用體驗，但是可以讓其他使用者更信任您。'
              status={user.auth.isPhoneAuthenticated}
              callBack={() => setValidateOptionName("Phone")}
              isOpaqued={user.auth.isPhoneAuthenticated}
              theme={theme}
              isNotColorful={true}
            />
            {validateOptionName === "Phone" && 
              <AnimatedInputMessage 
                title='驗證電話號碼'
                content='請輸入一個台灣的電話號碼（09XX-XXX-XXX)，您不需要輸入任何地區的電話開頭。'
                theme={theme}
                inputAttributes={[{
                  placeholder: '電話號碼(+886)', 
                  isSecureText: false, 
                  inputSideButton: {
                    title: '發送驗證碼', 
                    callback: () => {}, 
                  }, 
                }]}
                leftOptionTitle='驗證'
                leftOptionCallBack={() => {}}
                rightOptionTitle='取消'
                rightOptionCallBack={() => setValidateOptionName(null)}
              />
            }
            <AppInfoCard 
              iconSource={require('../../../assets/images/google.png')}
              title='Google'
              description='綁定您的Google帳戶，之後登入就可以透過Google快速登入。'
              status={user.auth.isGoogleAuthenticated}
              callBack={() => setValidateOptionName("Google")}
              isOpaqued={user.auth.isGoogleAuthenticated}
              theme={theme}
            />
          </View>
        </ScrollView>
  )
}

export default Bindings;