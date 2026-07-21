'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { StatusBadge, EmptyState } from '@/components/Common';
import { HiOutlineCalendar, HiOutlineLink, HiOutlineLocationMarker, HiOutlineUser } from 'react-icons/hi';

export default function InterviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'company') {
      api.get('/interviews').then((data) => {
        setInterviews(data.interviews || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || loading) return <div className="flex"><Sidebar role="company" /><div className="flex-1 p-8"><div className="space-y-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-28 bg-surface-100 rounded-2xl animate-pulse" />)}</div></div></div>;

  return (
    <div className="flex">
      <Sidebar role="company" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="mb-8">
          <h1 className="page-title">Interviews</h1>
          <p className="page-subtitle">{interviews.length} scheduled interview{interviews.length !== 1 ? 's' : ''}</p>
        </div>

        {interviews.length === 0 ? (
          <EmptyState
            icon={<HiOutlineCalendar className="h-8 w-8" />}
            title="No interviews scheduled"
            description="Schedule interviews from the applicants page to see them here"
          />
        ) : (
          <div className="space-y-3">
            {interviews.map((iv) => (
              <div key={iv.id} className="card hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-purple-100">
                      <HiOutlineUser className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900">{iv.application?.student_name || 'Student'}</h3>
                      <p className="text-sm text-surface-500">{iv.application?.job_title || 'Job'}</p>
                      <div className="mt-2 space-y-1.5">
                        {iv.interview_date && (
                          <p className="text-sm text-surface-600 flex items-center gap-2">
                            <HiOutlineCalendar className="h-3.5 w-3.5 text-surface-400" />
                            {new Date(iv.interview_date).toLocaleString()}
                          </p>
                        )}
                        <p className="text-sm text-surface-600 flex items-center gap-2">
                          <HiOutlineLink className="h-3.5 w-3.5 text-surface-400" />
                          <span className="capitalize">{iv.interview_type}</span>
                          {iv.meeting_link && (
                            <a href={iv.meeting_link} target="_blank" className="text-primary-600 hover:underline font-medium">Join</a>
                          )}
                        </p>
                        {iv.location && (
                          <p className="text-sm text-surface-600 flex items-center gap-2">
                            <HiOutlineLocationMarker className="h-3.5 w-3.5 text-surface-400" />
                            {iv.location}
                          </p>
                        )}
                        {iv.notes && (
                          <p className="text-sm text-surface-500 italic mt-1 ml-5.5">{iv.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={iv.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
