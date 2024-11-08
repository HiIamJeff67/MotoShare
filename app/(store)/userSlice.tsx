import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  role: number;
}

const initialState: UserState = {
  username: '',
  role: 0
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.username = '';
      state.role = 0;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
