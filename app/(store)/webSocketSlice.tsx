import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from "expo-secure-store";
import { UserRoleType } from './interfaces/userState.interface';

interface Notification {
  id: string;
  title: string;
  description: string;
}

interface WebSocketState {
  isConnected: boolean; // 使用 Socket 類型
  notifications: Notification[];
}

const initialState: WebSocketState = {
  isConnected: false, 
  notifications: [],
};

const webSocketSlice = createSlice({
  name: 'webSocket',
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
      console.log(state.notifications);
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
        state.notifications = [...state.notifications, ...action.payload];
    }, 
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { connectToSocket, disconnectToSocket, addNotification, clearNotifications } = webSocketSlice.actions;
export default webSocketSlice.reducer;