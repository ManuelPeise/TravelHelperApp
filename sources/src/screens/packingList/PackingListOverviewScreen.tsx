import { useLocalization } from '@/hooks/useLocalization';
import { usePackingList } from '@/hooks/usePackingList';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { PackingListStackParamList } from '@/lib/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AddPackingListModal } from './components/AddPackingListModal';

type Props = NativeStackScreenProps<
  PackingListStackParamList,
  'PackingListOverview'
>;

export const PackingListOverviewScreen: React.FC<Props> = props => {
  const { navigation } = props;
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  const { lists, error, createNewPackingList, deleteList } = usePackingList();

  const [isAddModalVisible, setAddModalVisible] = React.useState(false);

  const handleCreate = React.useCallback(
    async (title: string, subTitle: string) => {
      const result = await createNewPackingList(title, subTitle);
      if (result) {
        setAddModalVisible(false);
      }
    },
    [createNewPackingList],
  );

  const handleCloseModal = React.useCallback(() => {
    setAddModalVisible(false);
  }, []);

  const handleOpenAddPackingListModal = React.useCallback(() => {
    setAddModalVisible(true);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleOpenAddPackingListModal}
          style={styles.headerButton}
        >
          <Ionicons name="add" size={26} color={appTheme.text.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleOpenAddPackingListModal, appTheme]);
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
          <Text
            style={[
              styles.emptyText,
              { color: error ? appTheme.error : appTheme.text.disabled },
            ]}
          >
            {error ? error : getResource('labelNoPackingLists')}
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
              navigation.navigate('PackingListDetail', {
                packingListId: item.id,
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.rowContent}>
              <Text style={[styles.rowName, { color: appTheme.text.primary }]}>
                {item.title}
              </Text>
              <Text
                style={[styles.rowDate, { color: appTheme.text.secondary }]}
              >
                {item.subTitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteList(item.id)}
              style={styles.headerButton}
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
      <AddPackingListModal
        visible={isAddModalVisible}
        onCreate={handleCreate}
        onClose={handleCloseModal}
        error={error}
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

export default PackingListOverviewScreen;
