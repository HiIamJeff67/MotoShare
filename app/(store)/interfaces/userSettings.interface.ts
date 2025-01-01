import { ThemeType } from "@/theme";
import { Theme } from "@/theme/theme";

export interface UserSettings {
    themeName: ThemeType | null;
    theme: Theme | null;
}

export interface SetUpUserSettingsInterface {
    themeName: ThemeType | null;
}