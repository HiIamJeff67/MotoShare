import React from 'react';
import { Text, View, Image, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    
    return (
        <SafeAreaView className="flex-1 bg-[#ffffff]">
            <StatusBar barStyle="dark-content" />
            
            <View className="justify-center items-center mt-20">
                <Image
                    source={require('../../assets/images/motorbike.jpg')}
                    className="w-64 h-64 absolute top-32"
                    resizeMode="contain"
                />
            </View>

            <View className="justify-center items-center"
                style={{ 
                    top: 350,
                }}>
                                   
                <Text className="text-[#3498db] text-4xl pb-5 font-bold">海大的共享機車系統</Text>
                <Text className="text-[#3498db] text-base mt-[-10]">助你輕鬆抵達每一個角落</Text>
            </View>
            
            
            <View className="justify-center items-center">
                <Pressable 
                    style={{ 
                        width: 300,
                        height: 50,
                        position: 'absolute',
                        top: 560,
                        justifyContent: 'center',
                        alignItems: 'center',                                                                     
                    }}
                    className="rounded-lg bg-[#3498db] shadow-2xl shadow-sky-400 "
                    onPress={() => navigation.navigate('choose2')}
                >
                <Text className="font-semibold text-white text-xl">加入我們</Text>
                </Pressable>
            </View>

            <View className="justify-center items-center"
                style={{ 
                    top:  630,
                }}>
                
                <Pressable 
                    onPress={() => navigation.navigate('choose')}
                >
                    <Text className="text-[#3498db] text-lg">已經有帳號了?</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    );
};

export default WelcomeScreen;
