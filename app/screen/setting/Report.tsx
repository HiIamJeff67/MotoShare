import React, { useEffect, useState } from 'react';
import { 
    View, 
    TextInput, 
    Pressable, 
    Text, 
    Alert, 
    Keyboard, 
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from "expo-secure-store";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/(store)';
import { ReportStyles } from './Report.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingWrapper from '@/app/component/LoadingWrapper/LoadingWrapper';

const Report = () => {
    const navigation = useNavigation();
    const user = useSelector((state: RootState) => state.user);
    const theme = user.theme;
    const insets = useSafeAreaInsets();

    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [styles, setStyles] = useState<any>(null);

    useEffect(() => {
        if (theme) {
            setStyles(ReportStyles(theme, insets))
        }
    }, [theme]);

    const handleSubmit = async () => {
        if (!subject.trim() || !content.trim()) {
            Alert.alert('錯誤', '請填寫主旨和內容');
            return;
        }

        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync("userToken");
            const response = await axios.post(
                user.role === "Passenger"
                    ? `${process.env.EXPO_PUBLIC_API_URL}/email/passenger/sendReportEmailToDeveloper`
                    : `${process.env.EXPO_PUBLIC_API_URL}/email/ridder/sendReportEmailToDeveloper`,
                {
                    userName: user.userName, 
                    email: user.email, 
                    subject: subject, 
                    content: content, 
                }, 
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", 
                        Authorization: `Bearer ${token}`, 
                    }
                }
            );

            if (response.status === 200) {
                Alert.alert(
                    '成功',
                    '感謝您的回饋！',
                    [
                        {
                            text: '確定',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            }
        } catch (error) {
            Alert.alert('錯誤', '發送失敗，請稍後再試');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        isLoading || !styles || !theme
            ? <LoadingWrapper />
            : <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="主旨"
                            value={subject}
                            onChangeText={setSubject}
                            placeholderTextColor="#666"
                            keyboardType="default"
                            returnKeyType="done"
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder="請描述您的問題或反饋..."
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={8}
                            placeholderTextColor="#666"
                            keyboardType="default"
                            returnKeyType="done"
                        />
                        <Pressable 
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            <Text style={styles.submitButtonText}>
                                {isLoading ? '發送中...' : '發送'}
                            </Text>
                        </Pressable>

                        <Text style={styles.note}>
                            {`感謝您的耐心撰寫，您的回報（反饋）將作為信件寄給我們的開發人員，請耐心等待後續，我們會在必要時回信至您目前的信箱（${user.email}）。`}
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
    );
};

export default Report;