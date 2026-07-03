import TextInputField from '@/components/TextInputField';
import { useForm } from '@/hooks/useForm';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { Shopping } from '@/lib/types/Shopping';
import React from 'react';
import { Text, Modal, TouchableOpacity, View, StyleSheet } from 'react-native';

interface IProps {
  open: boolean;
  onCancel: () => void;
  onAdd: (name: string) => void | Promise<void>;
}

const AddShoppingListModal: React.FC<IProps> = props => {
  const { open, onCancel, onAdd } = props;

  const { getResource } = useLocalization();

  const { appTheme } = useSettingsContext();

  const { values, handleChange, resetForm, isModified } = useForm<Shopping>({
    id: 0,
    name: '',
    date: new Date().toISOString(),
  });

  const handleCancelClick = React.useCallback(() => {
    resetForm();
    onCancel();
  }, [resetForm, onCancel]);

  const handleAddClick = React.useCallback(() => {
    onAdd(values.name);
    resetForm();
  }, [onAdd, values.name, resetForm]);

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
            {getResource('titleAddShoppingList')}
          </Text>
          <TextInputField
            value={values.name}
            onChange={value => handleChange('name', value)}
            placeholder={getResource('placeholderEnterShoppingListName')}
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

export default AddShoppingListModal;
