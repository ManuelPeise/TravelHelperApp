import React, { useMemo, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import TextInputField from './TextInputField';
import { useSettingsContext } from '@/hooks/useSettingsContext';

type AutocompleteProps = {
  searchLabel: string;
  value: string;
  options: string[];
  onChangeText: (text: string) => void;
  onSelect: (item: string) => void;
};

export const AutocompleteInput: React.FC<AutocompleteProps> = props => {
  const { value, options, onChangeText, onSelect, searchLabel } = props;

  const { appTheme } = useSettingsContext();
  const [showResults, setShowResults] = useState(false);

  const filtered = useMemo(() => {
    if (!value) return [];

    return options.filter(item =>
      item.toLowerCase().includes(value.toLowerCase()),
    );
  }, [value, options]);

  const onSelectItem = React.useCallback(
    (value: string) => {
      setShowResults(false);
      onSelect(value);
    },
    [onSelect],
  );

  const onTextChange = React.useCallback(
    (text: string) => {
      onChangeText(text);
      setShowResults(true);
    },
    [onChangeText],
  );

  return (
    <View>
      <TextInputField
        value={value}
        onChange={onTextChange}
        placeholder={searchLabel}
      />

      {showResults && filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ paddingVertical: 12, paddingHorizontal: 12 }}
              onPress={() => onSelectItem(item)}
            >
              <Text style={{ color: appTheme.text.primary }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default AutocompleteInput;
