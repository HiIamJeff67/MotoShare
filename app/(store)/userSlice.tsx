import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  username: string;
  role: string;
}

const initialState: UserState = {
  id: '',
  username: '',
  role: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.id = '';
      state.username = '';
      state.role = '';
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
