import { Theme } from '@/theme/theme';
import React from 'react';
import { Animated, Modal, TouchableOpacity } from 'react-native';
import { AnimatedCheckMessageStyles } from './AnimatedCheckMessage.style';

export interface AnimatedCheckMessageProps {
    title: string;
    content: string;
    theme: Theme;
    leftOptionTitle: string;
    leftOptionCallBack: () => void;
    rightOptionTitle: string;
    rightOptionCallBack: () => void;
}

const AnimatedCheckMessage = (props: AnimatedCheckMessageProps) => {
    const styles = AnimatedCheckMessageStyles(props.theme);

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
                    <Animated.View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.leftButton}
                            onPress={props.leftOptionCallBack}
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
      );
}

export default AnimatedCheckMessage;