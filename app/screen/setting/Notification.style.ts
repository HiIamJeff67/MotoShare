import { Theme } from "@/theme/theme";
import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

export const NotificationStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
          flex: 1,
          padding: scale(20),
          backgroundColor: '#fff',
        },
        title: {
          fontSize: scale(24),
          fontWeight: 'bold',
          marginBottom: verticalScale(20),
        },
        notificationItem: {
          padding: scale(15),
          borderBottomWidth: 1,
          borderBottomColor: '#d3d3d3',
          marginBottom: verticalScale(10),
        },
        notificationTitle: {
          fontSize: scale(18),
          fontWeight: 'bold',
        },
        notificationDescription: {
          fontSize: scale(16),
          color: '#555',
        },
        button: {
          backgroundColor: '#3498db',
          paddingVertical: verticalScale(10),
          borderRadius: scale(5),
          alignItems: 'center',
          marginTop: verticalScale(20),
        },
        buttonText: {
          color: '#fff',
          fontSize: scale(16),
        },
      });
}

export const __styles = StyleSheet.create({});