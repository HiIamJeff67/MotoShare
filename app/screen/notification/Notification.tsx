import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import { ScaledSheet, scale, verticalScale, moderateScale } from "react-native-size-matters";
import { FlashList } from "@shopify/flash-list";
import { useDispatch } from "react-redux";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { clearNotificationNewMessage } from "@/app/(store)/webSocketSlice";

interface NotificationType {
  id: string;
  title: string;
  description: string;
  notificationType: string;
  isRead: boolean;
  createdAt: Date;
}

const Notification = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const websocketClient = useSelector((state: RootState) => state.websocket);
  const [orders, setOrders] = useState<NotificationType[]>([]);

  // 使用 useEffect 僅在 websocketClient.notifications 變化時更新狀態
  useEffect(() => {
    setOrders(websocketClient.notifications);
    console.log(websocketClient.notifications);
  }, [websocketClient.notifications]);

  useEffect(() => {
    // 模擬資料加載完成
    const timer = setTimeout(() => {
      setIsLoading(false);
      dispatch(clearNotificationNewMessage());
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <LoadingWrapper />
      ) : (
        <FlashList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.container}>
              <View style={styles.card}>
                <View style={styles.header}>
                  <Text style={styles.number}>ID: {item.id}</Text>
                </View>
                <View style={styles.body}>
                  <Text style={styles.title}>Title: {item.title}</Text>
                  <Text style={styles.title}>NotificationType: {item.notificationType}</Text>
                  <Text style={styles.title}>Description: {item.description}</Text>
                  <Text style={styles.title}>
                    CreatedAt:{" "}
                    {new Date(item.createdAt).toLocaleString("en-GB", {
                      timeZone: "Asia/Taipei",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}
          estimatedItemSize={282}
          contentContainerStyle={{
            paddingHorizontal: scale(20),
            paddingVertical: verticalScale(15),
          }}
        />
      )}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingBottom: verticalScale(15),
  },
  card: {
    backgroundColor: "white",
    borderRadius: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: { width: scale(0), height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
    elevation: 5,
  },
  header: {
    borderBottomWidth: scale(2),
    borderBottomColor: "#ddd",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
  },
  number: {
    color: "#333",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  body: {
    padding: moderateScale(16),
  },
  title: {
    marginBottom: verticalScale(5),
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: "#333",
  },
});

export default Notification;
