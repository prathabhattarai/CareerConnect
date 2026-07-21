'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { StatusBadge, Modal } from '@/components/Common';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineBriefcase, HiOutlineUsers } from 'react-icons/hi';

const defaultJobForm = {
  title: '', description: '', responsibilities: '', requirements: '',
  job_type: 'full_time', work_mode: 'onsite', location: '',
  salary_min: '', salary_max: '', experience_level: 'entry',
  application_deadline: '', number_of_openings: 1, skills: '',
  status: 'draft',
};

export default function CompanyJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [form, setForm] = useState(defaultJobForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) router.push('/login');
  }, [user, authLoading, router]);

  const fetchJobs = async () => {
    try {
      const data = await api.get('/companies/jobs');
      setJobs(data.jobs || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'company') fetchJobs();
  }, [user]);

  const openCreate = () => {
    setEditingJob(null);
    setForm(defaultJobForm);
    setShowModal(true);
  };

  const openEdit = (job: any) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      description: job.description,
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      job_type: job.job_type,
      work_mode: job.work_mode || 'onsite',
      location: job.location || '',
      salary_min: job.salary_min || '',
      salary_max: job.salary_max || '',
      experience_level: job.experience_level || 'entry',
      application_deadline: job.application_deadline ? job.application_deadline.split('T')[0] : '',
      number_of_openings: job.number_of_openings || 1,
      skills: (job.skills || []).join(', '),
      status: job.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        ...form,
        salary_min: form.salary_min ? parseFloat(form.salary_min as string) : null,
        salary_max: form.salary_max ? parseFloat(form.salary_max as string) : null,
        number_of_openings: parseInt(form.number_of_openings as any),
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        application_deadline: form.application_deadline ? new Date(form.application_deadline).toISOString() : null,
      };

      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, payload);
        toast.success('Job updated!');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job created!');
      }
      setShowModal(false);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this job post?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      fetchJobs();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePublish = async (job: any) => {
    try {
      const newStatus = job.status === 'active' ? 'closed' : 'active';
      await api.put(`/jobs/${job.id}`, { status: newStatus });
      toast.success(`Job ${newStatus === 'active' ? 'published' : 'closed'}!`);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (authLoading || loading) return <div className="flex"><Sidebar role="company" /><div className="flex-1 p-8"><div className="space-y-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-28 bg-surface-100 rounded-2xl animate-pulse" />)}</div></div></div>;

  return (
    <div className="flex">
      <Sidebar role="company" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">Job Posts</h1>
            <p className="page-subtitle">{jobs.length} job {jobs.length === 1 ? 'post' : 'posts'} total</p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            <HiOutlinePlus className="h-4 w-4" /> Create Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="card text-center py-16">
            <div className="h-16 w-16 bg-surface-100 rounded-2xl flex items-center justify-center text-surface-400 mx-auto mb-4">
              <HiOutlineBriefcase className="h-6 w-6" />
            </div>
            <p className="text-surface-500 mb-4">No job posts yet</p>
            <button onClick={openCreate} className="btn-primary">Create Your First Job</button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="card group hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-surface-900 text-[15px]">{job.title}</h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-surface-500">
                      <span className="capitalize">{job.job_type?.replace('_', ' ')}</span>
                      <span className="text-surface-300">·</span>
                      <span>{job.location || 'Remote'}</span>
                      <span className="text-surface-300">·</span>
                      <span className="flex items-center gap-1">
                        <HiOutlineUsers className="h-3.5 w-3.5 text-surface-400" />
                        {job.application_count || 0} applicants
                      </span>
                    </div>
                    {(job.skills || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {(job.skills || []).slice(0, 5).map((s: string, i: number) => (
                          <span key={i} className="px-2.5 py-0.5 bg-surface-50 text-surface-600 text-xs font-medium rounded-lg border border-surface-100">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-surface-100">
                  <button onClick={() => openEdit(job)} className="btn-ghost btn-sm text-primary-600 hover:text-primary-700">
                    <HiOutlinePencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handlePublish(job)}
                    className={`btn-ghost btn-sm ${job.status === 'active' ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}`}
                  >
                    {job.status === 'active' ? 'Close' : 'Publish'}
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="btn-ghost btn-sm text-red-500 hover:text-red-600">
                    <HiOutlineTrash className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingJob ? 'Edit Job' : 'Create Job'} size="lg">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Job Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required placeholder="e.g. Senior Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="textarea-field h-32" required placeholder="Describe the role..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Job Type *</label>
                <select value={form.job_type} onChange={e => setForm({...form, job_type: e.target.value})} className="select-field">
                  <option value="internship">Internship</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Work Mode</label>
                <select value={form.work_mode} onChange={e => setForm({...form, work_mode: e.target.value})} className="select-field">
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Experience Level</label>
                <select value={form.experience_level} onChange={e => setForm({...form, experience_level: e.target.value})} className="select-field">
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Location</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Salary Min</label>
                <input type="number" value={form.salary_min} onChange={e => setForm({...form, salary_min: e.target.value})} className="input-field" placeholder="40000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Salary Max</label>
                <input type="number" value={form.salary_max} onChange={e => setForm({...form, salary_max: e.target.value})} className="input-field" placeholder="80000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Openings</label>
                <input type="number" value={form.number_of_openings} onChange={e => setForm({...form, number_of_openings: parseInt(e.target.value) || 1})} className="input-field" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Deadline</label>
                <input type="date" value={form.application_deadline} onChange={e => setForm({...form, application_deadline: e.target.value})} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Responsibilities</label>
              <textarea value={form.responsibilities} onChange={e => setForm({...form, responsibilities: e.target.value})} className="textarea-field h-24" placeholder="Key responsibilities..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Requirements</label>
              <textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} className="textarea-field h-24" placeholder="Requirements and qualifications..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Skills <span className="text-surface-400 font-normal">(comma-separated)</span></label>
              <input value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="input-field" placeholder="Python, React, SQL, etc." />
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-surface-100">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title || !form.description} className="btn-primary">
                {saving ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
