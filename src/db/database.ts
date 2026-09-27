import Dexie, { type EntityTable } from 'dexie';
import type { InventoryItem, SyncQueueItem } from '../types';

const db = new Dexie('InventoryTrackerDB') as Dexie & {
  items: EntityTable<InventoryItem, 'id'>;
  syncQueue: EntityTable<SyncQueueItem, 'id'>;
};

db.version(1).stores({
  items: 'id, name, sku, category, location, syncStatus',
  syncQueue: 'id, itemId, timestamp',
});

export { db };

export async function getAllItems(): Promise<InventoryItem[]> {
  return db.items.toArray();
}

export async function addItem(item: InventoryItem): Promise<void> {
  await db.items.add(item);
  await addToSyncQueue('create', item.id, item);
}

export async function updateItem(id: string, changes: Partial<InventoryItem>): Promise<void> {
  await db.items.update(id, { ...changes, lastUpdated: Date.now(), syncStatus: 'pending' });
  await addToSyncQueue('update', id, changes);
}

export async function deleteItem(id: string): Promise<void> {
  await db.items.delete(id);
  await addToSyncQueue('delete', id, {});
}

export async function addToSyncQueue(
  action: SyncQueueItem['action'],
  itemId: string,
  data: Partial<InventoryItem>
): Promise<void> {
  await db.syncQueue.add({
    id: crypto.randomUUID(),
    action,
    itemId,
    data,
    timestamp: Date.now(),
    retries: 0,
  });
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  return db.syncQueue.toArray();
}

export async function clearSyncQueue(): Promise<void> {
  await db.syncQueue.clear();
}

export async function markItemSynced(id: string): Promise<void> {
  await db.items.update(id, { syncStatus: 'synced' });
}

export async function populateDemoData(): Promise<void> {
  const count = await db.items.count();
  if (count > 0) return;

  const demoItems: InventoryItem[] = [
    { id: '1', name: 'Wireless Mouse', sku: 'WM-001', quantity: 150, category: 'Electronics', location: 'Aisle A-1', lastUpdated: Date.now(), syncStatus: 'synced' },
    { id: '2', name: 'USB-C Cable', sku: 'UC-002', quantity: 300, category: 'Accessories', location: 'Aisle A-2', lastUpdated: Date.now(), syncStatus: 'synced' },
    { id: '3', name: 'Standing Desk', sku: 'SD-003', quantity: 25, category: 'Furniture', location: 'Warehouse B', lastUpdated: Date.now(), syncStatus: 'synced' },
    { id: '4', name: 'Monitor 27"', sku: 'MN-004', quantity: 45, category: 'Electronics', location: 'Warehouse B', lastUpdated: Date.now(), syncStatus: 'synced' },
    { id: '5', name: 'Keyboard Mechanical', sku: 'KB-005', quantity: 200, category: 'Electronics', location: 'Aisle A-1', lastUpdated: Date.now(), syncStatus: 'synced' },
    { id: '6', name: 'Webcam HD', sku: 'WC-006', quantity: 75, category: 'Electronics', location: 'Aisle A-3', lastUpdated: Date.now(), syncStatus: 'synced' },
    { id: '7', name: 'Desk Lamp', sku: 'DL-007', quantity: 60, category: 'Lighting', location: 'Aisle C-1', lastUpdated: Date.now(), syncStatus: 'synced' },
    { id: '8', name: 'Ergonomic Chair', sku: 'EC-008', quantity: 30, category: 'Furniture', location: 'Warehouse B', lastUpdated: Date.now(), syncStatus: 'synced' },
  ];

  await db.items.bulkAdd(demoItems);
}
