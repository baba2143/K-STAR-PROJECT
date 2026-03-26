/**
 * OfflineIndicator - Shows when the app is offline
 * Part of PWA support
 */

import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className="offline-indicator"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-2">
        <WifiOff size={14} />
        <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
          オフラインです。一部の機能が制限されています。
        </span>
      </div>
    </div>
  );
}
