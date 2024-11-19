import { View, Text, StyleSheet,Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../(store)/';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();

  let roleText = "載入中...";

  if (user.role == 1)
  {
    roleText = "乘客";
  }
  else if (user.role == 2)
  {
    roleText = "車主";
  }

  return (
    <SafeAreaView className='flex-1'>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>歡迎{roleText}, {user.username}</Text>

        <View style={styles.inputWrapper}>
          <Image 
              source={require('../../assets/images/search.png')}  
              style={styles.icon} 
            />
          <TextInput
            style={styles.textInput}
            className="rounded-lg"
            placeholder="Where to go"
            placeholderTextColor="#000000"
          />
        </View>

        <Text style={styles.MainText}>建議</Text>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textInput: {
    flex: 1, // 使輸入框填滿剩餘空間
    height: '100%', // 確保輸入框高度和容器一致
    borderWidth: 0,
    color: '#000', // 文字顏色
    paddingLeft: 5, // 防止文字貼邊
  },
  inputWrapper: {
    flexDirection: 'row', // 讓圖標和輸入框水平排列
    alignItems: 'center', // 垂直居中
    height: 50,
    width: 350,
    backgroundColor: '#e3e1e1', // 背景色
    borderRadius: 60, // 圓角
    paddingHorizontal: 20, // 左右內邊距
    borderColor: '#0000000',
    marginTop: 30,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10, // 圖標與文字之間的距離
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

export default Home;