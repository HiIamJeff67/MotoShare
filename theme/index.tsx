import { LightTheme, DarkTheme } from "./theme";

export type ThemeType = "LightTheme" | "DarkTheme"

export const getUserTheme = (themeType: ThemeType) => {
    switch(themeType) {
        case "LightTheme": return LightTheme;
        case "DarkTheme": return DarkTheme;
    }
}