import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  title: string;
  description: string;
  notificationType: string;
  isRead: boolean;
  createdAt: Date;
}

interface WebSocketState {
  isConnected: boolean; // 使用 Socket 類型
  notifications: Notification[];
  newMessage: number;
}

const initialState: WebSocketState = {
  isConnected: false,
  notifications: [],
  newMessage: 0,
};

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    connectToSocket(state) {
      state.isConnected = true;
    },
    disconnectToSocket(state) {
      state.isConnected = false;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
      state.newMessage += 1;
      console.log(state.notifications);
    },
    clearNotificationNewMessage(state) {
      state.newMessage = 0;
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = [...state.notifications, ...action.payload];
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { connectToSocket, disconnectToSocket, addNotification, clearNotifications, clearNotificationNewMessage } = webSocketSlice.actions;
export default webSocketSlice.reducer;
