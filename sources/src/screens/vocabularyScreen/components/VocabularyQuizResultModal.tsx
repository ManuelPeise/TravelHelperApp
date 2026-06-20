import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VocabularyQuizResultModalProps {
  visible: boolean;
  score: number;
  total: number;
  onClose: () => void;
}

const VocabularyQuizResultModal: React.FC<
  VocabularyQuizResultModalProps
> = props => {
  const { visible, score, total, onClose } = props;
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
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
            {getResource('titleQuizResult')}
          </Text>
          <Text style={[styles.score, { color: appTheme.text.primary }]}>
            {getResource('labelYourScore')
              .replace('{score}', score.toString())
              .replace('{total}', total.toString())}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: appTheme.background.accent,
                },
              ]}
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
  score: {
    fontSize: 16,
    marginBottom: 20,
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

export default React.memo(VocabularyQuizResultModal);
