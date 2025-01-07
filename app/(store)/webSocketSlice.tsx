// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface Notification {
//   id: string;
//   title: string;
//   description: string;
// }

// interface WebSocketState {
//   socket: WebSocket | null;
//   notifications: Notification[];
// }

// interface SetupWebSocketPayloadInterface {
//     token: string | null;
// }

// const initialState: WebSocketState = {
//   socket: null,
//   notifications: [],
// };

// const webSocketSlice = createSlice({
//   name: 'webSocket',
//   initialState,
//   reducers: {
//     setSocket(state, action: PayloadAction<SetupWebSocketPayloadInterface>) {
//       if (action.payload.token) {
//         const socket = new WebSocket('ws://https://motoshare-x7gp.onrender.com/notifications', {
//             headers: {
                
//             }, 
//         });
//       }
//     },
//     addNotification(state, action: PayloadAction<Notification>) {
//       state.notifications.push(action.payload);
//     },
//     clearNotifications(state) {
//       state.notifications = [];
//     },
//   },
// });

// export const { setSocket, addNotification, clearNotifications } = webSocketSlice.actions;
// export default webSocketSlice.reducer;