'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import toast from 'react-hot-toast';
import { HiOutlineOfficeBuilding, HiOutlineGlobe, HiOutlineLink } from 'react-icons/hi';

export default function CompanyProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: '', phone: '', website: '', industry: '',
    company_size: '', location: '', about: '',
    founded_year: '', social_media_links: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'company')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'company') {
      api.get('/companies/profile').then((data) => {
        setForm({
          full_name: data.user_name || '',
          phone: data.user_phone || '',
          website: data.website || '',
          industry: data.industry || '',
          company_size: data.company_size || '',
          location: data.location || '',
          about: data.about || '',
          founded_year: data.founded_year || '',
          social_media_links: data.social_media_links || '',
        });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/companies/profile', form);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <div className="flex"><Sidebar role="company" /><div className="flex-1 p-8"><div className="space-y-6">{Array.from({length:2}).map((_,i)=><div key={i} className="h-48 bg-surface-100 rounded-2xl animate-pulse" />)}</div></div></div>;

  return (
    <div className="flex">
      <Sidebar role="company" />
      <div className="flex-1 p-6 md:p-8 min-w-0">
        <div className="mb-8">
          <h1 className="page-title">Company Profile</h1>
          <p className="page-subtitle">Manage your company information</p>
        </div>

        <div className="space-y-6">
          {/* Company Info */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineOfficeBuilding className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Company Information</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Company Name</label>
                <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="input-field" placeholder="Your company name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="+1 234 567 890" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Website</label>
                <input value={form.website} onChange={e => setForm({...form, website: e.target.value})} className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Industry</label>
                <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="select-field">
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Company Size</label>
                <select value={form.company_size} onChange={e => setForm({...form, company_size: e.target.value})} className="select-field">
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Location</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field" placeholder="City, Country" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Founded Year</label>
                <input type="number" value={form.founded_year} onChange={e => setForm({...form, founded_year: e.target.value})} className="input-field" min="1900" max="2025" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-surface-700 mb-1.5">About Company</label>
              <textarea value={form.about} onChange={e => setForm({...form, about: e.target.value})} className="textarea-field h-32" placeholder="Tell students about your company culture, mission, and what makes you a great employer..." />
            </div>
          </div>

          {/* Social */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineLink className="h-4 w-4 text-primary-500" />
              <h2 className="section-header mb-0">Social Media</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Social Media Links</label>
              <textarea value={form.social_media_links} onChange={e => setForm({...form, social_media_links: e.target.value})} className="textarea-field h-20" placeholder="Add your LinkedIn, Twitter, and other social links..." />
            </div>
          </div>

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
