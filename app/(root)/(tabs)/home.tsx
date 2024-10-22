import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../(store)/index';

const UserInfo = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <SafeAreaView>
        <View style={styles.container}>
        <Text style={styles.title}>
            {user ? (
            <>
                <Text style={styles.info}>ID: {user.id}</Text>
                {'\n'}
                <Text style={styles.info}>用户名: {user.username}</Text>
                {'\n'}
                <Text style={styles.info}>角色: {user.role}</Text>
            </>
            ) : (
            <Text style={styles.info}>未登录</Text>
            )}
        </Text>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  info: {
    fontSize: 20,
    paddingBottom: 10,
  },
});

export default UserInfo;
