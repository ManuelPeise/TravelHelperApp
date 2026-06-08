import { StyleSheet } from 'react-native';

export const customStyles = (backgroundColor: any, borderColor: any) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      borderColor: borderColor,
      borderWidth: 1,
    },
    sheet: {
      backgroundColor: backgroundColor,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: '80%',
    },
  });
};
