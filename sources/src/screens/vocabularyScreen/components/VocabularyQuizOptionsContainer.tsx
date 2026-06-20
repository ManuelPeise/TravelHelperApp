import { useSettingsContext } from '@/hooks/useSettingsContext';
import { VocabularyQuizOptions } from '@/hooks/useVocabulary';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

interface VocabularyQuizProps {
  options: VocabularyQuizOptions[];
  optionsDisabled: boolean;
  onSelectOption?: (option: VocabularyQuizOptions) => void;
}

const VocabularyQuizOptionsContainer: React.FC<VocabularyQuizProps> = props => {
  const { options, optionsDisabled, onSelectOption } = props;
  const { appTheme } = useSettingsContext();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.background.secondary },
      ]}
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            {
              borderColor: optionsDisabled
                ? appTheme.text.disabled
                : appTheme.text.primary,
            },
          ]}
          onPress={() => onSelectOption && onSelectOption(option)}
          disabled={optionsDisabled}
        >
          <Text
            style={[
              styles.optionText,
              {
                color: optionsDisabled
                  ? appTheme.text.disabled
                  : appTheme.text.primary,
              },
            ]}
          >
            {option.word}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 12,
    marginTop: 30,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
});

export default VocabularyQuizOptionsContainer;
