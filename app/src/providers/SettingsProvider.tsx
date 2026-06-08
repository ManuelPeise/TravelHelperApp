import {
  saveOrUpdateSettings,
  getSettingsFromDb,
} from '@/lib/database/SettingsRepository';
import { CurrencyEnum } from '@/lib/enums/CurrencyEnum';
import { Settings } from '@/lib/types/Settings';
import React, { useCallback, useState } from 'react';

export type SettingsContextType = {
  settings: Settings | null;
  saveOrUpdateSettings: (settings: Settings, updateExisting?: boolean) => void;
};

export const SettingsContext = React.createContext<SettingsContextType>({
  settings: null,
  saveOrUpdateSettings: () => {},
});

interface IProps extends React.PropsWithChildren {}

const SettingsProvider: React.FC<IProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);

  const saveSettings = useCallback(
    async (settings: Settings, updateExisting?: boolean) => {
      await saveOrUpdateSettings(settings, updateExisting).then(() => {
        setSettings(settings);
      });
    },
    [],
  );

  React.useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettingsFromDb();
      if (settings) {
        setSettings(settings);
      } else {
        setSettings({
          id: 1,
          sourceCurrency: CurrencyEnum.EUR,
          targetCurrency: CurrencyEnum.DKK,
          theme: 'system',
        });
      }
    };
    loadSettings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveOrUpdateSettings: saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
