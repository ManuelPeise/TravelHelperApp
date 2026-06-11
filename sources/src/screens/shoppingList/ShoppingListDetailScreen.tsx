import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ShoppingListStackParamList } from '@/lib/types/navigation';
import useShoppingList from '@/hooks/useShoppingList';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { useLocalization } from '@/hooks/useLocalization';
import AddProductModal from './components/AddProductModal';
import ProductItemRow from './components/ProductItemRow';
import {
  getProductCategoryName,
  ProductCategoryResourceEnum,
} from '@/lib/enums/ProductCategoryResourceEnum';
import TotalPrice from './components/TotalPrice';

type ShoppingDetailsScreenState = {
  mode: 'create' | 'shopping';
  addProductDialogOpen: boolean;
};

type Props = NativeStackScreenProps<
  ShoppingListStackParamList,
  'ShoppingListDetail'
>;
export type Mode = 'create' | 'shopping';

// ─── Main Screen ─────────────────────────────────────────────────────────────
const ShoppingListDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { shoppingId } = route.params;
  const { appTheme, settings } = useSettingsContext();
  const { onSourceAmountChange } = useCurrencyConversion();
  const { getResource } = useLocalization();

  const { items, isLoading, addItem, removeItem, updateItem, totalPrice } =
    useShoppingList(shoppingId);

  const [state, setState] = React.useState<ShoppingDetailsScreenState>({
    mode: 'create',
    addProductDialogOpen: false,
  });

  const handlePriceChange = React.useCallback(
    (itemId: number, price: number | null) => {
      updateItem(itemId, { price: price ?? 0 });
    },
    [updateItem],
  );

  const convertedTotal = React.useMemo(() => {
    if (settings?.sourceCurrency && settings?.targetCurrency) {
      return onSourceAmountChange(
        totalPrice,
        settings.sourceCurrency,
        settings.targetCurrency,
      );
    }
    return null;
  }, [
    totalPrice,
    onSourceAmountChange,
    settings?.sourceCurrency,
    settings?.targetCurrency,
  ]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const categoryCompare = getProductCategoryName(
        a.productCategory as ProductCategoryResourceEnum,
        getResource,
      ).localeCompare(
        getProductCategoryName(
          b.productCategory as ProductCategoryResourceEnum,
          getResource,
        ),
      );
      if (categoryCompare !== 0) return categoryCompare;
      return a.productName.localeCompare(b.productName);
    });
  }, [items, getResource]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            setState(prevState => ({
              ...prevState,
              mode: prevState.mode === 'create' ? 'shopping' : 'create',
            }))
          }
          style={styles.headerBtn}
        >
          {state.mode === 'create' && (
            <TouchableOpacity
              onPress={() =>
                setState(prevState => ({
                  ...prevState,
                  addProductDialogOpen: true,
                }))
              }
              style={styles.headerBtn}
            >
              <Ionicons
                name={'add-outline'}
                size={22}
                color={appTheme.text.primary}
              />
            </TouchableOpacity>
          )}
          <Ionicons
            name={state.mode === 'create' ? 'cart-outline' : 'create-outline'}
            size={22}
            color={appTheme.text.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, state.mode, appTheme, getResource]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.centered,
          { backgroundColor: appTheme.background.primary },
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: appTheme.background.secondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={sortedItems}
        keyExtractor={item => String(item.id)}
        style={styles.flex}
        contentContainerStyle={
          sortedItems.length === 0 && styles.emptyContainer
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: appTheme.text.disabled }]}>
            {state.mode === 'create'
              ? getResource('noProductsCreate')
              : getResource('noProducts')}
          </Text>
        }
        renderItem={item => (
          <ProductItemRow
            mode={state.mode}
            item={item.item}
            handleDelete={removeItem}
            handlePriceChange={handlePriceChange}
          />
        )}
      />
      {state.mode === 'shopping' && items.length > 0 && (
        <TotalPrice
          totalPrice={totalPrice}
          convertedTotalPrice={convertedTotal}
        />
      )}
      <AddProductModal
        shoppingListId={shoppingId}
        open={state.addProductDialogOpen}
        handleCancel={() =>
          setState(prevState => ({ ...prevState, addProductDialogOpen: false }))
        }
        handleSave={async (productName, category, quantity) => {
          await addItem(productName, category, quantity);
          setState(prevState => ({
            ...prevState,
            addProductDialogOpen: false,
          }));
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  headerBtnLabel: { fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowContent: { flex: 1, marginRight: 8 },
  rowName: { fontSize: 15, fontWeight: '500' },
  rowSub: { fontSize: 12, marginTop: 2 },
  strikethrough: { textDecorationLine: 'line-through' },
  checkbox: { marginRight: 10 },
  stepper: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  stepBtn: {
    width: 26,
    height: 26,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepQty: { fontSize: 14, minWidth: 24, textAlign: 'center' },
  priceInput: {
    width: 64,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 14,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerLabel: { fontSize: 14 },
  footerAmounts: { marginTop: 4, alignItems: 'flex-end' },
  footerTotal: { fontSize: 18, fontWeight: '600' },
  footerConverted: { fontSize: 13, marginTop: 2 },
  addBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  qtyInput: {
    width: 64,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  suggestions: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 6,
    maxHeight: 160,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestionName: { fontSize: 14, fontWeight: '500' },
  suggestionCat: { fontSize: 12 },
  newProductForm: { gap: 8 },
  addBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
});

export default ShoppingListDetailScreen;
