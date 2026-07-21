'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import JobCard from '@/components/JobCard';
import { EmptyState } from '@/components/Common';
import { HiOutlineBookmark } from 'react-icons/hi';

export default function SavedJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'student') {
      api.get('/students/saved-jobs').then((data) => {
        setSavedJobs(data.saved_jobs || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || loading) return <div className="flex"><Sidebar role="student" /><div className="flex-1 p-8"><div className="space-y-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-28 bg-surface-100 rounded-2xl animate-pulse" />)}</div></div></div>;

  return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="mb-8">
          <h1 className="page-title">Saved Jobs</h1>
          <p className="page-subtitle">Jobs you&apos;ve bookmarked for later</p>
        </div>
        {savedJobs.length === 0 ? (
          <EmptyState
            icon={<HiOutlineBookmark className="h-8 w-8" />}
            title="No saved jobs"
            description="Bookmark jobs you're interested in to review them later"
          />
        ) : (
          <div className="space-y-3">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
