import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VocabularyScreen from '@/screens/vocabularyScreen/VocabularyScreen';
import type { RootTabParamList } from '@lib/types/navigation';
import SettingsScreen from '@/screens/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import CurrencyConversionScreen from '@/screens/CurrencyConversionScreen';
import { ShoppingListScreen } from '@/screens/shoppingList/ShoppingListScreen';
import { useLocalization } from '@/hooks/useLocalization';

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
        headerStyle: { backgroundColor: appTheme.background.primary },
        headerTintColor: appTheme.text.primary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          if (route.name === 'CurrencyConversion') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Vocabulary') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'ShoppingList') {
            iconName = focused ? 'list' : 'list-outline';
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
        component={CurrencyConversionScreen}
        options={{
          headerShown: false,
          tabBarLabel: getResource('titleCurrencyCalculator'),
        }}
      />
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{
          headerShown: false,
          tabBarLabel: getResource('titleShoppingLists'),
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
          headerShown: false,
          tabBarLabel: getResource('titleSettings'),
        }}
      />
    </Tab.Navigator>
  );
}
