import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
    return (
        <SafeAreaView className="flex-1">
            <Text className="text-4xl pb-5 font-bold">Home Page</Text>
        </SafeAreaView>
    );
};

export default Home;