import { Theme } from '@/theme/theme';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native';
import { Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';
import { SettingButtonStyles } from './SettingButton.style';

export interface SettingButtonProps {
    title: string;
    extraContent?: string;
    badgeCount?: number;
    theme: Theme;
    callback?: () => any;
}

const SettingButton = (props: SettingButtonProps) => {
    const styles = SettingButtonStyles(props.theme);

    return (
        <Pressable style={styles.items} onPress={props.callback}>
            <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>{props.title}</Text>
                {props.extraContent && props.extraContent.length !== 0 && <Text style={styles.extraContent}>{props.extraContent}</Text>}
            </View>
            {props.badgeCount && props.badgeCount > 0 && <Text style={styles.badge}>{props.badgeCount}</Text>}
            <View>
                <Image
                style={styles.goToButton}
                source={require('../../../assets/images/forward.png')}
                />
            </View>
        </Pressable>
    )
}

export default SettingButton