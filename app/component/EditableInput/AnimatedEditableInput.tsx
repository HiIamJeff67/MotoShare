import { Theme } from '@/theme/theme';
import React, { useState } from 'react';
import { Animated, Keyboard, KeyboardTypeOptions, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { EditableInputStyles } from './AnimatedEditableInput.style';

export interface AnimatedEditableInputProps {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  theme: Theme;
  keyboardType?: KeyboardTypeOptions;
  requiresKeyboardOffset: boolean, 
  setRequiresKeyBoardOffset: (key: boolean) => void, 
  isSecureText?: boolean;
  editable?: boolean;
}

const AnimatedEditableInput = (props: AnimatedEditableInputProps) => {
  const styles = EditableInputStyles(props.theme);
  const editable = props.editable ?? true;
  const [onFocus, setOnFocus] = useState(false);

  const handleOnFocus = () => {
    setOnFocus(true);
    props.setRequiresKeyBoardOffset(props.requiresKeyboardOffset);
  }

  const handleOnBlur = () => {
    setOnFocus(false);
    props.setRequiresKeyBoardOffset(false);
  }
  
  return (
    <Animated.View style={styles.container}>
      <Animated.Text style={styles.label}>{props.label}</Animated.Text>
      <TextInput 
        style={{ ...styles.input, ...(onFocus && styles.inputOnFocus), ...(!editable && styles.inputUnEditable) }}
        placeholder={props.placeholder}
        defaultValue={props.value}
        onChangeText={props.setValue}
        keyboardType={props.keyboardType ?? "default"}
        returnKeyType="done"
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        secureTextEntry={props.isSecureText ?? false}
        editable={editable}
      />
    </Animated.View>
  );
}

export default AnimatedEditableInput;