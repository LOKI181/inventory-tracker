import React from 'react';
import type { InventoryItem } from '../types';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onEdit,
  onDelete,
  onAdjustQuantity,
}) => {
  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSyncBadge = (status: InventoryItem['syncStatus']) => {
    switch (status) {
      case 'synced':
        return <span className="sync-badge synced">Synced</span>;
      case 'pending':
        return <span className="sync-badge pending">Pending</span>;
      case 'conflict':
        return <span className="sync-badge conflict">Conflict</span>;
    }
  };

  const getQuantityClass = (qty: number) => {
    if (qty === 0) return 'qty-zero';
    if (qty < 20) return 'qty-low';
    return '';
  };

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <h3>No items found</h3>
        <p>Add your first inventory item to get started.</p>
      </div>
    );
  }

  return (
    <div className="inventory-table-wrapper">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Location</th>
            <th>Quantity</th>
            <th>Updated</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="item-name">{item.name}</td>
              <td className="item-sku">{item.sku}</td>
              <td>{item.category}</td>
              <td>{item.location}</td>
              <td className={`item-qty ${getQuantityClass(item.quantity)}`}>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => onAdjustQuantity(item.id, -1)}
                    disabled={item.quantity <= 0}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onAdjustQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="item-date">{formatDate(item.lastUpdated)}</td>
              <td>{getSyncBadge(item.syncStatus)}</td>
              <td className="item-actions">
                <button className="btn-edit-sm" onClick={() => onEdit(item)} title="Edit">
                  ✏️
                </button>
                <button className="btn-delete-sm" onClick={() => onDelete(item.id)} title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
