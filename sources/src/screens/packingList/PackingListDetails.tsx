import { useLocalization } from '@/hooks/useLocalization';
import { usePackingList } from '@/hooks/usePackingList';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { PackingListStackParamList } from '@/lib/types/navigation';
import { PackingPerson } from '@/lib/types/packing/packingPerson';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddPersonModal from './components/AddPersonModal';
import PersonRow from './components/PersonRow';
import AddPackingItemModal from './components/AddPackingItemModal';

type Props = NativeStackScreenProps<
  PackingListStackParamList,
  'PackingListDetail'
>;

type PackingListDetailsState = {
  personId: number | null;
  addPersonModalOpen: boolean;
  addPackingItemModalOpen: boolean;
};

export const PackingListDetails: React.FC<Props> = props => {
  const { navigation, route } = props;
  const { packingListId } = route.params;
  const [state, setState] = React.useState<PackingListDetailsState>({
    personId: null,
    addPersonModalOpen: false,
    addPackingItemModalOpen: false,
  });

  const { appTheme } = useSettingsContext();
  const {
    personList,
    selectedList,
    packingItems,
    onAddPerson,
    onAssignPackingItemToPerson,
    unAssignPerson,
    addPackingItemToDb,
    updatePackingItemForPerson,
    deletePackingItemForPerson,
  } = usePackingList(packingListId);
  const { getResource } = useLocalization();

  const handleOpenAddPersonModal = React.useCallback(() => {
    setState(prevState => ({ ...prevState, addPersonModalOpen: true }));
  }, []);

  const handleCloseAddPersonModal = React.useCallback(() => {
    setState(prevState => ({ ...prevState, addPersonModalOpen: false }));
  }, []);

  const handleOpenAddPackingItemModal = React.useCallback(
    (personId: number) => {
      setState(prevState => ({
        ...prevState,
        personId,
        addPackingItemModalOpen: true,
      }));
    },
    [],
  );

  const handleCloseAddPackingItemModal = React.useCallback(() => {
    setState(prevState => ({ ...prevState, addPackingItemModalOpen: false }));
  }, []);

  const handleAddPerson = React.useCallback(
    async (name: string) => {
      await onAddPerson(name);
      handleCloseAddPersonModal();
    },
    [onAddPerson, handleCloseAddPersonModal],
  );

  const handleAddPackingItem = React.useCallback(
    async (
      personId: number,
      itemId: number,
      count: number,
      checked: boolean,
    ) => {
      await onAssignPackingItemToPerson(
        personId,
        packingListId,
        itemId,
        count,
        checked,
      );
      handleCloseAddPackingItemModal();
    },
    [
      packingListId,
      onAssignPackingItemToPerson,
      handleCloseAddPackingItemModal,
    ],
  );

  const renderPersonRow = React.useCallback(
    ({ item }: { item: PackingPerson }) => (
      <PersonRow
        person={item}
        listId={packingListId}
        name={item.name}
        unAssignPerson={unAssignPerson}
        handleOpenAddPackingItemModal={handleOpenAddPackingItemModal}
        handleUpdatePackingItemForPerson={updatePackingItemForPerson}
        handleRemovePackingItemForPerson={deletePackingItemForPerson}
      />
    ),
    [
      packingListId,
      unAssignPerson,
      handleOpenAddPackingItemModal,
      updatePackingItemForPerson,
      deletePackingItemForPerson,
    ],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleOpenAddPersonModal}
          style={styles.headerBtn}
        >
          <Ionicons
            name={'person-add-outline'}
            size={22}
            color={appTheme.text.primary}
          />
        </TouchableOpacity>
      ),
      title: selectedList?.subTitle ?? getResource('titleViewPackingList'),
    });
  }, [
    navigation,
    appTheme,
    getResource,
    selectedList,
    handleOpenAddPersonModal,
  ]);

  if (!selectedList) {
    return (
      <View
        style={[
          styles.flex,
          styles.emptyContainer,
          { backgroundColor: appTheme.background.secondary },
        ]}
      >
        <Text style={[styles.emptyText, { color: appTheme.text.disabled }]}>
          {getResource('labelPackingListNotFound')}
        </Text>
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
        data={selectedList.persons}
        keyExtractor={item => String(item.id)}
        style={styles.flex}
        contentContainerStyle={
          selectedList.persons.length === 0 && styles.emptyContainer
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: appTheme.text.disabled }]}>
            {getResource('labelNoPersons')}
          </Text>
        }
        renderItem={renderPersonRow}
      />
      <AddPersonModal
        open={state.addPersonModalOpen}
        personList={personList}
        packingListId={packingListId}
        onCancel={handleCloseAddPersonModal}
        onAddPerson={handleAddPerson}
      />
      {state.personId !== null && (
        <AddPackingItemModal
          open={state.addPackingItemModalOpen}
          listId={packingListId}
          personId={state.personId}
          packingItems={packingItems}
          onAddItemToDb={addPackingItemToDb}
          onAddItem={handleAddPackingItem}
          onCancel={handleCloseAddPackingItemModal}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
});

export default PackingListDetails;
