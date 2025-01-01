import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { RecordButtonStyles } from './RecordButton.style';
import { getUserTheme, ThemeType } from "@/theme";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(store)";
import { SearchRecordInterface } from '@/interfaces/userRecords.interface';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingWrapper from '../LoadingWrapper/LoadingWrapper';

export interface RecordButtonProps {
  searchRecords: SearchRecordInterface
}

const RecordButton = (props: RecordButtonProps) => {
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(RecordButtonStyles(theme));
    }
  }, [theme]);

  return (
    // 按了後跳轉至建立訂單頁面，並把相關資訊填好
    !styles
      ? <LoadingWrapper />
      : (<Pressable style={styles.container}>
          <View>
            <Image style={styles.recordIcon} source={require("../../../assets/images/record.png")}></Image>
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordAddress}>{props.searchRecords.startAddress ?? "出發地未知"}</Text>
            <Text style={styles.recordAddress}>{props.searchRecords.endAddress ?? "目的地未知"}</Text>
          </View>
          <View>
            <Image style={styles.goToRecordIcon} source={require("../../../assets/images/forward.png")}></Image>
          </View>
        </Pressable>)
  )
}

export default RecordButton