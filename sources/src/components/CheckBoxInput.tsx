import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CheckBoxInputProps {
  checked: boolean;
  onChange: (checked: boolean) => Promise<void>;
  disabled?: boolean;
}

const CheckBoxInput: React.FC<CheckBoxInputProps> = props => {
  const { checked, onChange, disabled } = props;

  const { appTheme } = useSettingsContext();
  return (
    <TouchableOpacity onPress={() => onChange(!checked)} disabled={disabled}>
      <Ionicons
        name={checked ? 'checkbox' : 'square-outline'}
        size={24}
        color={checked ? appTheme.success : appTheme.text.secondary}
      />
    </TouchableOpacity>
  );
};

export default CheckBoxInput;
