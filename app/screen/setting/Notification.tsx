// import { RootState } from '@/app/(store)';
// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
// import { scale, verticalScale } from 'react-native-size-matters';
// import { useSelector } from 'react-redux';
// import { NotificationStyles } from './Notification.style';
// import LoadingWrapper from '@/app/component/LoadingWrapper/LoadingWrapper';

// const notificationsData = [
//   { id: '1', title: '新消息通知', description: '您有一條新消息。' },
//   { id: '2', title: '系統更新', description: '系統已成功更新。' },
//   { id: '3', title: '活動提醒', description: '不要錯過即將到來的活動！' },
// ];

// const Notification = () => {
//     const user = useSelector((state: RootState) => state.user);
//     const theme = user.theme;
//     const { t } = useTranslation();

//     const [styles, setStyles] = useState<any>(null)

//     useEffect(() => {
//         if (theme) {
//             setStyles(NotificationStyles(theme));
//         }
//     }, [theme]);

//   const renderItem = ({ item }) => (
//     <View style={styles.notificationItem}>
//       <Text style={styles.notificationTitle}>{item.title}</Text>
//       <Text style={styles.notificationDescription}>{item.description}</Text>
//     </View>
//   );

//   return (
//     !styles || !theme
//         ? <LoadingWrapper />
//         : (<View style={styles.container}>
//             <Text style={styles.title}>{t("Notification List")}</Text>
//             <FlatList
//                 data={notificationsData}
//                 renderItem={renderItem}
//                 keyExtractor={item => item.id}
//             />
//             <Pressable style={styles.button} onPress={() => {/* Handle action */}}>
//                 <Text style={styles.buttonText}>{t("Clear All Notifications")}</Text>
//             </Pressable>
//         </View>)
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: scale(20),
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: scale(24),
//     fontWeight: 'bold',
//     marginBottom: verticalScale(20),
//   },
//   notificationItem: {
//     padding: scale(15),
//     borderBottomWidth: 1,
//     borderBottomColor: '#d3d3d3',
//     marginBottom: verticalScale(10),
//   },
//   notificationTitle: {
//     fontSize: scale(18),
//     fontWeight: 'bold',
//   },
//   notificationDescription: {
//     fontSize: scale(16),
//     color: '#555',
//   },
//   button: {
//     backgroundColor: '#3498db',
//     paddingVertical: verticalScale(10),
//     borderRadius: scale(5),
//     alignItems: 'center',
//     marginTop: verticalScale(20),
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: scale(16),
//   },
// });

// export default Notification;