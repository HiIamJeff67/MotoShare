import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  Alert,
  Platform,
  Keyboard,
  View,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../(store)";

import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import AnimatedEditableInput, { AnimatedEditableInputProps } from "@/app/component/EditableInput/AnimatedEditableInput";
import { isExist } from "@/app/methods/isExist";
import { isNotEmptyString } from "@/app/methods/isNotEmpty";
import { getUserInfo } from "@/app/methods/getUserInfo";
import { UserRoleType } from "@/app/(store)/interfaces/userState.interface";
import { SAFE_MAX_FILE_SIZE } from "@/app/constants/maxFileSize";
import { getFormDataTotalSize } from "@/app/methods/getFormDataSize";
import { EditProfileStyles } from "./EditProfile.style";

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selfIntroduction, setSelfIntroduction] = useState("");
  const [age, setAge] = useState("");
  const [avatorUrl, setAvatorUrl] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");
  const [token, setToken] = useState<string | null>(null);
  
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [editableInputItems, setEditableInputItems] = useState<any[]>([]);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedRequiresOffset, setFocusedRequiresOffset] = useState(false);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(EditProfileStyles(theme, insets));
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
    if (token) {
      getProfileData();
    }
  }, [token]);

  const getProfileData = async () => {
    setIsLoading(true);
    try {
      if (!token || token.length === 0) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
        return;
      }

      const newUserName = user.userName ?? "";
      const newEmail = user.email ?? "";
      const newPhoneNumber = user.info?.phoneNumber ?? "";
      const newselfIntroduction = user.info?.selfIntroduction ?? "";
      const newAge = String(user.info?.age ?? "");
      const newAvatorUrl = user.info?.avatorUrl ?? "";
      const newEmergencyPhoneNumber = user.info?.emergencyPhoneNumber ?? "";

      setUserName(newUserName);
      setEmail(newEmail);
      setPhoneNumber(newPhoneNumber);
      setSelfIntroduction(newselfIntroduction);
      setAge(newAge);
      setAvatorUrl(newAvatorUrl);
      setEmergencyPhoneNumber(newEmergencyPhoneNumber);

      setEditableInputItems([
        {
          label: "使用者名稱",
          value: newUserName,
          setValue: setUserName,
          placeholder: "使用者名稱",
          keyboardType: "default", 
          requiresKeyboardOffset: false,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        },
        {
          label: "電子郵件",
          value: newEmail,
          setValue: setEmail,
          placeholder: "電子郵件",
          keyboardType: "email-address", 
          requiresKeyboardOffset: false,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset, 
          editable: false, 
        },
        {
          label: "手機號碼",
          value: newPhoneNumber,
          setValue: setPhoneNumber,
          placeholder: "手機號碼",
          keyboardType: "phone-pad", 
          requiresKeyboardOffset: false,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        },
        {
          label: "年齡",
          value: newAge,
          setValue: setAge,
          placeholder: "年齡",
          keyboardType: "number-pad",
          requiresKeyboardOffset: true,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        },
        {
          label: "自我介紹",
          value: newselfIntroduction,
          setValue: setSelfIntroduction,
          placeholder: "自我介紹",
          keyboardType: "default",
          requiresKeyboardOffset: true,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        },
        {
          label: "緊急聯絡人電話號碼",
          value: newEmergencyPhoneNumber,
          setValue: setEmergencyPhoneNumber,
          placeholder: "緊急聯絡人電話號碼",
          keyboardType: "phone-pad", 
          requiresKeyboardOffset: true,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        }
      ]);

    } catch (error) {
      console.error("Error fetching profile data:", error);
      Alert.alert("錯誤", "獲取個人資料時發生錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    
    if (!result.canceled) {
      console.log(result.assets[0]);
      if (result.assets[0].fileSize && result.assets[0].fileSize > SAFE_MAX_FILE_SIZE) {
        Alert.alert("檔案錯誤", "您上傳的檔案太大，請重新選擇。");
        return;
      }
      setUploadedImage(result.assets[0]);
      setAvatorUrl(result.assets[0].uri);
    }
  };

  const uploadUpdatedUserInfo = async () => {
    console.log(
      "uploading: ", {
        userName, 
        email, 
        phoneNumber, 
        age, 
        selfIntroduction, 
        emergencyPhoneNumber, 
        avatorUrl, 
    });

    const showAlertMessage = (title: string, content?: string) => {
      Alert.alert(title, content, [ { onPress: () => setIsUploadLoading(false) } ]);
    }

    setIsUploadLoading(true);
    const formData = new FormData();
    // Check and append the userInfo to the formData as a request body
    if (isExist(uploadedImage)) {
      formData.append("avatorFile", {
        uri: avatorUrl, 
        name: `avatar.${avatorUrl.split('.')[avatorUrl.length - 1]}`, 
        type: uploadedImage.mimeType, 
      } as any);
    }
    if (isExist(email) && isNotEmptyString(email) && email !== user.email) {
      formData.append("email", email);
    }
    if (isExist(phoneNumber) && isNotEmptyString(phoneNumber) && phoneNumber !== user.info?.phoneNumber) {
      formData.append("phoneNumber", phoneNumber);
    }
    if (isExist(age) && isNotEmptyString(age) && age !== user.info?.age) {
      formData.append("age", age);
    }
    if (isExist(selfIntroduction) && isNotEmptyString(selfIntroduction) && selfIntroduction !== user.info?.selfIntroduction) {
      formData.append("selfIntroduction", selfIntroduction);
    }
    if (isExist(emergencyPhoneNumber) && isNotEmptyString(emergencyPhoneNumber) && emergencyPhoneNumber !== user.info?.emergencyPhoneNumber) {
      formData.append("emergencyPhoneNumber", emergencyPhoneNumber);
    }

    if (getFormDataTotalSize(formData) > SAFE_MAX_FILE_SIZE) {
      Alert.alert("檔案錯誤", "您上傳的檔案太大，請重新選擇。");
      return;
    }

    try {
      let isUserNameUpdated = false, isUserInfoUpdated = false;
      if (isExist(userName) && isNotEmptyString(userName) && userName !== user.userName) {
        const updateUserNameresponse = await axios.patch(
          user.role === "Passenger"
          ? `${process.env.EXPO_PUBLIC_API_URL}/passenger/updateMe`
          : `${process.env.EXPO_PUBLIC_API_URL}/ridder/updateMe`, 
          {
            userName: userName, 
          }, 
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", 
              Authorization: `Bearer ${token}`, 
            }
          }
        )

        if (!updateUserNameresponse || updateUserNameresponse.status !== 200) {
          console.log("\n\nError: ", updateUserNameresponse.data);
          showAlertMessage(
            JSON.stringify(updateUserNameresponse?.data.case), 
            JSON.stringify(updateUserNameresponse?.data.message)
          );
          return;
        }
        isUserNameUpdated = true;
      }

      const response = await axios.patch(
        user.role === "Passenger" 
          ? `${process.env.EXPO_PUBLIC_API_URL}/passenger/updateMyInfo`
          : `${process.env.EXPO_PUBLIC_API_URL}/ridder/updateMyInfo`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (!response || response.status !== 200) {
        console.log("response: ", response);
        showAlertMessage(
          JSON.stringify(response?.data.case), 
          JSON.stringify(response?.data.message)
        );
      } else {
        isUserInfoUpdated = true;
        showAlertMessage(
          "更新個人資料成功", 
        );
      }
      if (token && (isUserNameUpdated || isUserInfoUpdated)) {
        console.log("running getUserInfo...");
        await getUserInfo(token, user.role as UserRoleType, dispatch, true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
        if (error.response?.data.code === "413") {
          showAlertMessage(
            JSON.stringify("檔案錯誤"), 
            JSON.stringify("您上傳的檔案太的，請重新選擇")
          );
        }
        showAlertMessage(
          JSON.stringify(error.response?.data.case), 
          JSON.stringify(error.response?.data.message)
        );
      } else {
        showAlertMessage(
          "An unexpected error occurred", 
          JSON.stringify(error), 
        )
      }
    } finally {
      setIsUploadLoading(false);
    }
  }

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, (event) => {
      if (focusedRequiresOffset) {
        Animated.timing(translateY, {
          toValue: -event.endCoordinates.height * 0.8,
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
              <Pressable style={styles.profileHeader} onPress={pickImage}>
                {avatorUrl && avatorUrl.length !== 0
                  ? <Image style={styles.avatar} source={{ uri: avatorUrl }} />
                  : <Image style={styles.avatar} source={{ uri: "https://via.placeholder.com/100" }} />
                }
                <View style={styles.editAvatarButton}>
                  <Image style={styles.cameraIcon} source={require("../../../assets/images/dslr-camera.png")}/>
                </View>
              </Pressable>

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
                    editable={item.editable}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={uploadUpdatedUserInfo} disabled={isLoading || isUploadLoading}>
                <Text style={styles.saveButtonTitle}>
                  {isUploadLoading ? <ActivityIndicator size="large" /> : "儲存變更"}
                </Text>
              </TouchableOpacity>
            </Animated.ScrollView>
          </Animated.View>)
  );
};

export default EditProfile;
