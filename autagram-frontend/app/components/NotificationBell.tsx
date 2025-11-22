'use client';

import { useEffect, useState } from 'react';
import { notifications as notificationsApi } from '@/lib/api';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  reason?: string;
  read: boolean;
  created_at: string;
  data?: any;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.list();
      setNotifications(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative px-4 py-2 rounded transition-colors"
        style={{ backgroundColor: '#3a3a3a', color: '#e5e5e5' }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#ff6b6b', color: '#fff' }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-96 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
        >
          <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: '#2a2a2a' }}>
            <h3 className="font-semibold" style={{ color: '#e5e5e5' }}>Benachrichtigungen</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-sm px-3 py-1 rounded transition-colors"
                style={{ backgroundColor: '#3a3a3a', color: '#888888' }}
              >
                Alle gelesen
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center" style={{ color: '#888888' }}>
              Keine Benachrichtigungen
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  className="p-4 border-b cursor-pointer transition-colors hover:bg-opacity-50"
                  style={{
                    borderColor: '#2a2a2a',
                    backgroundColor: notification.read ? 'transparent' : '#2a2a2a',
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm" style={{ color: '#e5e5e5' }}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#ff6b6b' }}
                      />
                    )}
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#b5b5b5' }}>
                    {notification.message}
                  </p>
                  {notification.reason && (
                    <div
                      className="mt-2 p-2 rounded text-sm"
                      style={{ backgroundColor: '#2a1a1a', color: '#ff6b6b', border: '1px solid #3a2a2a' }}
                    >
                      <strong>Grund:</strong> {notification.reason}
                    </div>
                  )}
                  <p className="text-xs mt-2" style={{ color: '#666666' }}>
                    {new Date(notification.created_at).toLocaleString('de-DE')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

