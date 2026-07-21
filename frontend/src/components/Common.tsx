'use client';

import { Toaster } from 'react-hot-toast';
import { HiOutlineX } from 'react-icons/hi';

export function ToastProvider() {
  return <Toaster position="top-right" toastOptions={{ duration: 3000 }} />;
}

export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="h-16 w-16 bg-surface-100 rounded-2xl flex items-center justify-center text-surface-400 mb-5">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-surface-900 mb-1.5">{title}</h3>
      <p className="text-sm text-surface-500 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!isOpen) return null;

  const sizeClass = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose} />
        <div className={`relative bg-white rounded-3xl shadow-elevated w-full ${sizeClass} animate-fade-in`}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100">
            <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-xl transition-colors"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    applied: 'badge-blue',
    under_review: 'badge-yellow',
    shortlisted: 'badge-green',
    interview: 'badge-purple',
    selected: 'badge-green',
    rejected: 'badge-red',
    active: 'badge-green',
    draft: 'badge-gray',
    closed: 'badge-red',
    scheduled: 'badge-blue',
    completed: 'badge-green',
    cancelled: 'badge-red',
  };

  return (
    <span className={colors[status] || 'badge-gray'}>
      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}
