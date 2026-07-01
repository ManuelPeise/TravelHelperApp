import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShoppingListStackParamList } from '@/lib/types/navigation';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import ShoppingListOverviewScreen from './ShoppingListOverviewScreen';
import ShoppingListDetailScreen from './ShoppingListDetailScreen';
import { useLocalization } from '@/hooks/useLocalization';
import AppHeader from '@/components/AppHeader';

const Stack = createNativeStackNavigator<ShoppingListStackParamList>();

export const ShoppingListScreen: React.FC = () => {
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
        name="ShoppingListOverview"
        component={ShoppingListOverviewScreen}
        options={{ title: getResource('titleAvailableShoppingLists') }}
      />
      <Stack.Screen
        name="ShoppingListDetail"
        component={ShoppingListDetailScreen}
        options={({ route }) => ({ title: route.params.shoppingName })}
      />
    </Stack.Navigator>
  );
};

export default ShoppingListScreen;
