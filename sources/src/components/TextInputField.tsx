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
  multiline?: boolean;
  numberOfLines?: number;
}

const TextInputField: React.FC<IProps> = props => {
  const {
    value,
    onChange,
    placeholder,
    placeholderTextColor,
    disabled,
    color,
    multiline,
    numberOfLines,
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
          {
            height: multiline ? (numberOfLines ?? 1) * 15 : 40,
            backgroundColor: appTheme.background.secondary,
          },
          color ? { color } : { color: appTheme.text.primary },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        editable={!disabled}
        placeholderTextColor={placeholderTextColor ?? appTheme.text.disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
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
    borderWidth: 0,
    paddingHorizontal: 12,
    textAlignVertical: 'top',
  },
});
export default TextInputField;
