import { Theme } from "@/theme/theme";
import React, { useEffect, useState } from "react";
import { Animated, Modal, Pressable, TextInput, TouchableOpacity } from "react-native";
import { AnimatedInputMessageStyles } from "./AnimatedInputMessage.style";

export interface InputSideButtonInterface {
  title: string;
  callback: () => void;
}

export interface InputAttributeInterface {
  placeholder: string;
  defaultValue?: string;
  isSecureText: boolean;
  inputSideButton?: InputSideButtonInterface;
}

export interface AnimatedInputMessageProps {
  title: string;
  content: string;
  theme: Theme;
  inputAttributes?: InputAttributeInterface[];
  leftOptionTitle: string;
  leftOptionCallBack: (values: string[]) => void;
  rightOptionTitle: string;
  rightOptionCallBack: () => void;
}

const AnimatedInputMessage = (props: AnimatedInputMessageProps) => {
  const styles = AnimatedInputMessageStyles(props.theme);

  const [inputValues, setInputValues] = useState<string[]>(props.inputAttributes ? props.inputAttributes.map((attr) => attr.defaultValue || "") : []);
  const [countdowns, setCountdowns] = useState<number[]>(props.inputAttributes ? Array(props.inputAttributes.length).fill(0) : []);

  const handleInputChange = (index: number, text: string) => {
    const newValues = [...inputValues];
    newValues[index] = text;
    setInputValues(newValues);
  };

  const handleInputSideButtonOnClick = (index: number) => {
    if (countdowns[index] > 0) return;

    if (props.inputAttributes && props.inputAttributes[index].inputSideButton) {
      props.inputAttributes[index].inputSideButton.callback();
    }

    const newCountdowns = [...countdowns];
    newCountdowns[index] = 60;
    setCountdowns(newCountdowns);

    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = [...prev];
        updated[index] -= 1;

        if (updated[index] <= 0) {
          clearInterval(interval);
        }

        return updated;
      });
    }, 1000);
  };

  const handleLeftOptionClick = () => {
    props.leftOptionCallBack(inputValues);
  };

  return (
    <Modal transparent={true} animationType="fade" visible={true}>
      <Animated.View style={styles.overlay} onTouchEnd={props.rightOptionCallBack}>
        <Animated.View style={styles.messageBox} onTouchEnd={(e) => e.stopPropagation()}>
          <Animated.View>
            <Animated.Text style={styles.title}>{props.title}</Animated.Text>
          </Animated.View>
          <Animated.View>
            <Animated.Text style={styles.content}>{props.content}</Animated.Text>
          </Animated.View>
          <Animated.View style={styles.inputContainer}>
            {props.inputAttributes &&
              props.inputAttributes.map((attributes, index) => (
                <Animated.View key={index} style={styles.inputInnerContainer}>
                  <TextInput
                    key={index}
                    style={styles.input}
                    secureTextEntry={attributes.isSecureText}
                    placeholder={attributes.placeholder}
                    value={inputValues[index]}
                    onChangeText={(text) => handleInputChange(index, text)}
                  />
                  {attributes.inputSideButton && (
                    <Pressable
                      key={~index}
                      style={{ ...styles.inputSideButton, ...(countdowns[index] > 0 && styles.disabledButton) }}
                      onPress={() => handleInputSideButtonOnClick(index)}
                      disabled={countdowns[index] > 0}
                    >
                      <Animated.Text style={styles.inputSideButtonTitle}>
                        {countdowns[index] > 0 ? `${countdowns[index]}秒` : attributes.inputSideButton.title}
                      </Animated.Text>
                    </Pressable>
                  )}
                </Animated.View>
              ))}
          </Animated.View>
          <Animated.View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.leftButton} onPress={handleLeftOptionClick}>
              <Animated.Text style={styles.leftButtonText}>{props.leftOptionTitle}</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightButton} onPress={props.rightOptionCallBack}>
              <Animated.Text style={styles.rightButtonText}>{props.rightOptionTitle}</Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default AnimatedInputMessage;
