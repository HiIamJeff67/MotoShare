import { Theme } from '@/theme/theme';
import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { AppInfoCardStyles } from './AppInfoCard.style';

export interface AppInfoCardInterface {
    iconSource?: ImageSourcePropType;
    title: string;
    description: string;
    status: boolean;
    callBack: () => void;
    isOpaqued?: boolean;
    theme: Theme;
    isNotColorful?: boolean;
}

const AppInfoCard = (props: AppInfoCardInterface) => {
    const statusSource = props.status 
        ? require('../../../assets/images/check.png') 
        : require('../../../assets/images/close.png');
    const styles = AppInfoCardStyles(props.theme);

    return (
        props.iconSource && 
            <TouchableOpacity style={styles.container} onPress={props.callBack} disabled={props.isOpaqued}>
                <View style={{ ...styles.overlay, ...(props.isOpaqued && styles.overlayOpaqued) }}>
                    <View style={styles.topBarContainer}>
                        <View style={styles.topBarInnerLeftContainer}>
                            {props.iconSource && <Image style={{...styles.icon, ...(props.isNotColorful && styles.iconDefaultColor)}} source={props.iconSource} />}
                            <Text style={styles.title}>{props.title}</Text>
                        </View>
                        <View style={styles.topBarInnerRightContainer}>
                            <Image 
                                style={{...styles.statusIcon, ...(props.status ? styles.statusIconGreen : styles.statusIconRed)}} 
                                source={statusSource} 
                            />
                        </View>
                    </View>
                    <View style={styles.bottomBarContainer}>
                        <Text style={styles.description}>{props.description}</Text>
                    </View>
                </View>
            </TouchableOpacity>
    )
}

export default AppInfoCard;