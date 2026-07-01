import AutocompleteInput from '@/components/AutoCompleteInput';
import { useForm } from '@/hooks/useForm';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { PackingPerson } from '@/lib/types/packing/packingPerson';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AddPersonModalProps {
  open: boolean;
  packingListId: number;
  personList: PackingPerson[];
  onCancel: () => void;
  onAddPerson: (name: string) => Promise<void>;
}

type AddPersonModalState = {
  name: string;
  packingListId: number;
};

const AddPersonModal: React.FC<AddPersonModalProps> = props => {
  const { open, personList, packingListId, onCancel, onAddPerson } = props;

  const { appTheme } = useSettingsContext();
  const { values, isModified, handleChange, resetForm } =
    useForm<AddPersonModalState>({
      name: '',
      packingListId: packingListId,
    });
  const { getResource } = useLocalization();

  const handleCancelClick = React.useCallback(() => {
    resetForm();
    onCancel();
  }, [resetForm, onCancel]);

  const handleAddClick = React.useCallback(async () => {
    await onAddPerson(values.name);
    resetForm();
  }, [onAddPerson, values.name, resetForm]);

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
            {getResource('titleAddPerson')}
          </Text>
          <AutocompleteInput
            value={values.name}
            searchLabel={getResource('labelSearchPerson')}
            options={personList.map(person => person.name)}
            onSelect={(value: string) => handleChange('name', value)}
            onChangeText={(value: string) => handleChange('name', value)}
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
                {getResource('labelAdd')}
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

export default AddPersonModal;
