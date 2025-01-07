import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(store)";
import { UserDetailStyles } from "./UserDetail.style";
import LoadingWrapper from "../LoadingWrapper/LoadingWrapper";

export interface UserInfoForUserDetail {
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
    createdAt: string | null, 
  };
}

interface Props {
  userInfo: UserInfoForUserDetail;
  isDataLoading: boolean;
  onClicked?: (userName: string) => void;
  onClose: () => void;
}

const UserDetail: React.FC<Props> = ({ userInfo, isDataLoading, onClicked = () => {}, onClose }) => {
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
      setStyles(UserDetailStyles(theme));
    }
  }, [theme]);

  if (!userInfo || !styles) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.card} >
          {isDataLoading ? (
            <View style={{ width: "100%", height: "100%", position: "absolute", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <LoadingWrapper />
            </View>
          ) : (
            <>
              <View style={styles.photoContainer}>
                {userInfo.info.avatorUrl && (
                  <Image
                    source={{
                      uri: userInfo.info.avatorUrl ?? "https://via.placeholder.com/100",
                    }}
                    style={styles.avatar}
                  />
                )}
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>
                  {roleText}：{userInfo.userName}
                </Text>
                <Text style={styles.title}>
                  {t("Age")}：{userInfo.info.age}
                </Text>
                <Text style={styles.title}>
                  {t("Online Status")}：{userInfo.info.isOnline ? t("Online") : t("Offline")}
                </Text>
                <Text style={styles.title}>
                  {t("Introduction")}：{userInfo.info.selfIntroduction}
                </Text>
                <Text style={styles.title}>
                  {t("avgStarRating")}：{userInfo.info.avgStarRating}
                </Text>
                {userInfo.info.motocycleLicense && (
                  <Text style={styles.title}>
                    {t("Motorcycle License")}：{userInfo.info.motocycleLicense}
                  </Text>
                )}
                {userInfo.info.motocycleType && (
                  <Text style={styles.title}>
                    {t("Motorcycle Type")}：{userInfo.info.motocycleType}
                  </Text>
                )}
                {userInfo.info.motocyclePhotoUrl && (
                  <Text style={styles.title}>
                    {t("Motorcycle Photo")}：{userInfo.info.motocyclePhotoUrl}
                  </Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Pressable>
  );
};

export default UserDetail;
