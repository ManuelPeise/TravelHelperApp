import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AppHeaderProps {
  navigation: { goBack: () => void };
  options: {
    title?: string;
    headerRight?: (props: {
      tintColor?: string;
      pressColor?: string;
      pressOpacity?: number;
      canGoBack: boolean;
    }) => React.ReactNode;
  };
  back?: { title: string | undefined; href?: string | undefined };
}

const AppHeader: React.FC<AppHeaderProps> = ({ options, navigation, back }) => {
  const { appTheme } = useSettingsContext();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: appTheme.background.primary,
          borderBottomColor: appTheme.border,
        },
      ]}
    >
      {back && (
        <TouchableOpacity onPress={navigation.goBack} style={styles.back}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={appTheme.text.primary}
          />
        </TouchableOpacity>
      )}
      <Text
        style={[styles.title, { color: appTheme.text.primary }]}
        numberOfLines={1}
      >
        {options.title ?? ''}
      </Text>
      {options.headerRight && (
        <View style={styles.right}>
          {options.headerRight({
            tintColor: appTheme.text.primary,
            canGoBack: !!back,
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  back: {
    marginRight: 8,
  },
  title: {
    marginLeft: 20,
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  right: {
    marginLeft: 8,
  },
});

export default AppHeader;
