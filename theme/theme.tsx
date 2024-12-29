import { DefaultTheme } from '@react-navigation/native';

interface ColorFieldInterface {
    primary: string
    secondary: string
    background: string
    card: string
    text: string
    border: string
    notification: string
}

export type Theme = typeof DefaultTheme;

export const LightTheme: Theme = {
    dark: false, 
    colors: {
        primary: '#3B5998', 
        background: '#F7F9FC', 
        card: '#FFFFFF', 
        text: '#1C1C1E', 
        border: '#e3e1e1', 
        notification: '#FF5A5F', 
    },
    fonts: {
        regular: {
            fontFamily: "", 
            fontWeight: '400', 
        }, 
        medium: {
            fontFamily: "", 
            fontWeight: '500', 
        }, 
        heavy: {
            fontFamily: "", 
            fontWeight: '600', 
        },
        bold: {
            fontFamily: "", 
            fontWeight: 'bold', 
        }, 
    }
};

export const DarkTheme: Theme = {
    dark: true, 
    colors: {
        primary: '#4C8BF5',
        background: '#1C1C1E',
        card: '#2C2C2E',
        text: '#FFFFFF',
        border: '#777777',
        notification: '#FF5A5F',
    },
    fonts: {
        regular: {
            fontFamily: "", 
            fontWeight: '400', 
        }, 
        medium: {
            fontFamily: "", 
            fontWeight: '500', 
        }, 
        heavy: {
            fontFamily: "", 
            fontWeight: '600', 
        }, 
        bold: {
            fontFamily: "", 
            fontWeight: 'bold', 
        }, 
    }
};