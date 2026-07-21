'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { SkeletonStatCard } from '@/components/Skeleton';
import { HiOutlineBriefcase, HiOutlineUsers, HiOutlineDocumentText, HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineArrowRight } from 'react-icons/hi';

export default function CompanyDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'company') {
      api.get('/companies/dashboard').then((data) => {
        setStats(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || loading) return (
    <div className="flex">
      <Sidebar role="company" />
      <div className="flex-1 p-8">
        <div className="mb-8"><div className="h-8 w-48 bg-surface-100 rounded-lg animate-pulse" /></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar role="company" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
            Recruiter Dashboard
          </h1>
          <p className="text-surface-500 mt-1">Overview of your recruitment activity</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Job Posts', value: stats?.total_jobs || 0, icon: <HiOutlineBriefcase className="h-5 w-5" />, color: 'bg-primary-50 text-primary-600 ring-primary-100', href: '/company/jobs' },
            { label: 'Active Jobs', value: stats?.active_jobs || 0, icon: <HiOutlineDocumentText className="h-5 w-5" />, color: 'bg-emerald-50 text-emerald-600 ring-emerald-100', href: '/company/jobs' },
            { label: 'Applications', value: stats?.total_applications || 0, icon: <HiOutlineUsers className="h-5 w-5" />, color: 'bg-purple-50 text-purple-600 ring-purple-100', href: '/company/applicants' },
            { label: 'Shortlisted', value: stats?.shortlisted || 0, icon: <HiOutlineCheckCircle className="h-5 w-5" />, color: 'bg-amber-50 text-amber-600 ring-amber-100', href: '/company/applicants' },
            { label: 'Interviews', value: stats?.scheduled_interviews || 0, icon: <HiOutlineCalendar className="h-5 w-5" />, color: 'bg-indigo-50 text-indigo-600 ring-indigo-100', href: '/company/interviews' },
            { label: 'Selected', value: stats?.selected || 0, icon: <HiOutlineCheckCircle className="h-5 w-5" />, color: 'bg-emerald-50 text-emerald-600 ring-emerald-100', href: '/company/applicants' },
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

        <div className="flex flex-wrap gap-3">
          <Link href="/company/jobs" className="btn-primary">
            Manage Job Posts <HiOutlineArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/company/applicants" className="btn-secondary">
            View Applicants
          </Link>
          <Link href="/company/analytics" className="btn-secondary">
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
