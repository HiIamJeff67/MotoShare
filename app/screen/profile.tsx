import { Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../(store)/index';
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
        <SafeAreaView className="flex-1">
            <Pressable 
                style={{ 
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                className="rounded-lg bg-[#3498db] shadow-2xl shadow-sky-400 w-full"
                onPress={getProfileData}
            >
                <Text className="text-white">獲取個人資料</Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default Profile;