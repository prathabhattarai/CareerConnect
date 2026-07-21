'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'company';
  phone?: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; password: string; full_name: string; phone?: string; role: string }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ id: 0, email: '', full_name: '', role: 'student', is_active: false }),
  register: async () => ({ id: 0, email: '', full_name: '', role: 'student', is_active: false }),
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const ROLE_KEYS = ['student', 'company'] as const;

function clearAllAuth() {
  for (const role of ROLE_KEYS) {
    localStorage.removeItem(`auth_token_${role}`);
    localStorage.removeItem(`auth_user_${role}`);
  }
  sessionStorage.removeItem('auth_active_role');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const handleUnauthorized = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [handleUnauthorized]);

  const refreshUser = useCallback(async () => {
    try {
      const activeRole = sessionStorage.getItem('auth_active_role') as 'student' | 'company' | null;
      const token = activeRole ? localStorage.getItem(`auth_token_${activeRole}`) : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await api.get('/auth/me');
      setUser(data);
      localStorage.setItem(`auth_user_${data.role}`, JSON.stringify(data));
    } catch {
      clearAllAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!loading && !user) {
      const publicPages = ['/', '/login', '/register', '/jobs'];
      const isPublic = publicPages.includes(pathname) || pathname.startsWith('/jobs/');
      if (!isPublic) {
        window.location.href = '/login';
      }
    }
  }, [loading, user, pathname]);

  const login = async (email: string, password: string): Promise<User> => {
    const data = await api.post('/auth/login', { email, password });
    const role = data.user.role as 'student' | 'company';
    localStorage.setItem(`auth_token_${role}`, data.access_token);
    localStorage.setItem(`auth_user_${role}`, JSON.stringify(data.user));
    sessionStorage.setItem('auth_active_role', role);
    setUser(data.user);
    return data.user;
  };

  const register = async (regData: { email: string; password: string; full_name: string; phone?: string; role: string }): Promise<User> => {
    const endpoint = regData.role === 'student' ? '/auth/register/student' : '/auth/register/company';
    const data = await api.post(endpoint, regData);
    const role = data.user.role as 'student' | 'company';
    localStorage.setItem(`auth_token_${role}`, data.access_token);
    localStorage.setItem(`auth_user_${role}`, JSON.stringify(data.user));
    sessionStorage.setItem('auth_active_role', role);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearAllAuth();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
