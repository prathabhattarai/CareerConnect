'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { EmptyState } from '@/components/Common';
import { HiOutlineBell, HiOutlineCheck } from 'react-icons/hi';

export default function CompanyNotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'company') {
      api.get('/notifications').then((data) => {
        setNotifications(data.notifications || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  const markRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  if (authLoading || loading) return <div className="flex"><Sidebar role="company" /><div className="flex-1 p-8"><div className="space-y-3">{Array.from({length:4}).map((_,i)=><div key={i} className="h-20 bg-surface-100 rounded-xl animate-pulse" />)}</div></div></div>;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex">
      <Sidebar role="company" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-ghost text-sm text-primary-600 hover:text-primary-700">
              <HiOutlineCheck className="h-4 w-4" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<HiOutlineBell className="h-8 w-8" />}
            title="No notifications"
            description="You're all caught up! New notifications will appear here."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.is_read && markRead(notif.id)}
                className={`card cursor-pointer transition-all duration-200 ${
                  !notif.is_read
                    ? 'border-primary-200 bg-primary-50/30 hover:bg-primary-50/60'
                    : 'hover:bg-surface-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`h-2.5 w-2.5 rounded-full mt-2 flex-shrink-0 ${
                    notif.is_read ? 'bg-surface-300' : 'bg-primary-500 ring-4 ring-primary-100'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notif.is_read ? 'font-medium text-surface-700' : 'font-semibold text-surface-900'}`}>{notif.title}</p>
                    <p className="text-sm text-surface-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-surface-400 mt-1.5">
                      {notif.created_at ? new Date(notif.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
