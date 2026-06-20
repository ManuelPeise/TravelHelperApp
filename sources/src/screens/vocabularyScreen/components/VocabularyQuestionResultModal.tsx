import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { VocabularyQuizOptions } from '@/hooks/useVocabulary';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
  isCorrect: boolean;
  options: VocabularyQuizOptions[];
  open: boolean;
  onClose: () => void;
}

const VocabularyQuestionResultModal: React.FC<IProps> = props => {
  const { isCorrect, options, open, onClose } = props;
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  return (
    <Modal visible={open} animationType="fade" transparent={true}>
      <View
        style={[
          styles.overlay,
          { backgroundColor: appTheme.background.secondary },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: appTheme.card,
            },
          ]}
        >
          <Text style={[styles.title, { color: appTheme.text.primary }]}>
            {isCorrect
              ? getResource('titleCorrectAnswer')
              : getResource('titleWrongAnswer')}
          </Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                {
                  borderColor: option.isCorrect
                    ? appTheme.success
                    : appTheme.text.disabled,
                },
              ]}
              disabled={true}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: option.isCorrect
                      ? appTheme.success
                      : appTheme.text.disabled,
                  },
                ]}
              >
                {option.word}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: appTheme.background.accent,
                },
              ]}
              disabled={false}
              onPress={onClose}
            >
              <Text
                style={{ color: appTheme.text.primary, textAlign: 'center' }}
              >
                {getResource('labelOK')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    opacity: 0.95,
  },
  card: {
    width: '100%',
    borderColor: '#ddd',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
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
  buttonContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    minWidth: 80,
  },
});

export default VocabularyQuestionResultModal;
