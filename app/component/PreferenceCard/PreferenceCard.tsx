import { Theme } from '@/theme/theme';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, TouchableOpacity, View } from 'react-native';
import { PreferenceCardStyles } from './PreferenceCard.style';
import { Text } from 'react-native';

export interface PreferenceCardInterface {
    iconSource: ImageSourcePropType;
    title: string;
    description?: string;
    callBack?: () => void;
    status: boolean;
    statusCallBack: () => void;
    theme: Theme;
    isNotColorful?: boolean;
}

const PreferenceCard = (props: PreferenceCardInterface) => {
    const styles = PreferenceCardStyles(props.theme);

    return (
        props.iconSource && 
            <TouchableOpacity style={styles.container} onPress={props.callBack} >
                <View style={styles.overlay}>
                    <View style={styles.topBarContainer}>
                        <View style={styles.topBarInnerLeftContainer}>
                            {props.iconSource && <Image style={{...styles.icon, ...(props.isNotColorful && styles.iconDefaultColor)}} source={props.iconSource} />}
                            <Text style={styles.title}>{props.title}</Text>
                        </View>
                        {props.status && 
                            <TouchableOpacity 
                                style={styles.topBarInnerRightContainer}
                                onPress={props.statusCallBack}
                            >
                                <Image 
                                    style={{...styles.statusIcon, ...styles.statusIconRed}} 
                                    source={require('../../../assets/images/close.png')} 
                                />
                            </TouchableOpacity>
                        }
                    </View>
                    {props.description && 
                        <View style={styles.bottomBarContainer}>
                            <Text style={styles.description}>{props.description}</Text>
                        </View>
                    }
                </View>
            </TouchableOpacity>
    )
}

export default PreferenceCard