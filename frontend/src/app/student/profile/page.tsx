'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import toast from 'react-hot-toast';
import { SkeletonProfile } from '@/components/Skeleton';
import { HiOutlineUser, HiOutlineAcademicCap, HiOutlineCollection, HiOutlineLink, HiOutlinePlusCircle } from 'react-icons/hi';

export default function StudentProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [form, setForm] = useState({
    full_name: '', phone: '', bio: '', education: '',
    college_university: '', graduation_year: '', location: '',
    github_link: '', linkedin_link: '', portfolio_link: '',
    certifications: '', projects: '', work_experience: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'student') {
      api.get('/students/profile').then((data) => {
        setProfile(data);
        setForm({
          full_name: data.user_name || '',
          phone: data.user_phone || '',
          bio: data.bio || '',
          education: data.education || '',
          college_university: data.college_university || '',
          graduation_year: data.graduation_year || '',
          location: data.location || '',
          github_link: data.github_link || '',
          linkedin_link: data.linkedin_link || '',
          portfolio_link: data.portfolio_link || '',
          certifications: data.certifications || '',
          projects: data.projects || '',
          work_experience: data.work_experience || '',
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await api.put('/students/profile', form);
      setProfile(data);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      await api.post('/students/skills', { skills: [newSkill.trim()] });
      setNewSkill('');
      const data = await api.get('/students/profile');
      setProfile(data);
      toast.success('Skill added!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRemoveSkill = async (skill: string) => {
    try {
      await api.delete(`/students/skills/${encodeURIComponent(skill)}`);
      const data = await api.get('/students/profile');
      setProfile(data);
      toast.success('Skill removed');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (authLoading || loading) return <div className="flex"><Sidebar role="student" /><div className="flex-1 p-8"><SkeletonProfile /></div></div>;

  const completionPct = profile?.completion_percentage || 0;

  return (
    <div className="flex">
      <Sidebar role="student" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your professional profile</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-surface-700">{completionPct}% complete</p>
            </div>
            <div className="w-28 h-2 bg-surface-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${completionPct >= 80 ? 'bg-emerald-500' : completionPct >= 50 ? 'bg-primary-500' : 'bg-amber-500'}`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineUser className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Personal Information</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
                <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="+1 234 567 890" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="textarea-field h-24" placeholder="Tell us about yourself and your career goals..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Location</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field" placeholder="City, Country" />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineAcademicCap className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Education</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Education Level</label>
                <select value={form.education} onChange={e => setForm({...form, education: e.target.value})} className="select-field">
                  <option value="">Select</option>
                  <option value="High School">High School</option>
                  <option value="Associate">Associate</option>
                  <option value="Bachelor">Bachelor&apos;s</option>
                  <option value="Master">Master&apos;s</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">College/University</label>
                <input value={form.college_university} onChange={e => setForm({...form, college_university: e.target.value})} className="input-field" placeholder="University name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Graduation Year</label>
                <input type="number" value={form.graduation_year} onChange={e => setForm({...form, graduation_year: e.target.value})} className="input-field" min="2020" max="2035" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineCollection className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Skills</h2>
            </div>
            <div className="flex gap-2 mb-4">
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} className="input-field flex-1" placeholder="Type a skill..." onKeyDown={e => e.key === 'Enter' && handleAddSkill()} />
              <button onClick={handleAddSkill} className="btn-primary btn-sm">
                <HiOutlinePlusCircle className="h-4 w-4" /> Add
              </button>
            </div>
            {(profile?.skills || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(profile?.skills || []).map((skill: string) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium ring-1 ring-primary-100">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="text-primary-400 hover:text-red-500 transition-colors ml-0.5">&times;</button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-400">No skills added yet</p>
            )}
          </div>

          {/* Links */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineLink className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Links & Social</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">GitHub</label>
                <input value={form.github_link} onChange={e => setForm({...form, github_link: e.target.value})} className="input-field" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">LinkedIn</label>
                <input value={form.linkedin_link} onChange={e => setForm({...form, linkedin_link: e.target.value})} className="input-field" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Portfolio</label>
                <input value={form.portfolio_link} onChange={e => setForm({...form, portfolio_link: e.target.value})} className="input-field" placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineCollection className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Additional Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Certifications</label>
                <textarea value={form.certifications} onChange={e => setForm({...form, certifications: e.target.value})} className="textarea-field h-20" placeholder="List your certifications..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Projects</label>
                <textarea value={form.projects} onChange={e => setForm({...form, projects: e.target.value})} className="textarea-field h-20" placeholder="Describe your key projects..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Work Experience</label>
                <textarea value={form.work_experience} onChange={e => setForm({...form, work_experience: e.target.value})} className="textarea-field h-20" placeholder="Describe your work experience..." />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary btn-lg">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
