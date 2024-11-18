import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../(store)/';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';

const Service = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();

  return (
    <SafeAreaView className='flex-1'>
      <View style={styles.container}>
        <View className='h-5' />
        <View className='flex flex-row justify-between items-center'>
          <TouchableOpacity className='p-4 rounded-xl bg-gray-200 items-center'
            onPress={() => navigation.navigate('map')}
          >
            <View className='flex items-center'>
              <SimpleLineIcons name="camrecorder" size={24} color="black" />
              <Text>建立訂單</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className='p-4 rounded-xl bg-gray-200 items-center'
            onPress={() => navigation.navigate('order')}
          >
            <View className='flex items-center'>
              <SimpleLineIcons name="camrecorder" size={24} color="black" />
              <Text>訂單</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className='p-4 rounded-xl bg-gray-200 items-center'
            onPress={() => navigation.navigate('myinvite')}
          >
            <View className='flex items-center'>
              <SimpleLineIcons name="camrecorder" size={24} color="black" />
              <Text>邀請</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className='p-4 rounded-xl bg-gray-200 items-center'
            onPress={() => navigation.navigate('myorder')}
          >
            <View className='flex items-center'>
              <SimpleLineIcons name="camrecorder" size={24} color="black" />
              <Text>訂單管理</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});


export default Service;