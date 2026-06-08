import { useSettingsContext } from '@/hooks/useSettingsContext';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const { appTheme, settings } = useSettingsContext();

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: appTheme.background.primary,
        gap: 10,
      }}
    >
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: appTheme.card,
          borderRadius: 0,
        }}
      >
        <Text
          style={{
            color: appTheme.text.secondary,
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Währungsrechner
        </Text>
        <Text style={{ color: appTheme.text.secondary, marginTop: 12 }}>
          Hier können Sie Ihre Währungen umrechnen.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
