import { LanguageType } from "@/app/locales/language";
import { ThemeType } from "@/theme";
import { Theme } from "@/theme/theme";

export interface UserSettings {
    themeName: ThemeType | null;
    theme: Theme | null;

    language: LanguageType;
}

export interface SetUpUserThemeSettingsInterface {
    themeName: ThemeType | null;
}

export interface SetUpUserLanguageSettingsInterface {
    language: LanguageType
}