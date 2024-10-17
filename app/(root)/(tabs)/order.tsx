import { router } from "expo-router";
import { Text, View, Platform, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Order = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Pressable 
                onPress={() => router.push("../orderdetail")}
            >
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.orderNumber}>訂單編號: xxxxxxxxxxxxx</Text>
                    </View>
            
                    <View style={styles.body}>
                        <Text style={styles.textBase}>訂單日期: 2024/10/17 | 未知</Text>
                        <Text style={styles.title}>起點：台灣海洋大學</Text>
                        <Text style={styles.title}>終點：基隆火車站</Text>
                    </View>
                </View>
            </Pressable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, // Android 的陰影
    },
    header: {
      borderBottomWidth: 2,
      borderBottomColor: '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    orderNumber: {
      color: '#333',
      fontWeight: 'bold',
      fontSize: 16,
    },
    body: {
      padding: 16,
    },
    textBase: {
      marginBottom: 10,
      fontSize: 14,
      color: '#666',
    },
    title: {
      marginBottom: 10,
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
  });

export default Order;