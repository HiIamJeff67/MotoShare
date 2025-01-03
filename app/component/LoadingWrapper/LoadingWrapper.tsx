import { RootState } from '@/app/(store)'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { LoadingWrapperStyles } from './LoadingWrapper.style'

const LoadingWrapper = () => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(LoadingWrapperStyles(theme));
    }
  }, [theme]);

  return (
    !styles 
      ? <></>
      : (<SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color={styles.icon.color} />
          </SafeAreaView>
        </SafeAreaProvider>)
  )
}

export default LoadingWrapper