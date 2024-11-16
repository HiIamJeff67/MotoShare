import { Text, View, Image, Pressable, StyleSheet, ImageBackground  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View className="justify-center items-center"
                style={{ 
                    top: 110,
                }}>
                
                <Text className="text-white text-4xl pb-5 font-bold">選擇你的身份</Text>
            </View>

            <View className="justify-center items-center">
                <Image
                    source={require('../../assets/images/motorbike.jpg')}
                    style={{ 
                        width: 300, 
                        height: 300,
                        position: 'absolute',
                        top: 150,
                    }}
                />
            </View>

            <View className="justify-center items-center">
                <Pressable 
                    style={{ 
                        width: 300,
                        height: 50,
                        position: 'absolute',
                        top: 480,
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
                        width: 300,
                        height: 50,
                        position: 'absolute',
                        top: 550,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    className="rounded-lg bg-white shadow-lg"
                    onPress={() => navigation.navigate("rlogin")}
                >
                <Text className="font-semibold text-black text-lg">我是車主</Text>
                </Pressable>
            </View>

        </SafeAreaView>

);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3498db', // 手動設置 sky-blue-400 的顏色
    },
});

export default WelcomeScreen;