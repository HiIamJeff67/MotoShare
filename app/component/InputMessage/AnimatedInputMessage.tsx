import { Theme } from '@/theme/theme';
import React, { useState } from 'react';
import { Animated, Modal, TextInput, TouchableOpacity } from 'react-native';
import { AnimatedInputMessageStyles } from './AnimatedInputMessage.style';

export interface InputAttributeInterface {
    placeholder: string;
    isSecureText: boolean;
}

export interface AnimatedInputMessageProps {
    title: string;
    content: string;
    theme: Theme;
    inputAttributes: InputAttributeInterface[];
    leftOptionTitle: string;
    leftOptionCallBack: (values: string[]) => void;
    rightOptionTitle: string;
    rightOptionCallBack: () => void;
}

const AnimatedInputMessage = (props: AnimatedInputMessageProps) => {
    const styles = AnimatedInputMessageStyles(props.theme);

    const [inputValues, setInputValues] = useState<string[]>(
        Array(props.inputAttributes.length).fill('')
    );

    const handleInputChange = (index: number, text: string) => {
        const newValues = [...inputValues];
        newValues[index] = text;
        setInputValues(newValues);
    };

    const handleRightOptionClick = () => {
        props.leftOptionCallBack(inputValues);
    };

  return (
    <Modal
        transparent={true}
        animationType="fade"
        visible={true}
    >
        <Animated.View style={styles.overlay} onTouchEnd={props.rightOptionCallBack}>
            <Animated.View style={styles.messageBox} onTouchEnd={(e) => e.stopPropagation()}>
                <Animated.View>
                    <Animated.Text style={styles.title}>{props.title}</Animated.Text>
                </Animated.View>
                <Animated.View>
                    <Animated.Text style={styles.content}>{props.content}</Animated.Text>
                </Animated.View>
                <Animated.View style={styles.inputContainer}>
                    {props.inputAttributes.map((attributes, index) => (
                        <TextInput
                            key={index}
                            style={styles.input}
                            secureTextEntry={attributes.isSecureText}
                            placeholder={attributes.placeholder}
                            value={inputValues[index]}
                            onChangeText={(text) => handleInputChange(index, text)}
                        />
                    ))}
                </Animated.View>
                <Animated.View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.leftButton}
                        onPress={handleRightOptionClick}
                    >
                        <Animated.Text style={styles.leftButtonText}>{props.leftOptionTitle}</Animated.Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.rightButton}
                        onPress={props.rightOptionCallBack}
                    >
                        <Animated.Text style={styles.rightButtonText}>{props.rightOptionTitle}</Animated.Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    </Modal>
  )
}

export default AnimatedInputMessage;