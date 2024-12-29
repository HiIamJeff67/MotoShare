import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { RecordButtonStyles } from './RecordButton.style';
import { getUserTheme, ThemeType } from "@/theme";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(store)";
import { SearchRecordInterface } from '@/interfaces/userRecords.interface';

export interface RecordButtonProps {
  searchRecords: SearchRecordInterface
}

const RecordButton = (props: RecordButtonProps) => {
  const _user = useSelector((state: RootState) => state.user);
  const [themeName, setThemeName] = useState<ThemeType>(_user.theme ?? "LightTheme");
  const styles = RecordButtonStyles(getUserTheme(themeName));

  return (
    // 按了後跳轉至建立訂單頁面，並把相關資訊填好
    <Pressable style={styles.container}>
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
    </Pressable>
  )
}

export default RecordButton