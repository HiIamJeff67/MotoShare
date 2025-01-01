import { RootState } from "@/app/(store)";
import { getUserTheme, ThemeType } from "@/theme";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { LoadingWrapperStyles } from "./LoadingWrapper.style";

const LoadingWrapper = () => {
  const user = useSelector((state: RootState) => state.user);
  const [themeName, setThemeName] = useState<ThemeType | null>(null);
  const styles = LoadingWrapperStyles(getUserTheme(themeName ?? "DarkTheme"));

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={styles.icon.color} />
    </View>
  );
};

export default LoadingWrapper;
