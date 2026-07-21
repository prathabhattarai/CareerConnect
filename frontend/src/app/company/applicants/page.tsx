'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { StatusBadge, Modal, EmptyState } from '@/components/Common';
import toast from 'react-hot-toast';
import { HiOutlineUsers, HiOutlineEye, HiOutlineDownload, HiOutlineUser, HiOutlineCheck, HiOutlineX, HiOutlineCalendar, HiOutlineAcademicCap } from 'react-icons/hi';

export default function CompanyApplicantsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    interview_date: '', interview_type: 'video', meeting_link: '', location: '', notes: ''
  });
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) router.push('/login');
  }, [user, authLoading, router]);

  const fetchApplicants = async () => {
    try {
      const data = await api.get('/companies/applicants');
      setApplicants(data.applicants || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'company') fetchApplicants();
  }, [user]);

  const updateStatus = async (appId: number, status: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      toast.success(`Candidate ${status.replace('_', ' ')}`);
      fetchApplicants();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const scheduleInterview = async () => {
    if (!selectedApp) return;
    setScheduling(true);
    try {
      await api.post('/interviews', {
        application_id: selectedApp.id,
        interview_date: new Date(interviewForm.interview_date).toISOString(),
        interview_type: interviewForm.interview_type,
        meeting_link: interviewForm.meeting_link || null,
        location: interviewForm.location || null,
        notes: interviewForm.notes || null,
      });
      toast.success('Interview scheduled!');
      setShowInterviewModal(false);
      setSelectedApp(null);
      setInterviewForm({ interview_date: '', interview_type: 'video', meeting_link: '', location: '', notes: '' });
      fetchApplicants();
    } catch (err: any) {
      toast.error(err.message || 'Failed to schedule');
    } finally {
      setScheduling(false);
    }
  };

  if (authLoading || loading) return <div className="flex"><Sidebar role="company" /><div className="flex-1 p-8"><div className="space-y-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-32 bg-surface-100 rounded-2xl animate-pulse" />)}</div></div></div>;

  return (
    <div className="flex">
      <Sidebar role="company" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="mb-8">
          <h1 className="page-title">Applicants</h1>
          <p className="page-subtitle">{applicants.length} total applicant{applicants.length !== 1 ? 's' : ''}</p>
        </div>

        {applicants.length === 0 ? (
          <EmptyState
            icon={<HiOutlineUsers className="h-8 w-8" />}
            title="No applicants yet"
            description="Applicants will appear here when students apply to your job posts"
          />
        ) : (
          <div className="space-y-3">
            {applicants.map((app) => (
              <div key={app.id} className="card group hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-11 w-11 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ring-1 ring-primary-100">
                      {app.student?.full_name?.charAt(0) || <HiOutlineUser className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-surface-900">{app.student?.full_name || 'Student'}</h3>
                      <p className="text-sm text-surface-400">{app.student?.email || ''}</p>
                      <div className="mt-1.5 text-sm text-surface-500">
                        Applied for <span className="font-medium text-surface-700">{app.job?.title || 'Job'}</span>
                        {app.student?.education && (
                          <span className="ml-1.5 flex items-center gap-1 inline-flex">
                            <HiOutlineAcademicCap className="h-3.5 w-3.5 text-surface-400" /> {app.student.education}
                          </span>
                        )}
                      </div>
                      {(app.student?.skills || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(app.student?.skills || []).slice(0, 5).map((s: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-surface-50 text-surface-600 text-xs font-medium rounded-lg border border-surface-100">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-surface-100">
                  <button onClick={() => { setSelectedApp(app); setShowDetailModal(true); }} className="btn-ghost btn-sm text-primary-600 hover:text-primary-700">
                    <HiOutlineEye className="h-3.5 w-3.5" /> View Details
                  </button>
                  {app.status === 'applied' && (
                    <button onClick={() => updateStatus(app.id, 'under_review')} className="btn-ghost btn-sm text-amber-600 hover:text-amber-700">
                      <HiOutlineEye className="h-3.5 w-3.5" /> Review
                    </button>
                  )}
                  {app.status === 'under_review' && (
                    <button onClick={() => updateStatus(app.id, 'shortlisted')} className="btn-ghost btn-sm text-emerald-600 hover:text-emerald-700">
                      <HiOutlineCheck className="h-3.5 w-3.5" /> Shortlist
                    </button>
                  )}
                  {app.status === 'shortlisted' && (
                    <>
                      <button onClick={() => { setSelectedApp(app); setShowInterviewModal(true); }} className="btn-ghost btn-sm text-purple-600 hover:text-purple-700">
                        <HiOutlineCalendar className="h-3.5 w-3.5" /> Schedule Interview
                      </button>
                      <button onClick={() => updateStatus(app.id, 'rejected')} className="btn-ghost btn-sm text-red-500 hover:text-red-600">
                        <HiOutlineX className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {app.status === 'interview' && (
                    <>
                      <button onClick={() => updateStatus(app.id, 'selected')} className="btn-ghost btn-sm text-emerald-600 hover:text-emerald-700">
                        <HiOutlineCheck className="h-3.5 w-3.5" /> Select
                      </button>
                      <button onClick={() => updateStatus(app.id, 'rejected')} className="btn-ghost btn-sm text-red-500 hover:text-red-600">
                        <HiOutlineX className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Applicant Details" size="lg">
          {selectedApp && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                  {selectedApp.student?.full_name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">{selectedApp.student?.full_name}</h3>
                  <p className="text-sm text-surface-500">{selectedApp.student?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 bg-surface-50 rounded-xl text-sm">
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-0.5">Education</p>
                  <p className="text-surface-700">{selectedApp.student?.education || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-0.5">University</p>
                  <p className="text-surface-700">{selectedApp.student?.college_university || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-0.5">Location</p>
                  <p className="text-surface-700">{selectedApp.student?.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-0.5">Applied For</p>
                  <p className="text-surface-700">{selectedApp.job?.title}</p>
                </div>
              </div>
              {(selectedApp.student?.skills || []).length > 0 && (
                <div>
                  <p className="text-sm font-medium text-surface-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedApp.student?.skills || []).map((s: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg ring-1 ring-primary-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedApp.cover_letter && (
                <div>
                  <p className="text-sm font-medium text-surface-700 mb-2">Cover Letter</p>
                  <p className="text-sm text-surface-600 whitespace-pre-line bg-surface-50 p-4 rounded-xl leading-relaxed">{selectedApp.cover_letter}</p>
                </div>
              )}
              {selectedApp.resume && (
                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                  <HiOutlineDownload className="h-5 w-5 text-surface-400" />
                  <p className="text-sm font-medium text-surface-700">Resume: {selectedApp.resume.filename}</p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Interview Modal */}
        <Modal isOpen={showInterviewModal} onClose={() => setShowInterviewModal(false)} title="Schedule Interview">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Date & Time *</label>
              <input type="datetime-local" value={interviewForm.interview_date} onChange={e => setInterviewForm({...interviewForm, interview_date: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Interview Type *</label>
              <select value={interviewForm.interview_type} onChange={e => setInterviewForm({...interviewForm, interview_type: e.target.value})} className="select-field">
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Meeting Link</label>
              <input value={interviewForm.meeting_link} onChange={e => setInterviewForm({...interviewForm, meeting_link: e.target.value})} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Location</label>
              <input value={interviewForm.location} onChange={e => setInterviewForm({...interviewForm, location: e.target.value})} className="input-field" placeholder="Office address or room" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Notes</label>
              <textarea value={interviewForm.notes} onChange={e => setInterviewForm({...interviewForm, notes: e.target.value})} className="textarea-field h-20" placeholder="Any notes for the interview..." />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowInterviewModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={scheduleInterview} disabled={scheduling || !interviewForm.interview_date} className="btn-primary">
                {scheduling ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
