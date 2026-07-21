'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { StatusBadge } from '@/components/Common';
import { SkeletonStatCard } from '@/components/Skeleton';
import Link from 'next/link';
import { HiOutlineDocumentText, HiOutlineBookmark, HiOutlineBell, HiOutlineBriefcase, HiOutlineArrowRight, HiOutlineUser } from 'react-icons/hi';

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ applications: 0, saved: 0, interviews: 0, pending: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'student') {
      Promise.all([
        api.get('/students/applications').catch(() => ({ applications: [] })),
        api.get('/students/saved-jobs').catch(() => ({ saved_jobs: [] })),
      ]).then(([appsData, savedData]) => {
        const apps = appsData.applications || [];
        setRecentApps(apps.slice(0, 5));
        setStats({
          applications: apps.length,
          saved: savedData.saved_jobs?.length || 0,
          interviews: apps.filter((a: any) => a.status === 'interview').length,
          pending: apps.filter((a: any) => ['applied', 'under_review'].includes(a.status)).length,
        });
        setLoading(false);
      });
    }
  }, [user]);

  if (authLoading || loading) return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-surface-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-surface-500 mt-1">Here&apos;s an overview of your career activity</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Applications', value: stats.applications, icon: <HiOutlineDocumentText className="h-5 w-5" />, color: 'bg-primary-50 text-primary-600 ring-primary-100', href: '/student/applications' },
            { label: 'Saved Jobs', value: stats.saved, icon: <HiOutlineBookmark className="h-5 w-5" />, color: 'bg-emerald-50 text-emerald-600 ring-emerald-100', href: '/student/saved-jobs' },
            { label: 'Interviews', value: stats.interviews, icon: <HiOutlineBriefcase className="h-5 w-5" />, color: 'bg-purple-50 text-purple-600 ring-purple-100', href: '/student/applications' },
            { label: 'In Progress', value: stats.pending, icon: <HiOutlineBell className="h-5 w-5" />, color: 'bg-amber-50 text-amber-600 ring-amber-100', href: '/student/applications' },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <div className="card group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3.5">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ring-1 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                    <p className="text-xs font-medium text-surface-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-header mb-0">Recent Applications</h2>
            {recentApps.length > 0 && (
              <Link href="/student/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                View all <HiOutlineArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          {recentApps.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-14 w-14 bg-surface-100 rounded-2xl flex items-center justify-center text-surface-400 mx-auto mb-4">
                <HiOutlineDocumentText className="h-6 w-6" />
              </div>
              <p className="text-surface-500 text-sm mb-3">No applications yet</p>
              <Link href="/jobs" className="btn-primary btn-sm">Browse Jobs</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentApps.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-surface-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ring-1 ring-primary-100">
                      {app.job?.company_name?.charAt(0) || <HiOutlineUser className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{app.job?.title || 'Job'}</p>
                      <p className="text-xs text-surface-400 truncate">{app.job?.company_name || ''}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
