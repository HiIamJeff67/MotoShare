import React, { useEffect, useState } from 'react';
import { RootState } from '@/app/(store)';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AbsoluteLoadingWrapperStyles } from './AbsoluteLoadingWrapper.style';

const AbsoluteLoadingWrapper = () => {
    const isAbsoluteLoading = useSelector((state: RootState) => state.loading.isLoading);
    const user = useSelector((state: RootState) => state.user);
    const theme = user.theme;
    const [styles, setStyles] = useState<any>(null);
  
    useEffect(() => {
      if (theme) {
        setStyles(AbsoluteLoadingWrapperStyles(theme));
      }
    }, [theme]);
  
    return (
        !styles || !isAbsoluteLoading
            ? <></>
            : (<View style={[styles.container, styles.overlay]}>
                <ActivityIndicator size="large" color={styles.icon.color} />
              </View>)
    );
}

export default AbsoluteLoadingWrapper