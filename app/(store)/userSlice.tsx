import { getUserTheme, ThemeType } from '@/theme';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SetUpUserStateInterface, UserState } from './interfaces/userState.interface';
import { SetUpUserSettingsInterface, UserSettings } from './interfaces/userSettings.interface';
import { SetUpUserInfosInterface, UserInfos } from './interfaces/userInfos.interface';

interface AllState extends Partial<UserState & UserSettings> {
  info: UserInfos | null
}

const initialState: AllState = {
  userName: '',
  role: null, 
  email: '', 
  themeName: null, 
  theme: null, 
  info: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUpUserStateInterface>) => {
      state.userName = action.payload.userName;
      state.role = action.payload.role;
      state.email = action.payload.email;
    },
    setUserSettings: (state, action: PayloadAction<SetUpUserSettingsInterface>) => {
      state.themeName = action.payload.themeName;
      state.theme = getUserTheme(action.payload.themeName ?? "DarkTheme");
    }, 
    setUserInfos: (state, action: PayloadAction<SetUpUserInfosInterface>) => {
      state.info = {
        isOnline: true,
        age: action.payload.age ?? null,
        phoneNumber: action.payload.phoneNumber ?? null,
        emergencyPhoneNumber: action.payload.emergencyPhoneNumber ?? null,
        emergencyUserRole: action.payload.emergencyUserRole ?? null,
        selfIntroduction: action.payload.selfIntroduction ?? null,
        avatorUrl: action.payload.avatorUrl ?? null,
        createdAt: action.payload.createdAt ?? null,
        updatedAt: action.payload.updatedAt ?? null,
      };
    }, 
    clearUser: (state) => {
      state.userName = '';
      state.role = null;
    }
  }
});

export const { setUser, clearUser, setUserSettings, setUserInfos } = userSlice.actions;
export default userSlice.reducer;
