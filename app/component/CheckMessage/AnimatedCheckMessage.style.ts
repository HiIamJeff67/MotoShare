import { StyleSheet } from 'react-native';
import { Theme } from '@/theme/theme';
import { scale, verticalScale } from 'react-native-size-matters';

export const AnimatedCheckMessageStyles = (theme: Theme) => {
    const [_colors, _fonts] = [theme.colors, theme.fonts];

    return StyleSheet.create({
        overlay: {
            flex: 1,
            position: "relative", 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        messageBox: {
            position: "absolute", 
            width: '80%',
            backgroundColor: theme.colors.background,
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: scale(15),
        },
        title: {
            fontSize: scale(16),
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: verticalScale(6),
        },
        content: {
            fontSize: scale(12),
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: verticalScale(12),
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        leftButton: {
            width: scale(100), 
            height: scale(32), 
            marginRight: scale(10),
            marginLeft: scale(10), 
            backgroundColor: theme.colors.primary,
            padding: scale(5),
            borderRadius: scale(6),
            justifyContent: "center", 
            alignItems: 'center',
        },
        rightButton: {
            width: scale(100), 
            height: scale(32), 
            marginRight: scale(10),
            marginLeft: scale(10), 
            backgroundColor: theme.colors.notification,
            padding: scale(5),
            borderRadius: scale(6),
            justifyContent: "center", 
            alignItems: 'center',
        },
        leftButtonText: {
            color: theme.colors.background,
            fontSize: 16,
            fontWeight: _fonts.bold.fontWeight, 
        },
        rightButtonText: {
            color: theme.colors.background,
            fontSize: 16,
            fontWeight: _fonts.bold.fontWeight, 
        },
    });
}

export const __styles = StyleSheet.create({});