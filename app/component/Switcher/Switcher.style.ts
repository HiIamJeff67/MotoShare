import { StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

export const SwitcherStyles = (theme: any) => {
  const [_colors, _fonts] = [theme.colors, theme.fonts];

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: _colors.card,
      borderRadius: scale(15),
      padding: scale(16),
      alignItems: 'center',
    },
    modalTitle: {
      color: _colors.primary,
      fontSize: 18,
      fontWeight: _fonts.bold.fontWeight,
      marginBottom: 12,
    },
    optionButton: {
      width: '100%',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: _colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    optionText: {
      fontSize: 16,
      color: _colors.text,
      fontWeight: _fonts.heavy.fontWeight,
    },
    cancelButton: {
      marginTop: 12,
      backgroundColor: _colors.notification,
      borderRadius: 10,
      width: '100%',
      padding: 12,
      alignItems: 'center',
    },
    cancelText: {
      fontSize: 16,
      color: _colors.text,
      fontWeight: _fonts.heavy.fontWeight,
    },
  });
};

export const __styles = StyleSheet.create({});