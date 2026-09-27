import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useSync } from '../hooks/useSync';
import { ConnectionBanner } from './ConnectionBanner';
import { StatsBar } from './StatsBar';
import { InventoryTable } from './InventoryTable';
import { ItemForm } from './ItemForm';
import type { InventoryItem } from '../types';

export const InventoryApp: React.FC = () => {
  const { items, loading, addItem, updateItem, deleteItem } = useInventory();
  const { isOnline, isSyncing, pendingCount, lastSyncTime, syncNow } = useSync();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item.category));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, filterCategory]);

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id);
    }
  };

  const handleAdjustQuantity = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    await updateItem(id, { quantity: newQty });
  };

  const handleFormSubmit = async (data: Omit<InventoryItem, 'id' | 'lastUpdated' | 'syncStatus'>) => {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await addItem(data);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <span>Loading inventory...</span>
      </div>
    );
  }

  return (
    <div className="inventory-app">
      <header className="app-header">
        <div className="header-left">
          <h1>📦 InventoryTracker</h1>
          <span className="subtitle">Offline-First PWA</span>
        </div>
      </header>

      <ConnectionBanner
        isOnline={isOnline}
        isSyncing={isSyncing}
        pendingCount={pendingCount}
        lastSyncTime={lastSyncTime}
        onSyncNow={syncNow}
      />

      <StatsBar items={items} />

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Add Item
        </button>
      </div>

      <main className="main-content">
        <InventoryTable
          items={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdjustQuantity={handleAdjustQuantity}
        />
      </main>

      {showForm && (
        <ItemForm
          initialData={editingItem || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};
