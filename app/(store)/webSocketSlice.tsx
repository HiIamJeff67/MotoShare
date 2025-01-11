import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  title: string;
  description: string | undefined;
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
      state.notifications = [];
      state.newMessage = 0;
      state.isConnected = false;
    }, 
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
      state.newMessage += 1;
      // console.log(state.notifications);
    }, 
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = [
        ...state.notifications,
        ...action.payload.filter(
          (newNotification) =>
            !state.notifications.some((existing) => existing.id === newNotification.id)
        ),
      ];
      state.newMessage = state.notifications.filter(notification => !notification.isRead).length;
    }, 
    clearNotifications(state) {
      state.notifications = [];
      state.newMessage = 0;
    }, 
  },
});

export const { connectToSocket, disconnectToSocket, addNotification, clearNotifications, setNotifications } = webSocketSlice.actions;
export default webSocketSlice.reducer;
