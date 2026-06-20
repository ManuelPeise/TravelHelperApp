import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface IProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  disabled?: boolean;
  color?: string;
}

const TextInputField: React.FC<IProps> = props => {
  const {
    value,
    onChange,
    placeholder,
    placeholderTextColor,
    disabled,
    color,
  } = props;
  const { appTheme } = useSettingsContext();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: appTheme.background.secondary,
          borderColor: appTheme.border,
        },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          { backgroundColor: appTheme.background.secondary },
          color ? { color } : { color: appTheme.text.primary },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        editable={!disabled}
        placeholderTextColor={placeholderTextColor ?? appTheme.text.disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 0,
    paddingHorizontal: 12,
  },
});
export default TextInputField;
