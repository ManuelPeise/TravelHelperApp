import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VocabularyScreen from '@/screens/vocabularyScreen/VocabularyScreen';
import type { RootTabParamList } from '@lib/types/navigation';
import SettingsScreen from '@/screens/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { ShoppingListScreen } from '@/screens/shoppingList/ShoppingListScreen';
import { useLocalization } from '@/hooks/useLocalization';
import { PackingListScreen } from '@/screens/packingList/PackingListScreen';
import AppHeader from '@/components/AppHeader';
import CurrencyConversion from '@/screens/currencyConversion/CurrencyConversion';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: appTheme.text.secondary,
        tabBarStyle: {
          backgroundColor: appTheme.background.primary,
          borderTopColor: appTheme.border,
          marginBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          if (route.name === 'CurrencyConversion') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Vocabulary') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'ShoppingList') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'PackingList') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return (
            <Ionicons
              style={{ paddingBottom: 0 }}
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="CurrencyConversion"
        component={CurrencyConversion}
        options={{
          headerShown: false,
          tabBarLabel: getResource('labelCurrency'),
          title: getResource('titleCurrencyCalculator'),
        }}
      />
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{
          headerShown: false,
          tabBarLabel: getResource('labelShopping'),
        }}
      />
      <Tab.Screen
        name="PackingList"
        component={PackingListScreen}
        options={{
          headerShown: false,
          tabBarLabel: getResource('labelPacking'),
        }}
      />
      <Tab.Screen
        name="Vocabulary"
        component={VocabularyScreen}
        options={{
          headerShown: false,
          tabBarLabel: getResource('titleVocabulary'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          tabBarLabel: getResource('titleSettings'),
          title: getResource('titleSettings'),
          header: props => <AppHeader {...props} />,
        }}
      />
    </Tab.Navigator>
  );
}
