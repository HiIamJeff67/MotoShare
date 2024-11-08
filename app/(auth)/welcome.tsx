import { router } from "expo-router";
import { Text, View, Image, Pressable, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = () => {
    return (
            <SafeAreaView className="flex-1 bg-[#3498db]">
                <StatusBar barStyle="dark-content" />
                
                <View className="justify-center items-center">
                    <Image
                        source={require('../../assets/images/vecteezy_electric-scooter-transparent.png')}
                        className="w-64 h-64 absolute top-32"
                        resizeMode="contain"
                    />
                </View>

                <View className="justify-center items-center"
                    style={{ 
                        top: 420,
                    }}>
                    
                    <Text className="text-white text-4xl pb-5 font-bold">讓我們開始吧!</Text>
                    <Text className="text-white text-lg">海大的共享機車系統</Text>
                    <Text className="text-white text-lg">助你輕鬆抵達每一個角落</Text>
                </View>

                <View className="justify-center items-center">
                    <Pressable 
                        style={{ 
                            width: 300,
                            height: 50,
                            position: 'absolute',
                            top: 450,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        className="rounded-lg bg-white shadow-lg"
                        onPress={() => console.log('Pressed')}
                    >
                    <Text className="font-semibold text-black text-lg">加入我們</Text>
                    </Pressable>
                </View>

                <View className="justify-center items-center"
                    style={{ 
                        top: 520,
                    }}>
                    
                    <Pressable 
                        onPress={() => router.push("./choose")}
                    >
                        <Text className="text-white text-lg">已經有帳號了?</Text>
                    </Pressable>
                </View>

            </SafeAreaView>

    );
};

export default WelcomeScreen;