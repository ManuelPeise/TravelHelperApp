import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { Switch, Text, View } from 'react-native';

interface SwitchComponentProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SwitchComponent: React.FC<SwitchComponentProps> = props => {
  const { label, value, onValueChange } = props;
  const { appTheme } = useSettingsContext();

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: appTheme.background.secondary,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: appTheme.text.primary,
            fontSize: 14,
            fontWeight: '500',
          }}
        >
          {label}
        </Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: appTheme.background.secondary,
            true: appTheme.background.accent,
          }}
          thumbColor={value ? appTheme.background.disabled : appTheme.border}
        />
      </View>
    </View>
  );
};

export default SwitchComponent;
