'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { StatusBadge, EmptyState } from '@/components/Common';
import { HiOutlineDocumentText, HiOutlineCalendar, HiOutlineLink } from 'react-icons/hi';

const PROGRESS_STEPS = ['applied', 'under_review', 'shortlisted', 'interview', 'selected'];

export default function StudentApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'student') {
      api.get('/students/applications').then((data) => {
        setApplications(data.applications || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || loading) return <div className="flex"><Sidebar role="student" /><div className="flex-1 p-8"><div className="space-y-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-32 bg-surface-100 rounded-2xl animate-pulse" />)}</div></div></div>;

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="mb-8">
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">Track the progress of your job applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-surface-500 border border-surface-200 hover:border-surface-300 hover:text-surface-700'
              }`}
            >
              {f === 'all' ? `All (${applications.length})` : `${f.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (${applications.filter(a => a.status === f).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<HiOutlineDocumentText className="h-8 w-8" />}
            title={filter === 'all' ? "No applications yet" : "No applications with this status"}
            description={filter === 'all' ? "Start applying to jobs to track your progress here" : "Try a different filter"}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div key={app.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-surface-900 text-[15px]">{app.job?.title || 'Job'}</h3>
                    <p className="text-sm text-surface-500 mt-0.5">{app.job?.company_name || ''}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-surface-400">
                      {app.job?.location && <span>{app.job.location}</span>}
                      {app.job?.job_type && <span className="capitalize">{app.job.job_type.replace('_', ' ')}</span>}
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {app.interview && (
                  <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <HiOutlineCalendar className="h-4 w-4 text-purple-600" />
                      <p className="text-sm font-semibold text-purple-800">Interview Scheduled</p>
                    </div>
                    <p className="text-sm text-purple-600 ml-6">
                      {new Date(app.interview.interview_date).toLocaleString()} — {app.interview.interview_type}
                    </p>
                    {app.interview.meeting_link && (
                      <a href={app.interview.meeting_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-6 mt-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <HiOutlineLink className="h-3.5 w-3.5" /> Join Meeting
                      </a>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                  <span className="text-xs text-surface-400">
                    Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    {PROGRESS_STEPS.map((s, i) => (
                      <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${
                        PROGRESS_STEPS.indexOf(app.status) >= i
                          ? 'bg-primary-500' : 'bg-surface-200'
                      }`} />
                    ))}
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
