'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { HiBell, HiUser, HiBriefcase, HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const data = await api.get('/notifications');
          setUnreadCount(data.unread_count);
        } catch {}
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dashboardLink = user ? (user.role === 'student' ? '/student/dashboard' : '/company/dashboard') : null;
  const profileLink = user ? (user.role === 'student' ? '/student/profile' : '/company/profile') : null;
  const notificationsLink = user ? `/${user.role}/notifications` : null;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-xl ${scrolled ? 'shadow-nav border-b border-surface-100/50' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                <HiBriefcase className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-900 tracking-tight hidden sm:block">CareerConnect</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/jobs" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                Find Jobs
              </Link>
              <Link href="/about" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                About
              </Link>
              <Link href="/contact" className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                Contact
              </Link>
              {dashboardLink && (
                <Link href={dashboardLink} className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href={notificationsLink!}
                  className="relative p-2.5 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <HiBell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-surface-50 transition-all"
                  >
                    <div className="h-8 w-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-surface-700 max-w-[120px] truncate hidden sm:block">{user.full_name}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-surface-100 py-2 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-surface-100">
                        <p className="text-sm font-semibold text-surface-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-surface-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={profileLink!}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <HiUser className="h-4 w-4 text-surface-400" />
                          Profile
                        </Link>
                        <Link
                          href={dashboardLink!}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <HiBriefcase className="h-4 w-4 text-surface-400" />
                          Dashboard
                        </Link>
                      </div>
                      <div className="border-t border-surface-100 pt-1">
                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Desktop: always visible buttons */}
                <Link href="/login" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-surface-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                  Sign In
                </Link>
                <Link href="/register" className="hidden sm:inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all shadow-sm">
                  Get Started
                </Link>
                {/* Mobile: hamburger menu toggle */}
                <button
                  className="md:hidden p-2 text-surface-600 hover:bg-surface-100 rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (logged out) */}
      {mobileMenuOpen && !user && (
        <div className="md:hidden border-t border-surface-100 bg-white/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            <Link href="/jobs" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
              Find Jobs
            </Link>
            <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <div className="border-t border-surface-100 pt-3 mt-2 space-y-2">
              <Link href="/login" className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-surface-700 border border-surface-200 rounded-xl hover:bg-surface-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/register" className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu (logged in) */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-surface-100 bg-white/95 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link href="/jobs" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
              Find Jobs
            </Link>
            <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            {dashboardLink && (
              <Link href={dashboardLink} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            )}
            <Link href={profileLink!} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
              Profile
            </Link>
            <Link href={notificationsLink!} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all" onClick={() => setMobileMenuOpen(false)}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>
              )}
            </Link>
            <div className="border-t border-surface-100 my-2" />
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl w-full transition-all">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
