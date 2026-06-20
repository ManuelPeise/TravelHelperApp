import AutoCompleteInput from '@/components/AutoCompleteInput';
import DropdownInput from '@/components/DropdownInput';
import NumberInput from '@/components/NumberInput';
import { useForm } from '@/hooks/useForm';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import useShoppingList from '@/hooks/useShoppingList';
import {
  mapProductCategoryToResource,
  ProductCategoryResourceEnum,
} from '@/lib/enums/ProductCategoryResourceEnum';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AddProductModalProps {
  shoppingListId: number;
  open: boolean;
  handleCancel: () => void;
  handleSave: (
    productName: string,
    category: ProductCategoryResourceEnum,
    quantity: number,
  ) => void | Promise<void>;
}

type ProductFormModel = {
  name: string;
  category: ProductCategoryResourceEnum | null;
  quantity: string;
};

const AddProductModal: React.FC<AddProductModalProps> = props => {
  const { shoppingListId, open, handleCancel, handleSave } = props;

  const { getResource } = useLocalization();
  const { appTheme } = useSettingsContext();
  const { products } = useShoppingList(shoppingListId);

  const { values, handleChange, resetForm } = useForm<ProductFormModel>({
    name: '',
    category: null,
    quantity: '',
  });

  const categories = React.useMemo(() => {
    return mapProductCategoryToResource(category => getResource(category));
  }, [getResource]);

  const handleSelectProduct = React.useCallback(
    (item: string) => {
      const product = products.find(s => s.name === item);
      if (product) {
        handleChange('name', product.name);
        handleChange('category', product.category);
      }
    },
    [products, handleChange],
  );

  const handleChangeCategory = React.useCallback(
    (categoryLabel: string) => {
      const category = categories.find(c => c.label === categoryLabel);
      if (category) {
        handleChange('category', category.key);
      }
    },
    [categories, handleChange],
  );

  const isValid =
    values.name.trim().length > 0 &&
    values.category !== null &&
    values.quantity.trim().length > 0 &&
    parseInt(values.quantity, 10) > 0;

  const handleConfirm = async () => {
    if (!isValid || values.category === null) {
      return;
    }
    await handleSave(
      values.name.trim(),
      values.category,
      parseInt(values.quantity, 10),
    );
    resetForm();
  };

  const onCancel = () => {
    resetForm();
    handleCancel();
  };

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
          <Text
            style={[
              styles.title,
              { color: appTheme.text.primary, marginBottom: 12 },
            ]}
          >
            {getResource('labelAddProduct')}
          </Text>
          <DropdownInput
            label={getResource('labelCategory')}
            options={categories.map(c => c.label)}
            value={categories.find(c => c.key === values.category)?.label ?? ''}
            onValueChange={handleChangeCategory}
          />
          <AutoCompleteInput
            searchLabel={getResource('placeholderSearchProduct')}
            value={values.name}
            options={
              values.category
                ? products
                    .filter(s => s.category === values.category)
                    .map(s => s.name)
                : products.map(s => s.name)
            }
            onChangeText={text => handleChange('name', text)}
            onSelect={handleSelectProduct}
          />

          <NumberInput
            value={values.quantity}
            onChange={text => handleChange('quantity', text)}
            placeholder={getResource('placeholderQuantity')}
          />
          {/* /Buttons  */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: appTheme.background.accent },
              ]}
              onPress={onCancel}
            >
              <Text style={{ color: appTheme.text.primary }}>
                {getResource('labelCancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: !isValid
                    ? appTheme.background.disabled
                    : appTheme.background.accent,
                },
              ]}
              disabled={!isValid}
              onPress={handleConfirm}
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
    gap: 25,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  newProductForm: { gap: 8 },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  suggestionList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 180,
    zIndex: 10,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  qtyInput: {
    width: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: 'center',
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
export default AddProductModal;
