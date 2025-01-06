import { getUserTheme } from '@/theme';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SetUpUserStateInterface, UserState } from './interfaces/userState.interface';
import { SetUpUserLanguageSettingsInterface, SetUpUserThemeSettingsInterface, UserSettings } from './interfaces/userSettings.interface';
import { SetUpUserInfosInterface, UserInfos } from './interfaces/userInfos.interface';
import i18n from '../locales/i18next';
import { SetUpUserAuthsInterface, UserAuths } from './interfaces/userAuths.interface';

interface AllState extends Partial<UserState & UserSettings> {
  info: UserInfos | null;
  auth: UserAuths | null;
}

const initialState: AllState = {
  userName: '',
  role: null, 
  email: '', 

  themeName: null, 
  theme: null, 
  language: 'zh', 
  
  info: null,
  
  auth: null, 
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
    setUserThemeSettings: (state, action: PayloadAction<SetUpUserThemeSettingsInterface>) => {
      state.themeName = action.payload.themeName;
      state.theme = getUserTheme(action.payload.themeName ?? "DarkTheme");
    }, 
    setUserLanguageSettings: (state, action: PayloadAction<SetUpUserLanguageSettingsInterface>) => {
      state.language = action.payload.language;
      i18n.changeLanguage(action.payload.language);
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
        avgStarRating: action.payload.avgStarRating ?? null, 
        createdAt: action.payload.createdAt ?? null,
        updatedAt: action.payload.updatedAt ?? null,
      };
    }, 
    setUserAuths: (state, action: PayloadAction<Partial<SetUpUserAuthsInterface>>) => {
      state.auth = {
        ...state.auth, 
        isDefaultAuthenticated: action.payload.isDefaultAuthenticated ?? state.auth?.isDefaultAuthenticated ?? false,
        isEmailAuthenticated: action.payload.isEmailAuthenticated ?? state.auth?.isEmailAuthenticated ?? false,
        isGoogleAuthenticated: action.payload.isGoogleAuthenticated ?? state.auth?.isGoogleAuthenticated ?? false,
        isPhoneAuthenticated: action.payload.isPhoneAuthenticated ?? state.auth?.isPhoneAuthenticated ?? false,
      };
    },
    clearUser: (state) => {
      state.userName = '';
      state.role = null;
      state.email = '';
      // note that we don't need to reset(clear) the user settings
      state.auth = null;
      state.info = null;
    }
  }
});

export const { setUser, clearUser, setUserThemeSettings, setUserLanguageSettings, setUserInfos, setUserAuths } = userSlice.actions;
export default userSlice.reducer;
