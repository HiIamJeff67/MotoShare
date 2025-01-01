import React from 'react';
import { Text, View, Image, Pressable, StatusBar, Platform } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Theme } from '../../../theme/theme'; // 引入自定義的主題類型

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const theme = useTheme() as Theme; // 強制轉換為自定義主題類型
    const { colors } = theme;
    
    return (
        <View style={{ 
            flex: 1,
            backgroundColor: colors.background, 
            paddingTop: verticalScale(insets.top),
            paddingBottom: verticalScale(insets.bottom),
            paddingHorizontal: scale(20), // 設置水平間距
            paddingVertical: verticalScale(20), // 設置垂直間距
        }}>
            {/* 根據平台條件設置 StatusBar */}
            {Platform.OS === 'ios' ? (
                <StatusBar barStyle="dark-content"/>
            ) : (
                <StatusBar barStyle="dark-content" hidden={true}/>
            )}

            {/* Top Image */}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../../assets/images/motorbike.jpg')}
                    style={{
                        width: scale(256), // Equivalent to "w-64"
                        height: verticalScale(256), // Equivalent to "h-64"
                        resizeMode: 'contain',
                }} />
            </View>

            {/* Title Section */}
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: verticalScale(50),
                }}
            >
                <Text
                    style={{
                        color: colors.primary,
                        fontSize: moderateScale(32), // Equivalent to "text-4xl"
                        paddingBottom: verticalScale(10),
                        fontWeight: 'bold',
                    }}
                >
                    海大的共享機車系統
                </Text>
                <Text
                    style={{
                        color: colors.primary,
                        fontSize: moderateScale(15), // Equivalent to "text-base"
                    }}
                >
                    助你輕鬆抵達每一個角落
                </Text>
            </View>

            {/* Join Button */}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Pressable
                    style={{
                        width: '100%',
                        height: verticalScale(40),
                        marginTop: verticalScale(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: moderateScale(10), // Adjusting for rounded corners
                        backgroundColor: colors.primary,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: verticalScale(5) },
                        shadowOpacity: 0.5,
                        shadowRadius: moderateScale(10),
                    }}
                    onPress={() => navigation.navigate('choose2' as never)}
                >
                    <Text
                        style={{
                            fontWeight: '600',
                            color: '#ffffff',
                            fontSize: moderateScale(18), // Equivalent to "text-xl"
                        }}
                    >
                        加入我們
                    </Text>
                </Pressable>
            </View>

            {/* Existing Account Text */}
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(15) }}>
                <Pressable onPress={() => navigation.navigate('choose' as never)}>
                    <Text
                        style={{
                            color: colors.primary,
                            fontSize: moderateScale(16), // Equivalent to "text-lg"
                        }}
                    >
                        已經有帳號了?
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default WelcomeScreen;