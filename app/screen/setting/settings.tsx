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
import { SettingsStyles } from './settings.style';
import { setUserSettings } from '@/app/(store)/userSlice';
import LoadingWrapper from '@/app/component/LoadingWrapper/LoadingWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedRadioOption from '@/app/component/RadioOption/AnimatedRadioOption';
import SettingButton from '@/app/component/SettingButton/SettingButton';



const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const systemTheme = useColorScheme();
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  const [isModalVisible, setModalVisible] = useState(false);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(SettingsStyles(theme, insets));
    }
  }, [theme]);

  const showModal = () => {
    setModalVisible(true);
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
      setModalVisible(false);
    });
  };

  const handleThemeSelection = (inputThemeName: ThemeType | null) => {
    if (inputThemeName) {
      dispatch(setUserSettings({ themeName: inputThemeName}));
    } else if (inputThemeName === null) {
      dispatch(setUserSettings({ themeName: systemTheme === 'dark' ? "DarkTheme" : "LightTheme" }));
    }
    hideModal();
  };

  return (
    !styles || !theme
      ? <LoadingWrapper />
      : (<View style={styles.container}>
          <SettingButton 
            title='外觀'
            theme={theme}
            callback={showModal} 
          />
          <SettingButton 
            title='更改語言' 
            theme={theme}
          />

          <Modal
            animationType="none"
            transparent={true}
            visible={isModalVisible}
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
                <Text style={styles.modalTitle}>選擇主題</Text>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleThemeSelection('DarkTheme')}
                >
                  <Text style={styles.optionText}>深色主題</Text>
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
                  <Text style={styles.optionText}>淺色主題</Text>
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
                  <Text style={styles.optionText}>依照系統預設</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={hideModal}
                >
                  <Text style={styles.cancelText}>取消</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </Modal>
        </View>)
  );
};

export default Settings;