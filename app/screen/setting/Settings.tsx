import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  Image,
  useColorScheme,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/(store)';
import { ThemeType } from '@/theme';
import { SettingsStyles } from './Settings.style';
import { setUserThemeSettings } from '@/app/(store)/userSlice';
import LoadingWrapper from '@/app/component/LoadingWrapper/LoadingWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedRadioOption from '@/app/component/RadioOption/AnimatedRadioOption';
import SettingButton from '@/app/component/SettingButton/SettingButton';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const systemTheme = useColorScheme();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  const [isThemeModalVisible, setThemeModalVisible] = useState(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [styles, setStyles] = useState<any>(null);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language); // 當前語言

  useEffect(() => {
    if (theme) {
      setStyles(SettingsStyles(theme, insets));
    }
  }, [theme]);

  const showThemeModal = () => {
    setThemeModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showLanguageModal = () => {
    setLanguageModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setThemeModalVisible(false);
      setLanguageModalVisible(false);
    });
  };

  const handleThemeSelection = (inputThemeName: ThemeType | null) => {
    if (inputThemeName) {
      dispatch(setUserThemeSettings({ themeName: inputThemeName }));
    } else if (inputThemeName === null) {
      dispatch(setUserThemeSettings({ themeName: systemTheme === 'dark' ? "DarkTheme" : "LightTheme" }));
    }
    hideModal();
  };

  const handleLanguageSelection = (selectedLanguage: string) => {
    i18n.changeLanguage(selectedLanguage);
    setLanguage(selectedLanguage);
    hideModal();
  };

  return (
    !styles || !theme
      ? <LoadingWrapper />
      : (<View style={styles.container}>
          <SettingButton 
            icon={require("../../../assets/images/themes.png")}
            title={t("theme")}
            theme={theme}
            callback={showThemeModal} 
          />
          <SettingButton 
            icon={require("../../../assets/images/earth.png")}
            title={t("language")} 
            theme={theme}
            callback={showLanguageModal}
          />

          {/* Theme Selection Modal */}
          <Modal
            animationType="none"
            transparent={true}
            visible={isThemeModalVisible}
            onRequestClose={hideModal}
          >
            <Animated.View 
              style={[
                styles.modalOverlay,
                {
                  opacity: fadeAnim
                }
              ]} 
              onTouchEnd={hideModal}
            >
              <Animated.View 
                style={[
                  styles.modalContainer,
                  {
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                      })
                    }]
                  }
                ]}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                <Text style={styles.modalTitle}>{t("choose theme")}</Text>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleThemeSelection('DarkTheme')}
                >
                  <Text style={styles.optionText}>{t("dark")}</Text>
                    <AnimatedRadioOption 
                      isSelected={user.themeName === "DarkTheme"}
                      outCircleColor={theme?.colors.border}
                      innerCircleColor={theme?.colors.primary}
                      innerCircleWidth={10}
                      innerCircleHeight={10}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleThemeSelection('LightTheme')}
                >
                  <Text style={styles.optionText}>{t("light")}</Text>
                    <AnimatedRadioOption 
                      isSelected={user.themeName === "LightTheme"}
                      outCircleColor={theme?.colors.border}
                      innerCircleColor={theme?.colors.primary}
                      innerCircleWidth={10}
                      innerCircleHeight={10}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleThemeSelection(null)}
                >
                  <Text style={styles.optionText}>{t("Follow system default")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={hideModal}
                >
                  <Text style={styles.cancelText}>{t("cancel")}</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </Modal>

          {/* Language Selection Modal */}
          <Modal
            animationType="none"
            transparent={true}
            visible={isLanguageModalVisible}
            onRequestClose={hideModal}
          >
            <Animated.View 
              style={[
                styles.modalOverlay,
                {
                  opacity: fadeAnim
                }
              ]} 
              onTouchEnd={hideModal}
            >
              <Animated.View 
                style={[
                  styles.modalContainer,
                  {
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                      })
                    }]
                  }
                ]}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                <Text style={styles.modalTitle}>{t("choose language")}</Text>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleLanguageSelection('zh')}
                >
                  <Text style={styles.optionText}>{t("Chinese")}</Text>
                    <AnimatedRadioOption 
                      isSelected={language === "zh"}
                      outCircleColor={theme?.colors.border}
                      innerCircleColor={theme?.colors.primary}
                      innerCircleWidth={10}
                      innerCircleHeight={10}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleLanguageSelection('en')}
                >
                  <Text style={styles.optionText}>{t("English")}</Text>
                    <AnimatedRadioOption 
                      isSelected={language === "en"}
                      outCircleColor={theme?.colors.border}
                      innerCircleColor={theme?.colors.primary}
                      innerCircleWidth={10}
                      innerCircleHeight={10}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={hideModal}
                >
                  <Text style={styles.cancelText}>{t("cancel")}</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </Modal>
        </View>)
  );
};

export default Settings;