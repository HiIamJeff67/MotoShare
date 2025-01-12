import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { UserCardStyles } from "./UserCard.style";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(store)";
import { Theme } from "@/theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface UserInfoForUserCard {
  userName: string;
  email: string;
  info: {
    age: number | null;
    avatorUrl: string | null;
    isOnline: boolean;
    motocyclePhotoUrl?: string | null;
    motocycleType?: string | null;
    motocycleLicense?: string | null;
    selfIntroduction: string | null;
    avgStarRating: number | null;
    createdAt: string | null;
  };
}

interface UserCardProps {
  userInfo: UserInfoForUserCard;
  isButtonLoading: boolean;
  theme: Theme;
  onClicked?: (userName: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ userInfo, isButtonLoading, theme, onClicked = () => {} }) => {
  const user = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();
  const styles = UserCardStyles(theme, insets);
  const { t } = useTranslation();
  let roleText = "載入中...";

  if (user.role == "Ridder") {
    roleText = t("pure passenger");
  } else if (user.role == "Passenger") {
    roleText = t("pure rider");
  }

  if (!userInfo || !styles) return null;

  return (
    <View style={styles.container}>
      <Pressable>
        <View style={styles.card}>
          <View style={styles.photoContainer}>
            <Image
              source={userInfo.info.avatorUrl ? { uri: userInfo.info.avatorUrl } : require("../../../assets/images/user.png")}
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

        {userInfo.info.motocyclePhotoUrl ? (
          <View style={styles.card}>
            <View style={styles.photoContainer}>
              <Image source={{ uri: userInfo.info.motocyclePhotoUrl }} style={styles.motoPhoto} />
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.body2}>
              <Text style={styles.title2}>{t("No Motorcycle")} </Text>
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default UserCard;
