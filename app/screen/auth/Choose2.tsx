import React from 'react';
import { Text, View, Image, Pressable, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useTheme } from '@react-navigation/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import * as Localization from 'expo-localization';
import { useTranslation } from 'react-i18next';
import { Theme } from '@/theme/theme';

const Choose2Screen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const theme = useTheme() as Theme;
    const { colors, fonts } = theme;
    const { t } = useTranslation();

    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.primary, 
            paddingTop: verticalScale(insets.top),
            paddingBottom: verticalScale(insets.bottom),
            paddingHorizontal: scale(20), // 設置水平間距
            paddingVertical: verticalScale(20), // 設置垂直間距
        }}>
            {Platform.OS === 'ios' ? (
                <StatusBar barStyle="dark-content" />
            ) : (
                <StatusBar barStyle="dark-content" hidden={true} />
            )}
            <View className="justify-center items-center"
                style={{
                    marginTop: verticalScale(20),
                }}>
                <Text 
                    style={{
                        ...(fonts.bold), 
                        color: colors.background, 
                        fontSize: moderateScale(30), 
                    }}
                >
                        {t('chooseYourIdentity')} 
                </Text>
            </View>

            <View className="justify-center items-center">
                <Image
                    source={require('../../../assets/images/motorbike.jpg')}
                    style={{
                        marginTop: verticalScale(20),
                        width: scale(256),
                        height: verticalScale(256),
                        resizeMode: 'contain',
                    }}
                />
            </View>

            <View className="justify-center items-center">
                <Pressable
                    style={{
                        width: scale(250), 
                        height: verticalScale(40), 
                        marginTop: verticalScale(40), 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        backgroundColor: colors.card, 
                    }}
                    className="rounded-lg shadow-lg"
                    onPress={() => navigation.navigate(...(["reg", { role: "Passenger" }] as never))}
                >
                    <Text 
                        style={{
                            ...(fonts.heavy), 
                            color: colors.text, 
                            fontSize: moderateScale(14), 
                        }} 
                    >
                            {t("passenger")}
                    </Text>
                </Pressable>

                <Pressable
                    style={{
                        width: scale(250), 
                        height: verticalScale(40), 
                        marginTop: verticalScale(15), 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        backgroundColor: colors.card, 
                    }}
                    className="rounded-lg shadow-lg"
                    onPress={() => navigation.navigate(...(["reg", { role: "Ridder" }] as never))}
                >
                    <Text style={{
                            ...(fonts.heavy), 
                            color: colors.text, 
                            fontSize: moderateScale(14), 
                    }}>
                        {t("rider")}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Choose2Screen;