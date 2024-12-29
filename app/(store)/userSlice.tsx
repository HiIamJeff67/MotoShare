import { ThemeType } from '@/theme';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  role: number;
}

interface UserSettings {
  theme: ThemeType | null;
}

interface AllState extends Partial<UserState & UserSettings> {}

const initialState: AllState = {
  username: '',
  role: 0, 
  theme: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    setUserSettings: (state, action: PayloadAction<UserSettings>) => {
      state.theme = action.payload.theme;
      console.log(state.theme)
    }, 
    clearUser: (state) => {
      state.username = '';
      state.role = 0;
    }
  }
});

export const { setUser, clearUser, setUserSettings } = userSlice.actions;
export default userSlice.reducer;
