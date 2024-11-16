import React from 'react';
import { Text, View, Image, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3498db' }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/vecteezy_electric-scooter-transparent.png')}
                    style={{ width: 256, height: 256, position: 'absolute', top: 100 }}
                    resizeMode="contain"
                />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', top: 420 }}>
                <Text style={{ color: 'white', fontSize: 32, paddingBottom: 20, fontWeight: 'bold' }}>讓我們開始吧!</Text>
                <Text style={{ color: 'white', fontSize: 18 }}>海大的共享機車系統</Text>
                <Text style={{ color: 'white', fontSize: 18 }}>助你輕鬆抵達每一個角落</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Pressable
                    style={{
                        width: 300,
                        height: 50,
                        position: 'absolute',
                        top: 450,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        backgroundColor: 'white',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 5,
                    }}
                    onPress={() => navigation.navigate('choose2')}
                >
                    <Text style={{ fontWeight: '600', color: 'black', fontSize: 18 }}>加入我們</Text>
                </Pressable>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', top: 520 }}>
                <Pressable onPress={() => navigation.navigate('choose')}>
                    <Text style={{ color: 'white', fontSize: 18 }}>已經有帳號了?</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;
