import React from 'react';
import { Text, View, Image, Pressable, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';

const ChooseScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#3498db',
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
                <Text className="text-white text-4xl pb-5 font-bold">選擇你的身份</Text>
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
                    }}
                    className="rounded-lg bg-white shadow-lg"
                    onPress={() => navigation.navigate("plogin")}
                >
                    <Text className="font-semibold text-black text-lg">我是乘客</Text>
                </Pressable>

                <Pressable
                    style={{
                        width: scale(250),
                        height: verticalScale(40),
                        marginTop: verticalScale(15),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    className="rounded-lg bg-white shadow-lg"
                    onPress={() => navigation.navigate("rlogin")}
                >
                    <Text className="font-semibold text-black text-lg">我是車主</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default ChooseScreen;