import TextInputField from '@/components/TextInputField';
import { useForm } from '@/hooks/useForm';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  error: string | null;
  onClose: () => void;
  onCreate: (title: string, subTitle: string) => void;
};

type AddPackingListFormValues = {
  title: string;
  subTitle: string;
};

export const AddPackingListModal: React.FC<Props> = props => {
  const { visible, onClose, onCreate, error } = props;

  const { getResource } = useLocalization();
  const { appTheme } = useSettingsContext();

  const { values, handleChange, resetForm, isModified } =
    useForm<AddPackingListFormValues>({
      title: '',
      subTitle: '',
    });

  const handleCancelClick = React.useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleAddClick = React.useCallback(() => {
    onCreate(values.title, values.subTitle);
    resetForm();
  }, [onCreate, values.title, values.subTitle, resetForm]);

  return (
    <Modal
      visible={visible}
      onRequestClose={handleCancelClick}
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
            {getResource('titleAddPackingList')}
          </Text>
          <TextInputField
            value={values.title}
            onChange={value => handleChange('title', value)}
            placeholder={getResource('placeholderEnterPackingListName')}
          />
          <TextInputField
            value={values.subTitle}
            onChange={value => handleChange('subTitle', value)}
            placeholder={getResource('placeholderEnterPackingListSubTitle')}
          />
          {error && <Text style={{ color: appTheme.error }}>{error}</Text>}
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
              disabled={
                !isModified || !values.title.trim() || !values.subTitle.trim()
              }
              onPress={handleAddClick}
            >
              <Text style={{ color: appTheme.text.primary }}>
                {getResource('labelCreate')}
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
