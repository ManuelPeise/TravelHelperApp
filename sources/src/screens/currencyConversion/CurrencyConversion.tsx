import React from 'react';
import { CurrencyConversionStackParamList } from '@/lib/types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import AppHeader from '@/components/AppHeader';
import CurrencyConversionScreen from './CurrencyConversionScreen';
import ImpressumScreen from '../impressum/ImpressumScreen';

const Stack = createNativeStackNavigator<CurrencyConversionStackParamList>();

const CurrencyConversion: React.FC = () => {
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: appTheme.text.primary,
        contentStyle: { backgroundColor: appTheme.background.primary },
        header: props => <AppHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="CurrencyConversion"
        component={CurrencyConversionScreen}
        options={{ title: getResource('titleCurrencyCalculator') }}
      />
      <Stack.Screen
        name="Impressum"
        component={ImpressumScreen}
        options={{ title: getResource('labelImpressum') }}
      />
    </Stack.Navigator>
  );
};

export default CurrencyConversion;
