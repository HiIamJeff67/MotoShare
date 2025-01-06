import { Theme } from '@/theme/theme';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, View } from 'react-native';
import { PreferenceCardStyles } from './PreferenceCard.style';
import { Text } from 'react-native';

export interface PreferenceCardInterface {
    iconSource: ImageSourcePropType;
    title: string;
    description?: string;
    status: boolean;
    callBack: () => void;
    isOpaqued?: boolean;
    theme: Theme;
    isNotColorful?: boolean;
}

const PreferenceCard = (props: PreferenceCardInterface) => {
    const styles = PreferenceCardStyles(props.theme);

    return (
        props.iconSource && 
            <View style={styles.container} >
                <View style={{ ...styles.overlay, ...(props.isOpaqued && styles.overlayOpaqued) }}>
                    <View style={styles.topBarContainer}>
                        <View style={styles.topBarInnerLeftContainer}>
                            {props.iconSource && <Image style={{...styles.icon, ...(props.isNotColorful && styles.iconDefaultColor)}} source={props.iconSource} />}
                            <Text style={styles.title}>{props.title}</Text>
                        </View>
                        {props.status && 
                            <Pressable 
                                style={styles.topBarInnerRightContainer}
                                onPress={props.callBack}
                                disabled={props.isOpaqued}
                            >
                                <Image 
                                    style={{...styles.statusIcon, ...styles.statusIconRed}} 
                                    source={require('../../../assets/images/close.png')} 
                                />
                            </Pressable>
                        }
                    </View>
                    {props.description && 
                        <View style={styles.bottomBarContainer}>
                            <Text style={styles.description}>{props.description}</Text>
                        </View>
                    }
                </View>
            </View>
    )
}

export default PreferenceCard