import React, { useState } from 'react';
import type { InventoryItem } from '../types';

interface ItemFormProps {
  initialData?: InventoryItem;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'lastUpdated' | 'syncStatus'>) => void;
  onCancel: () => void;
}

const CATEGORIES = ['Electronics', 'Furniture', 'Accessories', 'Lighting', 'Office Supplies'];
const LOCATIONS = ['Aisle A-1', 'Aisle A-2', 'Aisle A-3', 'Aisle B-1', 'Aisle C-1', 'Warehouse B', 'Warehouse C'];

export const ItemForm: React.FC<ItemFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [quantity, setQuantity] = useState(initialData?.quantity || 0);
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [location, setLocation] = useState(initialData?.location || LOCATIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;
    onSubmit({ name: name.trim(), sku: sku.trim(), quantity, category, location });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>
          <div className="form-group">
            <label>SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. WM-001"
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-save">{initialData ? 'Update' : 'Add'} Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};
