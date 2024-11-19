import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../(store)/';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

const Service = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();

  return (
    <SafeAreaView className='flex-1'>
      <View style={styles.container}>
        <Text style={styles.MainText}>服務</Text>
        <View className='h-10' />
        <View className='flex flex-row justify-between items-center'>
          <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('map')}
          >
            <View className='items-center'>
              <FontAwesome6 name="motorcycle" size={24} color="black" />
              <Text style={{ marginTop: 5 }}>建立訂單</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('order')}
          >
            <View className='items-center'>
              <FontAwesome6 name="list" size={24} color="black" />
              <Text style={{ marginTop: 5 }}>查看訂單</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('myinvite')}
          >
            <View className='items-center'>
              <Ionicons name="people" size={24} color="black" />
              <Text style={{ marginTop: 5 }}>查看邀請</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('myorder')}
          >
            <View className='items-center'>
              <FontAwesome6 name="edit" size={24} color="black" />
              <Text style={{ marginTop: 5 }}>訂單管理</Text>
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
  MainText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  card: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 'bold',
  }
});

export default Service;