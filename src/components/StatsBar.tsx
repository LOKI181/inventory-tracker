import React from 'react';
import type { InventoryItem } from '../types';

interface StatsBarProps {
  items: InventoryItem[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ items }) => {
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStock = items.filter((item) => item.quantity > 0 && item.quantity < 20).length;
  const outOfStock = items.filter((item) => item.quantity === 0).length;
  const pendingSync = items.filter((item) => item.syncStatus === 'pending').length;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-number">{totalItems}</span>
        <span className="stat-label">Total Items</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{totalQuantity.toLocaleString()}</span>
        <span className="stat-label">Total Units</span>
      </div>
      <div className="stat-card warning">
        <span className="stat-number">{lowStock}</span>
        <span className="stat-label">Low Stock</span>
      </div>
      <div className="stat-card danger">
        <span className="stat-number">{outOfStock}</span>
        <span className="stat-label">Out of Stock</span>
      </div>
      {pendingSync > 0 && (
        <div className="stat-card pending">
          <span className="stat-number">{pendingSync}</span>
          <span className="stat-label">Pending Sync</span>
        </div>
      )}
    </div>
  );
};
