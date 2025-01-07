import React from 'react';
import { Animated } from 'react-native';
import { scale } from 'react-native-size-matters';

interface RadioOptionProps {
    outCircleColor?: string;
    outCircleWidth?: number;
    outCircleHeight?: number;
    innerCircleColor?: string;
    innerCircleWidth?: number;
    innerCircleHeight?: number;
    isSelected: boolean, 
}

const AnimatedRadioOption = (props: RadioOptionProps) => {
    return (
        <Animated.View
            style={{
                borderWidth: scale(0), 
                borderRadius: "50%", 
                backgroundColor: props.outCircleColor ?? "#fff", 
                width: scale(props.outCircleWidth ?? 16), 
                height: scale(props.outCircleHeight ?? 16), // using scale here to make sure the width is equal to the height
                justifyContent: "center", 
                alignItems: "center", 
            }}
        >
            {props.isSelected && 
                <Animated.View
                    style={{
                        borderWidth: scale(0), 
                        borderRadius: "50%", 
                        backgroundColor: props.innerCircleColor ?? "#3498db", 
                        width: scale(props.innerCircleWidth ?? 12), 
                        height: scale(props.innerCircleHeight ?? 12), // using scale here to make sure the width is equal to the height
                    }}
                />
            }
        </Animated.View>
    )
}

export default AnimatedRadioOption