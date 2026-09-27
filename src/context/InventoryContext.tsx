import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { InventoryItem } from '../types';
import {
  getAllItems,
  addItem as dbAddItem,
  updateItem as dbUpdateItem,
  deleteItem as dbDeleteItem,
  populateDemoData,
} from '../db/database';
import { v4 as uuidv4 } from 'uuid';

interface InventoryContextType {
  items: InventoryItem[];
  loading: boolean;
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'syncStatus'>) => Promise<void>;
  updateItem: (id: string, changes: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItems: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshItems = useCallback(async () => {
    const allItems = await getAllItems();
    setItems(allItems);
  }, []);

  useEffect(() => {
    const init = async () => {
      await populateDemoData();
      await refreshItems();
      setLoading(false);
    };
    init();
  }, [refreshItems]);

  const addItem = useCallback(
    async (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'syncStatus'>) => {
      const newItem: InventoryItem = {
        ...item,
        id: uuidv4(),
        lastUpdated: Date.now(),
        syncStatus: 'pending',
      };
      await dbAddItem(newItem);
      await refreshItems();
    },
    [refreshItems]
  );

  const updateItem = useCallback(
    async (id: string, changes: Partial<InventoryItem>) => {
      await dbUpdateItem(id, changes);
      await refreshItems();
    },
    [refreshItems]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await dbDeleteItem(id);
      await refreshItems();
    },
    [refreshItems]
  );

  return (
    <InventoryContext.Provider
      value={{ items, loading, addItem, updateItem, deleteItem, refreshItems }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within InventoryProvider');
  return context;
}
