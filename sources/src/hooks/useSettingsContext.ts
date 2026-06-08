import { AppTheme, darkTheme, lightTheme } from '@/lib/theme';
import { SettingsContext } from '@/providers/SettingsProvider';
import React from 'react';

export const useSettingsContext = () => {
  const context = React.useContext(SettingsContext);

  if (!context) {
    throw new Error(
      'useSettingsContext must be used within a SettingsProvider',
    );
  }

  const appTheme = React.useMemo((): AppTheme => {
    switch (context.settings?.theme) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      default:
        return lightTheme;
    }
  }, [context.settings?.theme]);

  return {
    settings: context.settings,
    saveOrUpdateSettings: context.saveOrUpdateSettings,
    appTheme,
  };
};
