'use client';

import Link from 'next/link';
import { HiOutlineClock, HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCurrencyDollar } from 'react-icons/hi';

interface JobCardProps {
  job: {
    id: number;
    title: string;
    job_type: string;
    work_mode?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    created_at?: string;
    skills: string[];
    company?: {
      company_name: string;
      logo?: string;
      industry?: string;
    };
  };
}

function formatJobType(type: string) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatSalary(min?: number, max?: number) {
  if (!min && !max) return null;
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  return `Up to $${max?.toLocaleString()}`;
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job }: JobCardProps) {
  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="card-interactive group">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-primary-100">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={`${job.company.company_name} logo`} className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <HiOutlineBriefcase className="h-5 w-5 text-primary-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors text-[15px] leading-snug">
                {job.title}
              </h3>
              {job.created_at && (
                <span className="text-xs text-surface-400 whitespace-nowrap flex-shrink-0">{timeAgo(job.created_at)}</span>
              )}
            </div>
            <p className="text-sm text-surface-500 mt-0.5">
              {job.company?.company_name || 'Company'}
              {job.company?.industry && <span className="text-surface-300 mx-1.5">·</span>}
              {job.company?.industry && <span className="text-surface-400">{job.company.industry}</span>}
            </p>
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-surface-500">
                <HiOutlineClock className="h-3.5 w-3.5 text-surface-400" />
                {formatJobType(job.job_type)}
              </span>
              {job.work_mode && (
                <span className="inline-flex items-center gap-1.5 text-xs text-surface-500">
                  <HiOutlineBriefcase className="h-3.5 w-3.5 text-surface-400" />
                  {formatJobType(job.work_mode)}
                </span>
              )}
              {job.location && (
                <span className="inline-flex items-center gap-1.5 text-xs text-surface-500">
                  <HiOutlineLocationMarker className="h-3.5 w-3.5 text-surface-400" />
                  {job.location}
                </span>
              )}
              {salary && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <HiOutlineCurrencyDollar className="h-3.5 w-3.5" />
                  {salary}
                </span>
              )}
            </div>
            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.skills.slice(0, 5).map((skill: any, i: number) => (
                  <span key={i} className="px-2.5 py-0.5 bg-surface-50 text-surface-600 text-xs font-medium rounded-lg border border-surface-100">
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
                {job.skills.length > 5 && (
                  <span className="px-2.5 py-0.5 text-surface-400 text-xs font-medium">
                    +{job.skills.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
