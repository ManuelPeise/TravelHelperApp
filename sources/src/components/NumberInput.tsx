import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface NumberInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  color?: string;
  hasClearButton?: boolean;
  onClear?: () => void;
}

const NumberInput: React.FC<NumberInputProps> = props => {
  const {
    value,
    onChange,
    placeholder,
    placeholderTextColor,
    color,
    hasClearButton,
    onClear,
  } = props;

  const { appTheme } = useSettingsContext();
  const [focused, setFocused] = React.useState(false);
  const [displayValue, setDisplayValue] = React.useState(
    value != null ? value : '',
  );

  React.useEffect(() => {
    if (!focused) {
      const incomingNum = parseFloat((value ?? '').replace(',', '.'));
      const displayNum = parseFloat(displayValue.replace(',', '.'));
      // Only overwrite if the numeric value actually changed (e.g. currency reset),
      // not just because the parent stripped trailing zeros like "280.80" → "280.8"
      if (isNaN(incomingNum) || incomingNum !== displayNum) {
        setDisplayValue(value != null ? value : '');
      }
    }
  }, [value, focused]);

  const handleChange = React.useCallback(
    (text: string) => {
      setDisplayValue(text);
      const normalized = text.replace(',', '.');
      const numericValue = parseFloat(normalized);
      if (!isNaN(numericValue)) {
        onChange(normalized);
      } else if (text === '' || text === ',' || text === '.') {
        onChange(null);
      }
    },
    [onChange],
  );

  const handleClear = React.useCallback(() => {
    setDisplayValue('');
    onChange(null);
    if (onClear) {
      onClear();
    }
  }, [onChange, onClear]);

  if (hasClearButton) {
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
            styles.inputWithClear,
            color ? { color } : { color: appTheme.text.primary },
          ]}
          keyboardType="numeric"
          returnKeyType="done"
          placeholder={placeholder}
          value={displayValue}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={placeholderTextColor ?? appTheme.text.disabled}
        />
        {displayValue !== '' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={8}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={placeholderTextColor ?? 'gray'}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

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
        keyboardType="numeric"
        placeholder={placeholder}
        value={displayValue}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputWithClear: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    paddingRight: 36,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
  },
});

export default NumberInput;
