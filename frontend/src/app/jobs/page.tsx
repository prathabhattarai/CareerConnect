'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import JobCard from '@/components/JobCard';
import { SkeletonCard } from '@/components/Skeleton';
import { EmptyState } from '@/components/Common';
import { HiOutlineSearch, HiOutlineBriefcase, HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters = jobType || workMode || experienceLevel || location;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', '12');
      if (search) params.set('search', search);
      if (jobType) params.set('job_type', jobType);
      if (workMode) params.set('work_mode', workMode);
      if (location) params.set('location', location);
      if (experienceLevel) params.set('experience_level', experienceLevel);

      const data = await api.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, jobType, workMode, location, experienceLevel]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setJobType('');
    setWorkMode('');
    setLocation('');
    setExperienceLevel('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Find Opportunities</h1>
        <p className="text-surface-500 mt-1.5">
          {loading ? 'Searching...' : `${total} ${total === 1 ? 'opportunity' : 'opportunities'} available`}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="card mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, skills, or keyword..."
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary">Search</button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary ${hasFilters ? 'border-primary-300 text-primary-700 bg-primary-50' : ''}`}
            >
              <HiOutlineAdjustments className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasFilters && (
                <span className="h-5 w-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {[jobType, workMode, experienceLevel, location].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-surface-100 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-surface-700">Filter by</p>
                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    <HiOutlineX className="h-3 w-3" /> Clear all
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select value={jobType} onChange={(e) => { setJobType(e.target.value); setPage(1); }} className="select-field text-sm">
                  <option value="">All Job Types</option>
                  <option value="internship">Internship</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
                <select value={workMode} onChange={(e) => { setWorkMode(e.target.value); setPage(1); }} className="select-field text-sm">
                  <option value="">All Work Modes</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <select value={experienceLevel} onChange={(e) => { setExperienceLevel(e.target.value); setPage(1); }} className="select-field text-sm">
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead</option>
                </select>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                  placeholder="Location"
                  className="input-field text-sm"
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<HiOutlineBriefcase className="h-8 w-8" />}
          title="No jobs found"
          description="Try adjusting your search or filters to find more opportunities"
        />
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary btn-sm"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-surface-500 hover:bg-surface-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
