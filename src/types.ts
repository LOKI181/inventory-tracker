export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  category: string;
  location: string;
  lastUpdated: number;
  syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  itemId: string;
  data: Partial<InventoryItem>;
  timestamp: number;
  retries: number;
}

export interface AppState {
  items: InventoryItem[];
  syncQueue: SyncQueueItem[];
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number | null;
}
