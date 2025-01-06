import React, { useState, useEffect, useRef } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";
import {
  TextInput,
  Text,
  StyleSheet,
  Alert,
  Platform,
  Keyboard,
  View,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { useTranslation } from "react-i18next";

const EditableInput = ({
  label,
  value,
  setValue,
  placeholder,
  isEditable = true,
}: {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  isEditable?: boolean;
}) => {
  const [editable, setEditable] = useState(false);
  const handleDoubleClick = () => {
    if (!isEditable) return;
    setEditable(true);
  };

  return (
    <>
      <Text style={styles.mainText}>{label}</Text>
      <TouchableWithoutFeedback onPress={handleDoubleClick}>
        <View style={[styles.inputWrapper, editable && isEditable ? styles.editable : styles.nonEditable]}>
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor="#626262"
            editable={editable && isEditable} // 控制是否可編輯
            onBlur={() => setEditable(false)} // 失去焦點後禁用編輯
          />
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const EditProfile = () => {
  const insets = useSafeAreaInsets();
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const translateY = useRef(new Animated.Value(0)).current;
  const {t} = useTranslation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      return token || null;
    } catch (error) {
      return null;
    }
  };

  // Upload the image
  const uploadImage = async () => {
    setIsUploadLoading(true);

    if (!image) {
      Alert.alert(t("failed"), t("choose picture"), [
        {
          onPress: () => {
            setIsUploadLoading(false);
          },
        },
      ]);
      return;
    }

    const token = await getToken();

    if (!token) {
      Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。", [
        {
          onPress: () => {
            setIsUploadLoading(false);
          },
        },
      ]);
      return;
    }

    const formData = new FormData();
    const file = {
      uri: image,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any;
    formData.append("avatorFile", file);

    try {
      let url = "";

      if (user.role == "Passenger") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/passenger/updateMyInfo`;
      } else if (user.role == "Ridder") {
        url = `${process.env.EXPO_PUBLIC_API_URL}/ridder/updateMyInfo`;
      }

      const response = await axios.patch(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("上傳成功", "頭像上傳成功！");
      setIsUploadLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(JSON.stringify(error.response?.data.message));
        Alert.alert("錯誤", JSON.stringify(error.response?.data.message), [
          {
            onPress: () => {
              setIsUploadLoading(false);
            },
          },
        ]);
      } else {
        console.log("An unexpected error occurred:", JSON.stringify(error));
        Alert.alert("錯誤", "發生意外錯誤", [
          {
            onPress: () => {
              setIsUploadLoading(false);
            },
          },
        ]);
      }
    }
  };

  const getProfileData = async () => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Token 獲取失敗", "無法取得 Token，請重新登入。");
        return;
      }

      setUsername(user.userName ?? "");
      setEmail(user.email ?? "");
      setPhone(user.info?.phoneNumber ?? "");
      setDescription(user.info?.selfIntroduction ?? "");
      setAge(String(user.info?.age) ?? "");
      setAvatar(user.info?.avatorUrl ?? "");
      console.log(user.info)
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, (event) => {
      Animated.timing(translateY, {
        toValue: -event.endCoordinates.height * 0.8,
        duration: Platform.OS === "ios" ? event.duration || 200 : 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
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
  }, [translateY]);

  return (
    <>
      {isLoading ? (
        <LoadingWrapper />
      ) : (
        <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: verticalScale(15),
              paddingBottom: verticalScale(insets.bottom),
              paddingHorizontal: scale(20),
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{t("update profile")}</Text>
            </View>

            <View style={styles.profileHeader}>
              <Image source={{ uri: avatar ?? "https://via.placeholder.com/100" }} style={styles.avatar} />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Pressable style={styles.imageButton} onPress={pickImage} disabled={isUploadLoading}>
                <Text style={styles.imageButtonText}>{t("choose image")}</Text>
              </Pressable>
              <Pressable style={styles.imageButton} onPress={uploadImage} disabled={isUploadLoading}>
                <Text style={styles.imageButtonText}>{isUploadLoading ? <ActivityIndicator size="large" /> : t("upload image")}</Text>
              </Pressable>
            </View>

            <EditableInput label={t("userName")} value={username} setValue={setUsername} placeholder={t("userName")} isEditable={false} />
            <EditableInput label={t("email")} value={email} setValue={setEmail} placeholder={t("email")} />
            <EditableInput label={t("phone number")} value={phone} setValue={setPhone} placeholder={t("phone number")} />
            <EditableInput label={t("Age")} value={age} setValue={setAge} placeholder={t("Age")} />
            <EditableInput label={t("Introduction")} value={description} setValue={setDescription} placeholder={t("Introduction")} />
          </ScrollView>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  mainText: {
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  headerText: {
    fontSize: moderateScale(25),
    fontWeight: "bold",
  },
  textInput: {
    height: "100%",
    color: "#000",
    paddingLeft: scale(5),
  },
  editable: {
    borderBottomColor: "black",
  },
  nonEditable: {
    backgroundColor: "#e0e0e0",
  },
  inputWrapper: {
    marginTop: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(40),
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(10),
    marginBottom: verticalScale(10),
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  avatar: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    marginBottom: moderateScale(8),
  },
  imageButton: {
    marginTop: verticalScale(10),
    height: verticalScale(40),
    width: "45%",
    backgroundColor: "#000",
    borderRadius: scale(5),
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
});

export default EditProfile;
