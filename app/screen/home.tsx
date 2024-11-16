import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../(store)/index';

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
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
        <Text style={styles.welcomeText}>歡迎{roleText}，{user.username}</Text>
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


export default Home;