import NumberInput from '@/components/NumberInput';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { ShoppingPlanWithProduct } from '@/lib/types/ShoppingPlanWithProduct';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Mode } from '../ShoppingListDetailScreen';
import { mapProductCategoryToResource } from '@/lib/enums/ProductCategoryResourceEnum';

interface IProps {
  mode: Mode;
  item: ShoppingPlanWithProduct;
  handleDelete: (itemId: number) => void;
  handlePriceChange: (itemId: number, price: number | null) => void;
}

const ProductItemRow: React.FC<IProps> = props => {
  const { mode, item, handleDelete, handlePriceChange } = props;
  const { getResource } = useLocalization();
  const { appTheme } = useSettingsContext();

  const itemCategoryLabel = React.useMemo(() => {
    const categories = mapProductCategoryToResource(category =>
      getResource(category),
    );

    return categories.find(c => c.key === item.productCategory)?.label ?? '';
  }, [item.productCategory, getResource]);

  return (
    <View
      style={[
        styles.rowContainer,
        { borderBottomColor: appTheme.background.accent },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.rowColumn}>
          <Text
            style={[styles.rowColumnText, { color: appTheme.text.primary }]}
          >
            {`${item.quantity} \t\t x \t ${item.productName}`}
          </Text>
        </View>

        {mode === 'shopping' && (
          <View style={styles.priceRowColumn}>
            <NumberInput
              placeholder={getResource('labelPrice')}
              value={item.price === 0 ? '0.00' : item.price.toFixed(2)}
              onChange={value =>
                handlePriceChange?.(
                  item.id,
                  value == null
                    ? null
                    : value === ''
                    ? null
                    : parseFloat(value),
                )
              }
            />
          </View>
        )}
        {mode === 'create' && (
          <View style={styles.iconRowColumn}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={appTheme.text.secondary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.row}>
        <Text style={{ color: appTheme.text.secondary }}>
          {itemCategoryLabel}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowColumn: {
    width: 'auto',
    alignItems: 'center',
  },
  iconRowColumn: {
    width: 32,
    paddingLeft: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  priceRowColumn: {
    width: 100,
    paddingLeft: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rowColumnText: {
    fontSize: 16,
    alignItems: 'center',
  },
});

export default ProductItemRow;
