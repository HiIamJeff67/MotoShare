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
import { useTranslation } from 'react-i18next';

const Report = () => {
    const navigation = useNavigation();
    const user = useSelector((state: RootState) => state.user);
    const theme = user.theme;
    const insets = useSafeAreaInsets();

    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [styles, setStyles] = useState<any>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (theme) {
            setStyles(ReportStyles(theme, insets))
        }
    }, [theme]);

    const handleSubmit = async () => {
        if (!subject.trim() || !content.trim()) {
            Alert.alert(t('error'), t('Please fill in the subject and content'));
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
                    t('success'),
                    t('thank you for your feedback'),
                    [
                        {
                            text: t('confirm'),
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            }
        } catch (error) {
            Alert.alert(t('error'), t("sending error"));
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
                            placeholder={t("subject")}
                            value={subject}
                            onChangeText={setSubject}
                            placeholderTextColor="#666"
                            keyboardType="default"
                            returnKeyType="done"
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder={t("please describe you problem or feedback")}
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
                                {isLoading ? t('sending') : t('send')}
                            </Text>
                        </Pressable>

                        <Text style={styles.note}>
                            {`${t("feedback sentence")} (${user.email})。`}
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
    );
};

export default Report;