import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '@/navigation/AppNavigator';
import { initializeDatabase } from '@lib/database/SqliteDb';
import SettingsProvider from '@/providers/SettingsProvider';
import AppContainer from '@/components/AppContainer';

const App: React.FC = () => {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => {
        setDbReady(true);
        console.log('Database initialized successfully');
      })
      .catch(console.error);
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppContainer>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AppContainer>
      </SettingsProvider>
    </SafeAreaProvider>
  );
};

export default App;
