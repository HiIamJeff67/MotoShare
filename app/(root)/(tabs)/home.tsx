import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";

const Home = () => {
  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 bg-gray-100 justify-center items-center'>
        <Pressable 
                  style={{ 
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                  }}
                  className="rounded-lg bg-[#3498db] shadow-2xl shadow-sky-400 w-full"
                  onPress={() => router.push("../map")}
              >
                  <Text className="text-white">Test Map</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Home;