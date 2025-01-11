import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../(store)";
import { useDispatch } from "react-redux";
import LoadingWrapper from "@/app/component/LoadingWrapper/LoadingWrapper";
import { NotificationStyles } from "./Notification.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationInfoCard from "@/app/component/NotificationInfoCard/NotificationDetailCard";
import { NotificationInterface } from "@/interfaces/userNotifications.interface";
import { setNotifications } from "../../(store)/webSocketSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const theme = user.theme;
  const insets = useSafeAreaInsets();
  const websocketClient = useSelector((state: RootState) => state.websocket);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [localNotifications, setLocalNotifications] = useState<NotificationInterface[]>([]);
  const [selectedNotificationInfo, setSelectedNotificationInfo] = useState<any>(null);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
    if (theme) {
      setStyles(NotificationStyles(theme, insets));
    }
  }, [theme]);

  useEffect(() => {
    setLocalNotifications(websocketClient.notifications);
  }, [websocketClient.notifications]);

  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await SecureStore.getItemAsync("userToken");
      setToken(userToken);
    }

    fetchToken();
  }, []);

  useEffect(() => {
    getUserNotifications();
  }, [token]);

  // get the static notifications from database
  const getUserNotifications = async () => {
    if (token && token.length !== 0) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          user.role === "Passenger" 
            ? `${process.env.EXPO_PUBLIC_API_URL}/passengerNotification/searchMyPaginationPassengerNotifications`
            : `${process.env.EXPO_PUBLIC_API_URL}/ridderNotification/searchMyPaginationPassengerNotifications`, 
            {
              params: {
                "limit": 10, 
                "offset": 0, 
              }, 
              headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
                "Authorization": `Bearer ${token}`, 
              }
            }
        )
        
        dispatch(setNotifications(response.data));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const getUserNotificationInfo = async (item: NotificationInterface, index: number) => {
    if (token && token.length !== 0) {
      // we will also update the isRead field of that specified notification
      try {
        setIsDataLoading(true);
        const response = await axios.get(
          user.role === "Passenger"
            ? `${process.env.EXPO_PUBLIC_API_URL}/passengerNotification/getMyPassengerNotificationById`
            : `${process.env.EXPO_PUBLIC_API_URL}/ridderNotification/getMyRidderNotificationById`, 
          {
            params: {
              "id": item.id, 
            }, 
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", 
              "Authorization": `Bearer ${token}`, 
            }
          }
        )
        console.log(response.data);
        setSelectedNotificationInfo(response.data);

        if (!item.isRead) {
          await axios.patch(
            user.role === "Passenger"
              ? `${process.env.EXPO_PUBLIC_API_URL}/passengerNotification/updateMyPassengerNotificationToReadStatus`
              : `${process.env.EXPO_PUBLIC_API_URL}/ridderNotification/updateMyRidderNotificationToReadStatus`, 
            null, 
            {
              params: {
                "id": item.id, 
              }, 
              headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
                "Authorization": `Bearer ${token}`, 
              }
            }
          )
          setLocalNotifications((prev) => {
            const updatedNotifications = [...prev];
            updatedNotifications[index] = {
              ...updatedNotifications[index],
              isRead: true,
            };
            return updatedNotifications;
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          Alert.alert(error.message);
        } else {
          console.log(error);
        }
      } finally {
        setIsDataLoading(false);
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {isLoading || !styles || !theme ? (
        <LoadingWrapper />
      ) : (
        <View style={styles.outerContainer}>
            <ScrollView 
              style={styles.container} 
              showsVerticalScrollIndicator={false}
            >
              {localNotifications.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.container, item.isRead ? styles.readedCard : null]}
                  onPress={() => getUserNotificationInfo(item, index)}
                >
                  <View style={styles.card}>
                    <View style={styles.header}>
                      <Text style={styles.number}>ID: {item.id}</Text>
                    </View>
                    <View style={styles.body}>
                      <Text style={styles.title}>Title: {item.title}</Text>
                      <Text style={styles.title}>
                        NotificationType: {item.notificationType}
                      </Text>
                      <Text style={styles.title}>
                        CreatedAt:{" "}
                        {new Date(item.createdAt).toLocaleString("en-GB", {
                          timeZone: "Asia/Taipei",
                        })}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {selectedNotificationInfo && selectedNotificationInfo.length !== 0 &&
              <NotificationInfoCard 
                notificationDetail={selectedNotificationInfo}
                isDataLoading={isDataLoading}
                onClose={() => setSelectedNotificationInfo(null)}
                theme={theme}
              />
            }
        </View>
      )}
    </View>
  );
};

export default Notification;
