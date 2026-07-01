import AppHeader from '@/components/AppHeader';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { PackingListStackParamList } from '@/lib/types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { PackingListOverviewScreen } from './PackingListOverviewScreen';
import { PackingListDetails } from './PackingListDetails';

const Stack = createNativeStackNavigator<PackingListStackParamList>();

export const PackingListScreen = () => {
  const { getResource } = useLocalization();
  const { appTheme } = useSettingsContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: appTheme.text.primary,
        contentStyle: { backgroundColor: appTheme.background.primary },
        header: props => <AppHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="PackingListOverview"
        component={PackingListOverviewScreen}
        options={{
          title: getResource('titleAvailablePackingLists'),
        }}
      />
      <Stack.Screen
        name="PackingListDetail"
        component={PackingListDetails}
        options={() => ({
          title: getResource('titleViewPackingList'),
        })}
      />
    </Stack.Navigator>
  );
};

export default PackingListScreen;
