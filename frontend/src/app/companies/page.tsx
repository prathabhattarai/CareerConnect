'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { EmptyState } from '@/components/Common';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

export default function CompaniesPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs?per_page=100').then((data) => {
      const companies = new Map();
      (data.jobs || []).forEach((job: any) => {
        if (job.company && !companies.has(job.company.id)) {
          companies.set(job.company.id, { ...job.company, job_count: 0 });
        }
        if (job.company) {
          companies.get(job.company.id).job_count++;
        }
      });
      setJobs(Array.from(companies.values()));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies</h1>
      <p className="text-gray-500 mb-8">{jobs.length} companies hiring</p>

      {jobs.length === 0 ? (
        <EmptyState
          icon={<HiOutlineOfficeBuilding className="h-12 w-12" />}
          title="No companies yet"
          description="Companies will appear here once they post jobs"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((company: any) => (
            <div key={company.id} className="card hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {company.logo ? (
                    <img src={company.logo} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <HiOutlineOfficeBuilding className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{company.company_name}</h3>
                  <p className="text-sm text-gray-500">{company.industry || 'Industry'}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                {company.location && <p>{company.location}</p>}
                {company.company_size && <p>{company.company_size} employees</p>}
                <p className="text-blue-600">{company.job_count} open positions</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
