'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import toast from 'react-hot-toast';
import { EmptyState } from '@/components/Common';
import { HiOutlineDocumentText, HiOutlineTrash, HiOutlineUpload, HiOutlineDocument } from 'react-icons/hi';

export default function ResumePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) router.push('/login');
  }, [user, authLoading, router]);

  const fetchResumes = async () => {
    try {
      const data = await api.get('/students/resumes');
      setResumes(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'student') fetchResumes();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, DOC, DOCX files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/students/resume', formData, true);
      toast.success('Resume uploaded!');
      fetchResumes();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await api.delete(`/students/resume/${id}`);
      toast.success('Resume deleted');
      fetchResumes();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (authLoading || loading) return <div className="flex"><Sidebar role="student" /><div className="flex-1 p-8"><div className="space-y-3">{Array.from({length:2}).map((_,i)=><div key={i} className="h-20 bg-surface-100 rounded-xl animate-pulse" />)}</div></div></div>;

  return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">My Resumes</h1>
            <p className="page-subtitle">Upload and manage your resumes</p>
          </div>
          <label className="btn-primary cursor-pointer">
            <HiOutlineUpload className="h-4 w-4" />
            Upload Resume
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {uploading && (
          <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-primary-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <span className="text-sm font-medium text-primary-700">Uploading your resume...</span>
          </div>
        )}

        {resumes.length === 0 ? (
          <EmptyState
            icon={<HiOutlineDocumentText className="h-8 w-8" />}
            title="No resumes uploaded"
            description="Upload your resume to apply for jobs. We accept PDF, DOC, and DOCX files up to 5MB."
          />
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div key={resume.id} className="card group hover:shadow-card-hover transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center ring-1 ring-primary-100">
                      <HiOutlineDocument className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900 text-sm">{resume.filename}</p>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {resume.file_size ? `${(resume.file_size / 1024).toFixed(1)} KB` : ''}
                        {resume.file_size && resume.created_at && ' · '}
                        {resume.created_at ? new Date(resume.created_at).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(resume.id)} className="p-2.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
