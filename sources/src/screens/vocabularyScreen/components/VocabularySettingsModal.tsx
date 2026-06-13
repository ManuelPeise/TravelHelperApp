import React from 'react';
import { useForm } from '@/hooks/useForm';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { LanguageEnum } from '@/lib/enums/LanguageEnum';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { utils } from '@/lib/utils';
import DropdownInput from '@/components/DropdownInput';

export type VocabularySettings = {
  sourceLanguage: LanguageEnum;
  targetLanguage: LanguageEnum;
};

type VocabularySettingsModalProps = {
  open: boolean;
  settings: VocabularySettings;
  onCancel: () => void;
  onConfirm: (settings: VocabularySettings) => void;
};

const VocabularySettingsModal: React.FC<
  VocabularySettingsModalProps
> = props => {
  const { open, settings, onCancel, onConfirm } = props;
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  const { values, handleChange, resetForm, isModified } = useForm(settings);

  const handleCancelClick = React.useCallback(() => {
    resetForm();
    onCancel();
  }, [resetForm, onCancel]);

  const handleConfirmClick = React.useCallback(() => {
    if (isModified) {
      onConfirm(values);
    }
  }, [onConfirm, values, isModified]);

  const availableLanguages = React.useMemo((): string[] => {
    return Object.values(LanguageEnum).map(language =>
      utils.mapLanguageEnumToString(language, getResource),
    );
  }, [getResource]);

  return (
    <Modal
      visible={open}
      onRequestClose={onCancel}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: appTheme.card,
              borderColor: appTheme.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: appTheme.text.primary }]}>
            {getResource('titleVocabularySettings')}
          </Text>
          <DropdownInput
            label={getResource('labelSourceLanguage')}
            options={availableLanguages}
            value={utils.mapLanguageEnumToString(
              values.sourceLanguage,
              getResource,
            )}
            onValueChange={value =>
              handleChange(
                'sourceLanguage',
                utils.mapStringToLanguageEnum(value),
              )
            }
          />
          <DropdownInput
            label={getResource('labelTargetLanguage')}
            options={availableLanguages.filter(
              l =>
                l !==
                utils.mapLanguageEnumToString(
                  values.sourceLanguage,
                  getResource,
                ),
            )}
            value={utils.mapLanguageEnumToString(
              values.targetLanguage,
              getResource,
            )}
            onValueChange={value =>
              handleChange(
                'targetLanguage',
                utils.mapStringToLanguageEnum(value),
              )
            }
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: appTheme.background.accent },
              ]}
              onPress={handleCancelClick}
            >
              <Text style={{ color: appTheme.text.primary }}>
                {getResource('labelCancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: !isModified
                    ? appTheme.background.disabled
                    : appTheme.background.accent,
                },
              ]}
              disabled={!isModified}
              onPress={handleConfirmClick}
            >
              <Text style={{ color: appTheme.text.primary }}>
                {getResource('labelSave')}
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
  },
  card: {
    width: '100%',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
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
  },
});

export default VocabularySettingsModal;
