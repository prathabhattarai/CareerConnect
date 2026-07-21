'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineBriefcase, HiOutlineUser, HiOutlineOfficeBuilding } from 'react-icons/hi';

export default function RegisterPage() {
  const [role, setRole] = useState<'student' | 'company'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(user.role === 'student' ? '/student/dashboard' : '/company/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const newUser = await register({ email, password, full_name: fullName, phone, role });
      toast.success('Account created successfully!');
      router.push(newUser.role === 'student' ? '/student/dashboard' : '/company/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <HiOutlineBriefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">CareerConnect</span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Create your account</h1>
          <p className="text-surface-500 mt-1.5 text-sm">Join thousands of professionals on CareerConnect</p>
        </div>
        <div className="card">
          {/* Role Toggle */}
          <div className="flex bg-surface-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                role === 'student' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <HiOutlineUser className="h-4 w-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('company')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                role === 'company' ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <HiOutlineOfficeBuilding className="h-4 w-4" />
              Company
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                {role === 'student' ? 'Full Name' : 'Company Name'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
                placeholder={role === 'student' ? 'John Doe' : 'Acme Corp'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone <span className="text-surface-400 font-normal">(optional)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating account...
                </span>
              ) : `Create ${role === 'student' ? 'Student' : 'Company'} Account`}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-surface-100 text-center">
            <p className="text-sm text-surface-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
