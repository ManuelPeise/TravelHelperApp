import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ShoppingListStackParamList } from '@/lib/types/navigation';
import { Shopping } from '@/lib/types/Shopping';
import {
  getAllShoppingLists,
  createShoppingList,
  deleteShoppingList,
} from '@/lib/database/ShoppingRepository';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import AddShoppingListModal from './components/AddShoppingListModal';
import DeleteShoppingListModal from './components/DeleteShoppingListModal';
import { useLocalization } from '@/hooks/useLocalization';

type Props = NativeStackScreenProps<
  ShoppingListStackParamList,
  'ShoppingListOverview'
>;

type ModalProps = {
  addModalOpen: boolean;
  deleteModalOpen: boolean;
  listItem: Shopping | null;
};

const ShoppingListOverviewScreen: React.FC<Props> = ({ navigation }) => {
  const { appTheme } = useSettingsContext();
  const [lists, setLists] = React.useState<Shopping[]>([]);
  const [modalProps, setModalProps] = React.useState<ModalProps>({
    addModalOpen: false,
    deleteModalOpen: false,
    listItem: null,
  });

  const { getResource } = useLocalization();

  const loadLists = React.useCallback(async () => {
    const result = await getAllShoppingLists();
    setLists(
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    );
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadLists();
    }, [loadLists]),
  );

  const handleCreate = React.useCallback(() => {
    setModalProps(prev => ({ ...prev, addModalOpen: true }));
  }, []);

  const handleDeleteShoppingList = React.useCallback(() => {
    console.log('handleDeleteShoppingList', modalProps.listItem);

    if (modalProps.deleteModalOpen && modalProps.listItem) {
      deleteShoppingList(modalProps.listItem.id);

      setLists(prev => prev.filter(l => l.id !== modalProps.listItem!.id));

      setModalProps(prev => ({
        ...prev,
        deleteModalOpen: false,
        listItem: null,
      }));
    }
  }, [modalProps.deleteModalOpen, modalProps.listItem]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleCreate} style={styles.headerButton}>
          <Ionicons name="add" size={26} color={appTheme.text.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleCreate, appTheme]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      <FlatList
        data={lists}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={lists.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: appTheme.text.disabled }]}>
            {getResource('labelNoShoppingLists')}
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: appTheme.border }]}
          />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: appTheme.card }]}
            onPress={() =>
              navigation.navigate('ShoppingListDetail', {
                shoppingId: item.id,
                shoppingName: item.name,
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowContent}>
              <Text style={[styles.rowName, { color: appTheme.text.primary }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.rowDate, { color: appTheme.text.secondary }]}
              >
                {formatDate(item.date)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                setModalProps(prev => ({
                  ...prev,
                  deleteModalOpen: true,
                  listItem: item,
                }))
              }
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={appTheme.text.secondary}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <AddShoppingListModal
        open={modalProps.addModalOpen}
        onCancel={() =>
          setModalProps(prev => ({ ...prev, addModalOpen: false }))
        }
        onAdd={async name => {
          await createShoppingList(name);
          await loadLists();
          setModalProps(prev => ({ ...prev, addModalOpen: false }));
        }}
      />
      <DeleteShoppingListModal
        open={modalProps.deleteModalOpen}
        shoppingListName={modalProps.listItem?.name || ''}
        onAction={handleDeleteShoppingList}
        onCancel={() =>
          setModalProps(prev => ({
            ...prev,
            deleteModalOpen: false,
            listItem: null,
          }))
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowContent: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowDate: {
    fontSize: 13,
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ShoppingListOverviewScreen;
