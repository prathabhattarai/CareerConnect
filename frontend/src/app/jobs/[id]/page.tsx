'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { StatusBadge, Modal } from '@/components/Common';
import { SkeletonProfile } from '@/components/Skeleton';
import {
  HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyDollar,
  HiOutlineBriefcase, HiOutlineBookmark, HiOutlineShare, HiOutlineCheck,
  HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineAcademicCap, HiOutlineGlobe
} from 'react-icons/hi';

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const jobId = Array.isArray(id) ? id[0] : id;
    const fetchJob = async () => {
      try {
        const data = await api.get(`/jobs/${jobId}`);
        setJob(data);
        setSaved(data.is_saved);
      } catch {
        toast.error('Job not found');
        router.push('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, router]);

  useEffect(() => {
    if (user?.role === 'student' && showApplyModal) {
      api.get('/students/resumes').then(setResumes).catch(() => setResumes([]));
    }
  }, [user, showApplyModal]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post('/applications', {
        job_id: parseInt(Array.isArray(id) ? id[0] : id as string),
        resume_id: selectedResumeId,
        cover_letter: coverLetter,
      });
      toast.success('Application submitted!');
      setShowApplyModal(false);
      setCoverLetter('');
      setSelectedResumeId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) { router.push('/login'); return; }
    try {
      const data = await api.post(`/students/saved-jobs/${Array.isArray(id) ? id[0] : id}`);
      setSaved(data.saved);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><SkeletonProfile /></div>;
  if (!job) return null;

  const formatType = (t: string) => t?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Not specified';
    if (job.salary_min && job.salary_max) return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}/year`;
    if (job.salary_min) return `From $${job.salary_min.toLocaleString()}/year`;
    return `Up to $${job.salary_max?.toLocaleString()}/year`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 hover:text-primary-600 mb-6 transition-colors">
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-14 w-14 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0 ring-1 ring-primary-100">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                ) : (
                  <HiOutlineBriefcase className="h-6 w-6 text-primary-500" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-surface-900 tracking-tight">{job.title}</h1>
                <p className="text-surface-500 mt-0.5">{job.company?.company_name || 'Company'}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <StatusBadge status={job.status} />
                  <span className="badge-blue">{formatType(job.job_type)}</span>
                  {job.work_mode && <span className="badge-gray">{formatType(job.work_mode)}</span>}
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface-50 rounded-xl">
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-1">Location</p>
                <p className="text-sm font-medium text-surface-700 flex items-center gap-1.5">
                  <HiOutlineLocationMarker className="h-3.5 w-3.5 text-surface-400" />{job.location || 'Remote'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-1">Salary</p>
                <p className="text-sm font-medium text-surface-700 flex items-center gap-1.5">
                  <HiOutlineCurrencyDollar className="h-3.5 w-3.5 text-surface-400" />{formatSalary()}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-1">Experience</p>
                <p className="text-sm font-medium text-surface-700 flex items-center gap-1.5 capitalize">
                  <HiOutlineAcademicCap className="h-3.5 w-3.5 text-surface-400" />{job.experience_level || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-1">Deadline</p>
                <p className="text-sm font-medium text-surface-700 flex items-center gap-1.5">
                  <HiOutlineClock className="h-3.5 w-3.5 text-surface-400" />
                  {job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'Open'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-surface-900 mb-3">About This Role</h2>
                <p className="text-sm text-surface-600 whitespace-pre-line leading-relaxed">{job.description}</p>
              </div>

              {job.responsibilities && (
                <div>
                  <h2 className="text-base font-semibold text-surface-900 mb-3">Responsibilities</h2>
                  <p className="text-sm text-surface-600 whitespace-pre-line leading-relaxed">{job.responsibilities}</p>
                </div>
              )}

              {job.requirements && (
                <div>
                  <h2 className="text-base font-semibold text-surface-900 mb-3">Requirements</h2>
                  <p className="text-sm text-surface-600 whitespace-pre-line leading-relaxed">{job.requirements}</p>
                </div>
              )}

              {job.skills.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-surface-900 mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s: any) => (
                      <span key={s.id} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium ring-1 ring-primary-100">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <div className="space-y-4">
              {user?.role === 'student' ? (
                <button onClick={() => setShowApplyModal(true)} className="btn-primary w-full btn-lg">
                  Apply Now
                </button>
              ) : !user ? (
                <button onClick={() => router.push('/login')} className="btn-primary w-full btn-lg">
                  Sign In to Apply
                </button>
              ) : null}

              <button onClick={handleSave} className={`w-full ${saved ? 'btn-outline border-primary-300 bg-primary-50' : 'btn-secondary'}`}>
                {saved ? (
                  <><HiOutlineCheck className="h-4 w-4" />Saved</>
                ) : (
                  <><HiOutlineBookmark className="h-4 w-4" />Save Job</>
                )}
              </button>

              <button onClick={handleShare} className="btn-ghost w-full">
                <HiOutlineShare className="h-4 w-4" />
                Share
              </button>

              <div className="border-t border-surface-100 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-surface-900 mb-3">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <HiOutlineBriefcase className="h-4 w-4 text-surface-400 flex-shrink-0" />
                    <div>
                      <p className="text-surface-400 text-xs">Job Type</p>
                      <p className="font-medium text-surface-700">{formatType(job.job_type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <HiOutlineLocationMarker className="h-4 w-4 text-surface-400 flex-shrink-0" />
                    <div>
                      <p className="text-surface-400 text-xs">Location</p>
                      <p className="font-medium text-surface-700">{job.location || 'Remote'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <HiOutlineCurrencyDollar className="h-4 w-4 text-surface-400 flex-shrink-0" />
                    <div>
                      <p className="text-surface-400 text-xs">Salary</p>
                      <p className="font-medium text-surface-700">{formatSalary()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <HiOutlineCalendar className="h-4 w-4 text-surface-400 flex-shrink-0" />
                    <div>
                      <p className="text-surface-400 text-xs">Posted</p>
                      <p className="font-medium text-surface-700">
                        {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  {job.number_of_openings && (
                    <div className="flex items-center gap-3 text-sm">
                      <HiOutlineGlobe className="h-4 w-4 text-surface-400 flex-shrink-0" />
                      <div>
                        <p className="text-surface-400 text-xs">Openings</p>
                        <p className="font-medium text-surface-700">{job.number_of_openings} position{job.number_of_openings > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for this position">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Select Resume</label>
            <select
              value={selectedResumeId || ''}
              onChange={(e) => setSelectedResumeId(e.target.value ? Number(e.target.value) : null)}
              className="select-field"
            >
              <option value="">No resume selected</option>
              {resumes.map((r: any) => (
                <option key={r.id} value={r.id}>{r.filename}</option>
              ))}
            </select>
            {resumes.length === 0 && (
              <p className="text-xs text-surface-500 mt-2">
                No resumes uploaded. <a href="/student/resume" className="text-primary-600 hover:underline font-medium">Upload one</a>
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Cover Letter <span className="text-surface-400 font-normal">(optional)</span></label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="textarea-field h-32"
              placeholder="Tell us why you're a great fit for this role..."
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowApplyModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleApply} disabled={applying} className="btn-primary">
              {applying ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
