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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
          label: t("userName"),
          value: newUserName,
          setValue: setUserName,
          placeholder: t("userName"),
          keyboardType: "default", 
          requiresKeyboardOffset: false,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        },
        {
          label: t("email"),
          value: newEmail,
          setValue: setEmail,
          placeholder: t("email"),
          keyboardType: "email-address", 
          requiresKeyboardOffset: false,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset, 
          editable: false, 
        },
        {
          label: t("phone number"),
          value: newPhoneNumber,
          setValue: setPhoneNumber,
          placeholder: t("phone number"),
          keyboardType: "phone-pad", 
          requiresKeyboardOffset: false,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        },
        {
          label: t("Age"),
          value: newAge,
          setValue: setAge,
          placeholder: t("Age"),
          keyboardType: "number-pad",
          requiresKeyboardOffset: true,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        },
        {
          label: t("introduction yourself"),
          value: newselfIntroduction,
          setValue: setSelfIntroduction,
          placeholder: t("introduction yourself"),
          keyboardType: "default",
          requiresKeyboardOffset: true,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        },
        {
          label: t("Emergency contact phone number"),
          value: newEmergencyPhoneNumber,
          setValue: setEmergencyPhoneNumber,
          placeholder: t("Emergency contact phone number"),
          keyboardType: "phone-pad", 
          requiresKeyboardOffset: true,
          setRequiresKeyBoardOffset: setFocusedRequiresOffset
        }
      ]);

    } catch (error) {
      console.error("Error fetching profile data:", error);
      Alert.alert(t("error"), t("Error retrieving profile"));
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
        Alert.alert(t("file error"), t("The file you uploaded is too large"));
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
      Alert.alert(t("file error"), t("The file you uploaded is too large"));
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
          t("successfully update profile"), 
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
            JSON.stringify(t("file error")), 
            JSON.stringify(t("The file you uploaded is too large"))
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
                  {isUploadLoading ? <ActivityIndicator size="large" /> : t("Save changes")}
                </Text>
              </TouchableOpacity>
            </Animated.ScrollView>
          </Animated.View>)
  );
};

export default EditProfile;
