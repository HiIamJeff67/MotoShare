import { DefaultTheme } from '@react-navigation/native';

export const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        backgroundWhite: '#ffffff', // 自定義背景
        background: '#F5F5F5', // 自定義背景
    },
};

export type Theme = typeof MyTheme;

export const MyDarkTheme: Theme = {
    ...MyTheme,
    colors: {
        ...MyTheme.colors,
        backgroundWhite: '#000000', // 自定義背景
        primary: '#BB86FC', // 主色
        background: '#000000', // 背景色
        card: '#1E1E1E', // 卡片背景色
        text: '#FFFFFF', // 主文字顏色
        border: '#444444', // 邊框顏色
        notification: '#FF7043', // 通知顏色
    },
};