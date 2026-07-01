import {
  createPackingList,
  getPackingLists,
  deletePackingList,
  getPackingListById,
  createPerson,
  getPersonsFromDb,
  unAssignPersonFromList,
  getPackingItems,
  addPackingItemToPerson,
  addPackingItemToDb,
  updatePackingItemForPerson,
  removePackingItemFromPerson,
} from '@/lib/database/PackingRepository';
import { PackingList } from '@/lib/types/packing/packingList';
import React from 'react';
import { useLocalization } from './useLocalization';
import { PackingPerson } from '@/lib/types/packing/packingPerson';
import { PackingItem } from '@/lib/types/packing/packingItem';

type UsePackingListResult = {
  error: string | null;
  lists: PackingList[];
  selectedList: PackingList | null;
  personList: PackingPerson[];
  packingItems: PackingItem[];
  createNewPackingList: (title: string, subTitle: string) => Promise<boolean>;
  onAddPerson: (name: string) => Promise<void>;
  deleteList: (id: number) => Promise<void>;
  unAssignPerson: (personId: number, listId: number) => Promise<void>;
  addPackingItemToDb: (name: string) => Promise<number>;
  onAssignPackingItemToPerson: (
    personId: number,
    listId: number,
    itemId: number,
    count?: number,
    checked?: boolean,
  ) => Promise<void>;
  updatePackingItemForPerson: (
    personId: number,
    itemId: number,
    listId: number,
    checked: boolean,
  ) => Promise<void>;
  deletePackingItemForPerson: (
    personId: number,
    listId: number,
    itemId: number,
  ) => Promise<void>;
};

type UsePackingListState = {
  packingLists: PackingList[];
  selectedList: PackingList | null;
  error: string | null;
  personList: PackingPerson[];
  packingItems: PackingItem[];
};

export const usePackingList = (
  packingListId?: number,
): UsePackingListResult => {
  const { getResource } = useLocalization();
  const [packingState, setPackingState] = React.useState<UsePackingListState>({
    packingLists: [],
    selectedList: null,
    error: null,
    personList: [],
    packingItems: [],
  });

  const handleStateUpdate = React.useCallback(
    (state: Partial<UsePackingListState>) => {
      setPackingState(prev => ({ ...prev, ...state }));
    },
    [],
  );

  const onLoad = React.useCallback(async () => {
    try {
      const packingLists = await getPackingLists();
      const persons = await getPersonsFromDb();
      const packingItems = await getPackingItems();
      handleStateUpdate({
        packingLists: packingLists ?? [],
        personList: persons ?? [],
        packingItems: packingItems ?? [],
      });
    } catch (error) {
      handleStateUpdate({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [handleStateUpdate]);

  const onLoadPackingList = React.useCallback(
    async (id: number) => {
      try {
        const dbPackingList = await getPackingListById(id);

        if (dbPackingList) {
          const selectedList: PackingList = {
            id: dbPackingList.id,
            title: dbPackingList.title,
            subTitle: dbPackingList.subTitle ?? '',
            dateCreated: dbPackingList.dateCreated,
            persons: dbPackingList.persons,
          };
          handleStateUpdate({ selectedList });
        }
      } catch (err) {
        handleStateUpdate({
          error: err instanceof Error ? err.message : getResource('errorUnknown'),
        });
      }
    },
    [handleStateUpdate, getResource],
  );

  const createNewPackingList = React.useCallback(
    async (title: string, subTitle: string): Promise<boolean> => {
      try {
        const existingLists = (await getPackingLists()) ?? [];

        if (existingLists.some(list => list.title === title)) {
          throw new Error(getResource('errorPackingListAlreadyExists'));
        }

        const result = await createPackingList(title, subTitle);

        await onLoad();

        return !!result;
      } catch (err) {
        setPackingState(prev => ({
          ...prev,
          error:
            err instanceof Error ? err.message : getResource('errorUnknown'),
        }));
        return false;
      }
    },
    [getResource, onLoad],
  );

  const deleteList = React.useCallback(
    async (id: number) => {
      try {
        const result = await deletePackingList(id);
        if (result) {
          await onLoad();
        }
      } catch (err) {
        setPackingState(prev => ({
          ...prev,
          error:
            err instanceof Error ? err.message : getResource('errorUnknown'),
        }));
      }
    },
    [getResource, onLoad],
  );

  const onAddPerson = React.useCallback(
    async (name: string) => {
      if (!packingListId) return;
      try {
        const result = await createPerson(packingListId, name);

        if (result) {
          await onLoadPackingList(packingListId);
        }
      } catch (err) {
        setPackingState(prev => ({
          ...prev,
          error:
            err instanceof Error ? err.message : getResource('errorUnknown'),
        }));
      }
    },
    [packingListId, getResource, onLoadPackingList],
  );

  const unAssignPerson = React.useCallback(
    async (personId: number, listId: number) => {
      try {
        await unAssignPersonFromList(personId, listId);

        await onLoadPackingList(listId);
      } catch (err) {
        setPackingState(prev => ({
          ...prev,
          error:
            err instanceof Error ? err.message : getResource('errorUnknown'),
        }));
      }
    },
    [getResource, onLoadPackingList],
  );

  const onAddPackingItem = React.useCallback(
    async (
      personId: number,
      listId: number,
      itemId: number,
      count: number = 1,
      checked: boolean = false,
    ) => {
      try {
        await addPackingItemToPerson(personId, listId, itemId, count, checked);

        await onLoadPackingList(listId);
      } catch (err) {
        setPackingState(prev => ({
          ...prev,
          error:
            err instanceof Error ? err.message : getResource('errorUnknown'),
        }));
      }
    },
    [getResource, onLoadPackingList],
  );

  const updatePackingItem = React.useCallback(
    async (
      personId: number,
      itemId: number,
      listId: number,
      checked: boolean,
    ) => {
      try {
        await updatePackingItemForPerson(itemId, personId, listId, checked);

        await onLoadPackingList(listId);
      } catch (err) {
        setPackingState(prev => ({
          ...prev,
          error:
            err instanceof Error ? err.message : getResource('errorUnknown'),
        }));
      }
    },
    [getResource, onLoadPackingList],
  );

  const deletePackingItemForPerson = React.useCallback(
    async (personId: number, listId: number, itemId: number) => {
      try {
        await removePackingItemFromPerson(personId, listId, itemId);

        await onLoadPackingList(listId);
      } catch (err) {
        setPackingState(prev => ({
          ...prev,
          error:
            err instanceof Error ? err.message : getResource('errorUnknown'),
        }));
      }
    },
    [getResource, onLoadPackingList],
  );

  React.useEffect(() => {
    onLoad();

    if (packingListId) {
      onLoadPackingList(packingListId);
    }
  }, [packingListId, onLoad, onLoadPackingList]);

  return {
    lists: packingState.packingLists,
    selectedList: packingState.selectedList,
    personList: packingState.personList,
    packingItems: packingState.packingItems,
    error: packingState.error,
    createNewPackingList,
    deleteList,
    onAddPerson,
    unAssignPerson,
    addPackingItemToDb: addPackingItemToDb,
    onAssignPackingItemToPerson: onAddPackingItem,
    updatePackingItemForPerson: updatePackingItem,
    deletePackingItemForPerson: deletePackingItemForPerson,
  };
};
