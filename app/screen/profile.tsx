import { Text, Pressable, StyleSheet, Image, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../(store)/';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

const Profile = () => {
    const user = useSelector((state: RootState) => state.user);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const userToken = await SecureStore.getItemAsync('userToken');
            setToken(userToken);
        };

        fetchToken();
    }, []);

    const api = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const getProfileData = async () => {
        if (token) {
            try {
                const response = await api.get('/passenger/getMe', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Profile Data:', response.data);
            } catch (error) {
                console.error('API 請求出錯:', error);
            }
        } else {
            console.log('Token 未獲取');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View className="justify-center items-center mt-20">
                <Image
                    source={require('../../assets/images/motorbike.jpg')}
                    style={styles.image}
                />
                <Text style={[styles.text, { top: -330 }]}>UserName: {user.username}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center', // 垂直居中
        alignItems: 'center', // 水平居中
        backgroundColor: '#f5f5f5', // 可選背景色
    },
    text: {
        right: -70, // 距離螢幕右邊的距離
        fontSize: 16,
        padding: 2,
        fontWeight: 'bold',
        color: '#000000',
    },
    image: {
        top: -250,  // 距離屏幕頂部的距離
        left: -110, // 距離屏幕左邊的距離
        width: 120, // 圖片寬度
        height: 120, // 圖片高度
    },
    button: {
        height: 50,
        width: 200,
        justifyContent: 'center', // 文字垂直居中
        alignItems: 'center', // 文字水平居中
        backgroundColor: '#3498db', // 按鈕背景色
        borderRadius: 10, // 圓角
        shadowColor: '#00bfff', // 陰影顏色
        shadowOffset: { width: 0, height: 5 }, // 陰影偏移
        shadowOpacity: 0.5, // 陰影透明度
        shadowRadius: 10, // 陰影模糊程度
        elevation: 10, // Android 陰影效果
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;