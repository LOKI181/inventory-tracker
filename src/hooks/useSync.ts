import { useState, useEffect, useCallback } from 'react';
import { getSyncQueue, clearSyncQueue, markItemSynced } from '../db/database';
import { useOnlineStatus } from './useOnlineStatus';

export function useSync() {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  const updatePendingCount = useCallback(async () => {
    const queue = await getSyncQueue();
    setPendingCount(queue.length);
  }, []);

  useEffect(() => {
    updatePendingCount();
  }, [updatePendingCount]);

  const syncNow = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      const queue = await getSyncQueue();

      for (const item of queue) {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Mark as synced (in real app, this would be an API call)
        if (item.action !== 'delete') {
          await markItemSynced(item.itemId);
        }
      }

      await clearSyncQueue();
      setPendingCount(0);
      setLastSyncTime(Date.now());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing]);

  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      const timer = setTimeout(syncNow, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingCount, syncNow]);

  return { isOnline, isSyncing, pendingCount, lastSyncTime, syncNow };
}
