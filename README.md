# InventoryTracker - Offline-First PWA

An offline-first inventory management Progressive Web App designed for field workers and warehouse staff who need seamless data capture in low-connectivity environments.

## Features

- **Offline Support**: Full functionality without internet connection
- **IndexedDB Storage**: Persistent local data storage via Dexie.js
- **Background Sync**: Automatic sync when connection is restored
- **CRUD Operations**: Add, edit, delete inventory items
- **Quick Quantity Adjust**: +/- buttons for fast stock updates
- **Search & Filter**: Real-time search and category filtering
- **Sync Status**: Visual indicators for sync state

## Tech Stack

- React 19 + TypeScript
- Dexie.js (IndexedDB wrapper)
- PWA Manifest + Service Worker ready
- Custom hooks for online/sync management

## Interview Highlights

- **PWA Architecture**: Service worker registration and manifest setup
- **Offline-First**: IndexedDB as primary data source, sync queue for mutations
- **Conflict Resolution**: Sync queue with retry logic and status tracking
- **Custom Hooks**: `useOnlineStatus` and `useSync` for connection management
- **Data Integrity**: Ensures zero data loss during offline periods

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
