import { RootState } from '@/app/(store)';
import React, { useEffect, useRef, useState } from 'react'
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, Alert, Animated, Easing, Image, Keyboard, Platform, Pressable, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ResetEmailPasswordStyles } from './ResetEmailPassenger.style';
import LoadingWrapper from '@/app/component/LoadingWrapper/LoadingWrapper';
import AnimatedEditableInput from '@/app/component/EditableInput/AnimatedEditableInput';
import { TextInput } from 'react-native-gesture-handler';
import { Text } from 'react-native';
import axios from 'axios';
import { isNotEmptyString } from '@/app/methods/isNotEmpty';
import { isAuthCode } from '@/app/methods/isAuthCode';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { hideAbsoluteLoading, showAbsoluteLoading } from '@/app/(store)/loadingSlice';
import { clearUser } from '@/app/(store)/userSlice';
import { isExist } from '@/app/methods/isExist';

const ResetEmailPassword = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const isAbsoluteLoading = useSelector((state: RootState) => state.loading.isLoading);
    const theme = user.theme;
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(0)).current;

    const [isLoading, setIsLoading] = useState(false);
    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [editableInputItems, setEditableInputItems] = useState<any[]>([]);
    const [focusedRequiresOffset, setFocusedRequiresOffset] = useState(false);
    const [styles, setStyles] = useState<any>(null);

    useEffect(() => {
        if (theme) {
            setStyles(ResetEmailPasswordStyles(theme, insets));
        }
    }, [theme]);

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await SecureStore.getItemAsync("userToken");
            setToken(userToken);
        }

        fetchToken();
        setEditableInputItems([
            {
              label: "電子郵件",
              value: user.email,
              setValue: setEmail,
              placeholder: "電子郵件",
              keyboardType: "email-address", 
              requiresKeyboardOffset: false,
              setRequiresKeyBoardOffset: setFocusedRequiresOffset, 
              isSecureText: false, 
            },
            {
              label: "舊密碼",
              value: oldPassword,
              setValue: setOldPassword,
              placeholder: "舊密碼",
              keyboardType: "default", 
              requiresKeyboardOffset: false,
              setRequiresKeyBoardOffset: setFocusedRequiresOffset, 
              isSecureText: true, 
            },
            {
              label: "新密碼",
              value: newPassword,
              setValue: setNewPassword,
              placeholder: "新密碼",
              keyboardType: "default",
              requiresKeyboardOffset: false,
              setRequiresKeyBoardOffset: setFocusedRequiresOffset, 
              isSecureText: true, 
            },
            {
              label: "確認新密碼",
              value: confirmPassword,
              setValue: setConfirmPassword,
              placeholder: "確認新密碼",
              keyboardType: "default",
              requiresKeyboardOffset: true,
              setRequiresKeyBoardOffset: setFocusedRequiresOffset, 
              isSecureText: true, 
            },
          ]);
    }, []);

    const sendAuthCodeToResetEmailOrPassword = async () => {
        if (token && token.length !== 0) {
            try {
                await axios.get(
                    user.role === "Passenger"
                        ? `${process.env.EXPO_PUBLIC_API_URL}/passengerAuth/sendAuthCodeToResetEmailOrPassword`
                        : `${process.env.EXPO_PUBLIC_API_URL}/ridderAuth/sendAuthCodeToResetEmailOrPassword`, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        }
                    }, 
                );
            } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                    console.log(error.response?.data);
                }
                Alert.alert("寄送驗證碼至此電子信箱失敗");
            }
        }
    }

    const validateAuthCodeToResetEmailOrPassword = async () => {
        const handleLogout = async () => {
            dispatch(showAbsoluteLoading());
            setIsLoading(true);
            try {
                if (token && token.length !== 0) {
                await axios.patch(
                    user.role === "Passenger"
                        ? `${process.env.EXPO_PUBLIC_API_URL}/passenger/resetAccessTokenToLogout`
                        : `${process.env.EXPO_PUBLIC_API_URL}/ridder/resetAccessTokenToLogout`, 
                    null, 
                    {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    }, 
                    }
                );
                }
        
                dispatch(clearUser());
            } catch (error) {
                if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
                }
                console.log(error);
            } finally {
                setIsLoading(false);
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "welcome" }],
                    })
                );
                dispatch(hideAbsoluteLoading());
            }
        }

        const showAlertMessage = (title: string, content: string) => {
            Alert.alert(title, content);
        }

        if (token && token.length !== 0) {
            if (newPassword.length === 0) {
                showAlertMessage("請輸入新的密碼", "新密碼欄位不能為空");
                return;
            } else if (newPassword !== confirmPassword) {
                showAlertMessage("密碼不符", "請確保新密碼與確認新密碼相同");
                return;
            }
            if (!isAuthCode(authCode)) {
                showAlertMessage("驗證碼格式錯誤", "你必須輸入正確的驗證碼才能繼續");
                return;
            }

            let data = {
                ...(email !== user.email && isNotEmptyString(email) && { email: email }), 
                ...(isNotEmptyString(oldPassword) && { oldPassword: oldPassword }), 
                ...(isNotEmptyString(newPassword) && { newPassword: newPassword }), 
                ...(isAuthCode(authCode) && { authCode: authCode }), 
            };

            setIsLoading(true);
            setIsUploadLoading(true);
            try {
                const response = await axios.post(
                    user.role === "Passenger"
                        ? `${process.env.EXPO_PUBLIC_API_URL}/passengerAuth/validateAuthCodeToResetEmailOrPassword`
                        : `${process.env.EXPO_PUBLIC_API_URL}/ridderAuth/validateAuthCodeToResetEmailOrPassword`, 
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        }
                    }, 
                );

                if (response && response.status === 200) {
                    showAlertMessage("更新信箱或密碼成功", "請重新登入");
                    handleLogout();
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    showAlertMessage(error.response?.data.case, error.response?.data.message);
                } else {
                    showAlertMessage("未知錯誤", "請聯繫我們（我的頁面 -> 回報）");
                }
            } finally {
                setIsLoading(false);
                setIsUploadLoading(false);
            }
        }
    }

    // for authCode input
    const [onFocus, setOnFocus] = useState(false);
    const handleAuthCodeInputOnFocus = () => {
        setOnFocus(true);
        setFocusedRequiresOffset(true);
    }
    const handleAuthCodeInputOnBlur = () => {
        setOnFocus(false);
        setFocusedRequiresOffset(false);
    }

    const handleSendAuthCodeButtonOnClick = async () => {
        if (countdown > 0) return;
        
        setCountdown(60);

        await sendAuthCodeToResetEmailOrPassword();

        const interval = setInterval(() => {
            setCountdown((prev) => {
                let updated = prev;
                updated -= 1;

                if (updated <= 0) {
                    clearInterval(interval);
                }

                return updated;
            });
        }, 1000);
    };

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    
        const keyboardShowListener = Keyboard.addListener(showEvent, (event) => {
          if (focusedRequiresOffset) {
            Animated.timing(translateY, {
              toValue: -event.endCoordinates.height * 0.5,
              duration: Platform.OS === "ios" ? event.duration || 200 : 200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }).start();
          }
        });
    
        const keyboardHideListener = Keyboard.addListener(hideEvent, (event) => {
          Animated.timing(translateY, {
            toValue: 0,
            duration: Platform.OS === "ios" ? event.duration || 200 : 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }).start();
        });
    
        return () => {
          keyboardShowListener.remove();
          keyboardHideListener.remove();
        };
      }, [translateY, focusedRequiresOffset]);

    return (
        isLoading || !styles || !theme 
            ? <LoadingWrapper />
            : (<Animated.View style={{ ...styles.container, ...{ transform: [{ translateY }] } }}>
                    <Animated.ScrollView 
                        contentContainerStyle={styles.innerContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                    >
                        <View style={styles.profileHeader}>
                            {user.info?.avatorUrl && user.info.avatorUrl.length !== 0
                                ? <Image style={styles.avatar} source={{ uri: user.info.avatorUrl }} />
                                : <Image style={styles.avatar} source={{ uri: "https://via.placeholder.com/100" }} />
                            }
                        </View>

                        <View style={styles.editableInputContainer}>
                            {editableInputItems && editableInputItems.map((item, index) => (
                                <AnimatedEditableInput 
                                    key={index}
                                    label={item.label} 
                                    value={item.value}
                                    setValue={item.setValue}
                                    placeholder={item.placeholder}
                                    keyboardType={item.keyboardType}
                                    theme={theme}
                                    requiresKeyboardOffset={item.requiresKeyboardOffset}
                                    setRequiresKeyBoardOffset={item.setRequiresKeyBoardOffset}
                                    isSecureText={item.isSecureText}
                                />
                            ))} 
                            <Animated.View style={styles.authCodeContainer}>
                                <Animated.Text style={styles.authCodeLabel}>驗證碼</Animated.Text>
                                <TextInput 
                                    style={{ ...styles.authCodeInput, ...(onFocus && styles.authCodeInputOnFocus) }}
                                    placeholder='驗證碼'
                                    defaultValue={authCode}
                                    onChangeText={setAuthCode}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    onFocus={handleAuthCodeInputOnFocus}
                                    onBlur={handleAuthCodeInputOnBlur}
                                />
                                <TouchableOpacity 
                                    style={{ ...styles.sendAuthCodeButton, ...(countdown > 0 && styles.sendAuthCodeButtonDisable) }} 
                                    onPress={handleSendAuthCodeButtonOnClick} 
                                    disabled={countdown > 0}
                                >
                                    <Animated.Text style={styles.sendAuthCodeButtonTitle}>{countdown > 0 ? countdown : `發送驗證碼`}</Animated.Text>
                                </TouchableOpacity>
                                {countdown > 0 && <Text style={styles.sendAuthCodeButtonExtra}>{`＊已發送驗證信至: ${user.email}`}</Text>}
                            </Animated.View>

                            <TouchableOpacity 
                                style={styles.saveButton} 
                                disabled={isLoading || isUploadLoading}
                                onPress={validateAuthCodeToResetEmailOrPassword}
                            >
                                <Text style={styles.saveButtonTitle}>
                                    {isUploadLoading ? <ActivityIndicator size="large" /> : "儲存變更"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.ScrollView>
               </Animated.View>)
    )
}

export default ResetEmailPassword;