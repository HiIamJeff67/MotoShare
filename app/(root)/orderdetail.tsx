import { Text, View, Platform, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderDetail = () => {
    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.orderNumber}>訂單編號: xxxxxxxxxxxxx</Text>
                </View>
        
                <View style={styles.body}>
                    <Text style={styles.textBase}>訂單日期: 2024/10/17 | 未知</Text>
                    <Text style={styles.title}>機車型號：Yamaha EC-05</Text>
                    <Text style={styles.title}>車牌號碼：ABC-1234</Text>
                    <Text style={styles.title}>起點：台灣海洋大學</Text>
                    <Text style={styles.title}>終點：基隆火車站</Text>
                    <Text style={styles.title}>開始時間：2024-10-16 14:30</Text>
                    <Text style={styles.title}>到達時間：2024-10-16 14:31</Text>
                </View>
            </View>

            <View className="h-10"></View>

            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.orderNumber}>車主資料:</Text>
                </View>
        
                <View style={styles.body}>
                    <Text style={styles.title}></Text>
                    <Text style={styles.title}>車牌號碼：ABC-1234</Text>
                    <Text style={styles.title}>起點：台灣海洋大學</Text>
                    <Text style={styles.title}>終點：基隆火車站</Text>
                    <Text style={styles.title}>開始時間：2024-10-16 14:30</Text>
                    <Text style={styles.title}>到達時間：2024-10-16 14:31</Text>
                </View>
            </View>

          </SafeAreaView>
        </ScrollView>
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

export default OrderDetail;