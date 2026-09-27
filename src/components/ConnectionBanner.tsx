import React from 'react';

interface ConnectionBannerProps {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: number | null;
  onSyncNow: () => void;
}

export const ConnectionBanner: React.FC<ConnectionBannerProps> = ({
  isOnline,
  isSyncing,
  pendingCount,
  lastSyncTime,
  onSyncNow,
}) => {
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString();
  };

  return (
    <div className={`connection-banner ${isOnline ? 'online' : 'offline'}`}>
      <div className="banner-left">
        <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
        <span>{isOnline ? 'Online' : 'Offline - Changes saved locally'}</span>
      </div>
      <div className="banner-right">
        {pendingCount > 0 && (
          <span className="pending-badge">{pendingCount} pending</span>
        )}
        {lastSyncTime && (
          <span className="last-sync">Last sync: {formatTime(lastSyncTime)}</span>
        )}
        {isOnline && pendingCount > 0 && (
          <button
            className="sync-btn"
            onClick={onSyncNow}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>
    </div>
  );
};
