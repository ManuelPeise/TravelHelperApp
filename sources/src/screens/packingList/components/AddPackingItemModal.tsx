import AutocompleteInput from '@/components/AutoCompleteInput';
import NumberInput from '@/components/NumberInput';
import { useForm } from '@/hooks/useForm';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { PackingItem } from '@/lib/types/packing/packingItem';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AddPackingItemProps {
  open: boolean;
  listId: number;
  personId: number;
  packingItems: PackingItem[];
  onCancel: () => void;
  onAddItemToDb: (name: string) => Promise<number>;
  onAddItem: (
    personId: number,
    itemId: number,
    count: number,
    checked: boolean,
  ) => void;
}

type AddPackingItemState = {
  name: string;
  count: number;
  listId: number;
  personId: number;
};

const AddPackingItemModal: React.FC<AddPackingItemProps> = props => {
  const {
    open,
    onCancel,
    packingItems,
    onAddItemToDb,
    onAddItem,
    listId,
    personId,
  } = props;
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  const { values, handleChange, isModified, resetForm } =
    useForm<AddPackingItemState>({
      name: '',
      count: 1,
      listId,
      personId,
    });

  const handleAddClick = React.useCallback(async () => {
    if (isModified && values.name.trim() !== '') {
      const existingItem = packingItems.find(
        item => item.name.toLowerCase() === values.name.trim().toLowerCase(),
      );

      console.log('COUNT', values.count);
      if (existingItem) {
        onAddItem(personId, existingItem.id, values.count, false);
        resetForm();
      } else {
        const newItemId = await onAddItemToDb(values.name.trim());

        if (newItemId) {
          onAddItem(personId, newItemId, values.count, false);
          resetForm();
        }
      }
    }
  }, [
    isModified,
    values.name,
    values.count,
    packingItems,
    personId,
    onAddItem,
    onAddItemToDb,
    resetForm,
  ]);

  const handleChangeCount = React.useCallback(
    async (key: keyof AddPackingItemState, value: number) => {
      handleChange(key, value);
    },
    [handleChange],
  );

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
            {getResource('titleAddPackingItem')}
          </Text>
          <AutocompleteInput
            value={values.name}
            searchLabel={getResource('labelSearchItem')}
            options={packingItems.map(item => item.name)}
            onSelect={(value: string) => handleChange('name', value)}
            onChangeText={(value: string) => handleChange('name', value)}
          />
          <NumberInput
            placeholderTextColor={appTheme.text.secondary}
            color={appTheme.text.primary}
            hasClearButton={false}
            placeholder={getResource('labelCount')}
            value={values.count.toString()}
            disabled={values.name.trim() === ''}
            onChange={value =>
              handleChangeCount('count', parseInt(value ?? '0', 10))
            }
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: appTheme.background.accent },
              ]}
              onPress={() => {
                onCancel();
                resetForm();
              }}
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

export default AddPackingItemModal;
