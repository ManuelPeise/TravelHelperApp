import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

interface IProps extends React.PropsWithChildren {}

const AppContainer: React.FC<IProps> = ({ children }) => {
  const { settings, appTheme } = useSettingsContext();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      <StatusBar
        barStyle={settings?.theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 50,
  },
});
export default AppContainer;
