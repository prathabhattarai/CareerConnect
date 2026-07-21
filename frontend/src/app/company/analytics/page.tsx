'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { EmptyState } from '@/components/Common';
import { HiOutlineChartBar, HiOutlineTrendingUp } from 'react-icons/hi';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'company') {
      api.get('/companies/analytics').then((data) => {
        setAnalytics(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || loading) return <div className="flex"><Sidebar role="company" /><div className="flex-1 p-8"><div className="grid md:grid-cols-2 gap-6">{Array.from({length:2}).map((_,i)=><div key={i} className="h-64 bg-surface-100 rounded-2xl animate-pulse" />)}</div></div></div>;

  if (!analytics) return null;

  const maxApps = Math.max(...(analytics.applications_per_job || []).map((j: any) => j.count), 1);
  const maxStatus = Math.max(...Object.values(analytics.status_distribution || {}).map(Number), 1);

  const statusColors: Record<string, string> = {
    selected: 'bg-emerald-500',
    rejected: 'bg-red-400',
    shortlisted: 'bg-amber-500',
    interview: 'bg-purple-500',
    under_review: 'bg-orange-400',
    applied: 'bg-primary-500',
  };

  const statusBg: Record<string, string> = {
    selected: 'bg-emerald-50',
    rejected: 'bg-red-50',
    shortlisted: 'bg-amber-50',
    interview: 'bg-purple-50',
    under_review: 'bg-orange-50',
    applied: 'bg-primary-50',
  };

  return (
    <div className="flex">
      <Sidebar role="company" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="mb-8">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Insights into your recruitment performance</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Applications per Job */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineTrendingUp className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Applications per Job</h2>
            </div>
            {(analytics.applications_per_job || []).length === 0 ? (
              <p className="text-sm text-surface-400 py-4 text-center">No data yet</p>
            ) : (
              <div className="space-y-3.5">
                {analytics.applications_per_job.map((item: any) => (
                  <div key={item.job_id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-surface-700 font-medium truncate pr-4">{item.title}</span>
                      <span className="text-surface-500 font-semibold tabular-nums">{item.count}</span>
                    </div>
                    <div className="w-full bg-surface-100 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / maxApps) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Distribution */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineChartBar className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Status Distribution</h2>
            </div>
            {Object.values(analytics.status_distribution || {}).every((v: any) => v === 0) ? (
              <p className="text-sm text-surface-400 py-4 text-center">No data yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(analytics.status_distribution || {}).map(([status, count]: [string, any]) => (
                  <div key={status} className="flex items-center gap-3">
                    <div className={`w-28 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize text-center ${statusBg[status] || 'bg-surface-100'}`}>
                      {status.replace(/_/g, ' ')}
                    </div>
                    <div className="flex-1 bg-surface-100 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusColors[status] || 'bg-surface-400'} transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${Math.max((count as number / maxStatus) * 100, count ? 10 : 0)}%` }}
                      >
                        {count > 0 && <span className="text-[10px] font-bold text-white">{count}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Jobs Table */}
          <div className="card md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineTrendingUp className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Most Popular Job Posts</h2>
            </div>
            {(analytics.most_popular_jobs || []).length === 0 ? (
              <p className="text-sm text-surface-400 py-4 text-center">No data yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-100">
                      <th className="text-left py-3 font-semibold text-surface-500 text-xs uppercase tracking-wider">Rank</th>
                      <th className="text-left py-3 font-semibold text-surface-500 text-xs uppercase tracking-wider">Job Title</th>
                      <th className="text-right py-3 font-semibold text-surface-500 text-xs uppercase tracking-wider">Applications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.most_popular_jobs.map((item: any, i: number) => (
                      <tr key={item.job_id} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
                        <td className="py-3.5">
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs font-bold ${
                            i === 0 ? 'bg-amber-100 text-amber-700' :
                            i === 1 ? 'bg-surface-200 text-surface-600' :
                            i === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-surface-100 text-surface-500'
                          }`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-3.5 font-medium text-surface-900">{item.title}</td>
                        <td className="py-3.5 text-right font-bold text-surface-700 tabular-nums">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
