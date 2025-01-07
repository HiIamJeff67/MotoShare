import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Styles } from "./UserCard.style";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(store)";

interface UserInfo {
  info: {
    age: number | null;
    avatorUrl: string | null;
    isOnline: boolean;
    motocyclePhotoUrl: string | null;
    motocycleType: string | null;
    selfIntroduction: string | null;
  };
  userName: string;
}

interface Props {
  userInfo: UserInfo;
  isButtonLoading: boolean;
  onClicked?: (userName: string) => void;
}

const UserCard: React.FC<Props> = ({ userInfo, isButtonLoading, onClicked = () => {} }) => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const [styles, setStyles] = useState<any>(null);
  const { t } = useTranslation();
  let roleText = "載入中...";

  if (user.role == "Ridder") {
    roleText = t("pure passenger");
  } else if (user.role == "Passenger") {
    roleText = t("pure rider");
  }

  useEffect(() => {
    if (theme) {
      setStyles(Styles(theme));
    }
  }, [theme]);

  if (!userInfo || !styles) return null;

  return (
    <View style={styles.container}>
      <Pressable>
        <View style={styles.card}>
          <View style={styles.photoContainer}>
            <Image
              source={{
                uri: userInfo.info.avatorUrl ?? "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.body}>
            <Text style={styles.title}>
              {roleText}：{userInfo.userName}
            </Text>
            <Text style={styles.title}>
              {t("Age")}：{userInfo.info.age}
            </Text>
            <Text style={styles.title}>
              {t("Motorcycle Type")}：{userInfo.info.motocycleType}
            </Text>
            <Text style={styles.title}>
              {t("Online Status")}：{userInfo.info.isOnline ? t("Online") : t("Offline")}
            </Text>
            <Text style={styles.title}>
              {t("Introduction")}：{userInfo.info.selfIntroduction}
            </Text>
            <Pressable style={styles.button} disabled={isButtonLoading} {...(onClicked && { onPress: () => onClicked(userInfo.userName) })}>
              <Text style={styles.buttonText}>{isButtonLoading ? <ActivityIndicator size="large" /> : t("Add To Preference")}</Text>
            </Pressable>
          </View>
        </View>

        {userInfo.info.motocyclePhotoUrl && (
          <View style={styles.card}>
            <View style={styles.photoContainer}>
              <Image source={{ uri: userInfo.info.motocyclePhotoUrl }} style={styles.motoPhoto} />
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default UserCard;
