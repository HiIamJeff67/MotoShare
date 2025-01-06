import { StyleSheet } from 'react-native';

export const AbsoluteLoadingWrapperStyles = (theme: any) => {
  const _colors = theme.colors;

  return StyleSheet.create({
    container: {
      position: 'absolute',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 10000,
    },
    icon: {
      color: _colors.text,
    }
  });
}