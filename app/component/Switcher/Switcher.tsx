import React, { useEffect, useRef } from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
} from 'react-native';
import { SwitcherStyles } from './Switcher.style';
import AnimatedRadioOption from '../RadioOption/AnimatedRadioOption';

export interface OptionAttributeInterface {
    title: string;
    isSelected?: boolean;
}

export interface SwitcherProps {
    title?: string;
    visible: boolean;
    onClose: () => void;
    optionTitles: OptionAttributeInterface[];
    optionCallbacks: (() => void)[];
    theme: any; // Replace `any` with the correct type for theme.
}

const Switcher: React.FC<SwitcherProps> = ({
  visible,
  onClose,
  optionTitles,
  optionCallbacks,
  title = '選擇選項',
  theme,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  const styles = SwitcherStyles(theme);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          { opacity: fadeAnim },
        ]}
        onTouchEnd={onClose}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>{title}</Text>
          {optionTitles.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => {
                optionCallbacks[index]();
                onClose();
              }}
            >
                <Text style={styles.optionText}>{option.title}</Text>
                {option.isSelected && 
                  <AnimatedRadioOption 
                    isSelected={option.isSelected}
                    outCircleColor={theme?.colors.border}
                    innerCircleColor={theme?.colors.primary}
                    innerCircleWidth={10}
                    innerCircleHeight={10}
                  />
                }
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default Switcher;