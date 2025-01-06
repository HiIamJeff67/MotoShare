import React, { useEffect, useState } from 'react';
import {
  View,
  useColorScheme,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/(store)';
import { ThemeType } from '@/theme';
import { SettingsStyles } from './Settings.style';
import { setUserLanguageSettings, setUserThemeSettings } from '@/app/(store)/userSlice';
import LoadingWrapper from '@/app/component/LoadingWrapper/LoadingWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingButton from '@/app/component/SettingButton/SettingButton';
import Switcher from '@/app/component/Switcher/Switcher';
import { LanguageType } from '@/app/locales/language';

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const systemTheme = useColorScheme();

  const [styles, setStyles] = useState<any>(null);
  const [isThemeSwitcherVisible, setIsThemeSwitcherVisible] = useState(false);
  const [isLanguageSwitcherVisible, setIsLanguageSwitcherVisible] = useState(false);

  useEffect(() => {
    if (theme) {
      setStyles(SettingsStyles(theme, insets));
    }
  }, [theme]);

  const handleThemeSelection = (inputThemeName: ThemeType | null) => {
    if (inputThemeName) {
      dispatch(setUserThemeSettings({ themeName: inputThemeName}));
    } else if (inputThemeName === null) {
      dispatch(setUserThemeSettings({ themeName: systemTheme === 'dark' ? "DarkTheme" : "LightTheme" }));
    }
  };

  const handleLanguageSelection = (inputLanguage: LanguageType | null) => {
    if (inputLanguage) {
      dispatch(setUserLanguageSettings({ language: inputLanguage }));
    } else if (inputLanguage === null) {
      dispatch(setUserLanguageSettings({ language: "zh" }));
    }
  }

  return (
    !styles || !theme
      ? <LoadingWrapper />
      : (<View style={styles.container}>
          <SettingButton 
            title='外觀'
            theme={theme}
            callback={() => setIsThemeSwitcherVisible(true)} 
          />
          <SettingButton 
            title='更改語言' 
            theme={theme}
            callback={() => setIsLanguageSwitcherVisible(true)}
          />

          {isThemeSwitcherVisible && 
            <Switcher
              title="選擇主題"
              theme={theme}
              visible={isThemeSwitcherVisible}
              onClose={() => setIsThemeSwitcherVisible(false)}
              optionTitles={[
                { title: "深色主題", isSelected: (user.themeName === "DarkTheme") }, 
                { title: "淺色主題", isSelected: (user.themeName === "LightTheme") }, 
                { title: "依照系統預設", isSelected: false }
              ]}
              optionCallbacks={[
                () => handleThemeSelection('DarkTheme'),
                () => handleThemeSelection('LightTheme'),
                () => handleThemeSelection(null),
              ]}
            />
          }

          {isLanguageSwitcherVisible &&
            <Switcher 
              title="選擇語言"
              theme={theme}
              visible={isLanguageSwitcherVisible}
              onClose={() => setIsLanguageSwitcherVisible(false)}
              optionTitles={[
                { title: "中文", isSelected: (user.language === "zh") }, 
                { title: "英文", isSelected: (user.language === "en") }, 
              ]}
              optionCallbacks={[
                () => handleLanguageSelection("zh"), 
                () => handleLanguageSelection("en"), 
              ]}
            />
          }
        </View>)
  );
};

export default Settings;