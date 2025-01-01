import { RootState } from '@/app/(store)'
import { getUserTheme, ThemeType } from '@/theme'
import React, { useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { LoadingWrapperStyles } from './LoadingWrapper.style'

const LoadingWrapper = () => {
  const user = useSelector((state: RootState) => state.user);
  
  const [themeName, setThemeName] = useState<ThemeType | null>(null);
  
  const insets = useSafeAreaInsets();
  const styles = LoadingWrapperStyles(getUserTheme(themeName ?? "DarkTheme"));

  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color={styles.icon.color} />
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default LoadingWrapper