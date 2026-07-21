import Link from 'next/link';
import { HiBriefcase } from 'react-icons/hi';

const footerLinks = {
  'For Students': [
    { label: 'Browse Jobs', href: '/jobs' },
    { label: 'Student Dashboard', href: '/student/dashboard' },
    { label: 'My Profile', href: '/student/profile' },
    { label: 'My Applications', href: '/student/applications' },
    { label: 'Saved Jobs', href: '/student/saved-jobs' },
  ],
  'For Companies': [
    { label: 'Post a Job', href: '/company/jobs' },
    { label: 'Company Dashboard', href: '/company/dashboard' },
    { label: 'Review Applicants', href: '/company/applicants' },
    { label: 'Schedule Interviews', href: '/company/interviews' },
    { label: 'Hiring Analytics', href: '/company/analytics' },
  ],
  'CareerConnect': [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Sign In', href: '/login' },
    { label: 'Create Account', href: '/register' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <HiBriefcase className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CareerConnect</span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed">
              Nepal&apos;s leading job and internship portal connecting students with top companies.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm text-surface-500 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-surface-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/jobs" className="text-sm text-surface-500 hover:text-white transition-colors">Jobs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
