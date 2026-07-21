'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineUser, HiOutlineDocumentText, HiOutlineBriefcase, HiOutlineBookmark, HiOutlineBell, HiOutlineChartBar, HiOutlineUsers, HiOutlineCalendar } from 'react-icons/hi';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const studentLinks: SidebarLink[] = [
  { href: '/student/dashboard', label: 'Dashboard', icon: <HiOutlineHome className="h-5 w-5" /> },
  { href: '/student/profile', label: 'Profile', icon: <HiOutlineUser className="h-5 w-5" /> },
  { href: '/student/applications', label: 'Applications', icon: <HiOutlineDocumentText className="h-5 w-5" /> },
  { href: '/student/saved-jobs', label: 'Saved Jobs', icon: <HiOutlineBookmark className="h-5 w-5" /> },
  { href: '/student/resume', label: 'Resume', icon: <HiOutlineBriefcase className="h-5 w-5" /> },
  { href: '/student/notifications', label: 'Notifications', icon: <HiOutlineBell className="h-5 w-5" /> },
];

const companyLinks: SidebarLink[] = [
  { href: '/company/dashboard', label: 'Dashboard', icon: <HiOutlineHome className="h-5 w-5" /> },
  { href: '/company/profile', label: 'Profile', icon: <HiOutlineUser className="h-5 w-5" /> },
  { href: '/company/jobs', label: 'Job Posts', icon: <HiOutlineBriefcase className="h-5 w-5" /> },
  { href: '/company/applicants', label: 'Applicants', icon: <HiOutlineUsers className="h-5 w-5" /> },
  { href: '/company/interviews', label: 'Interviews', icon: <HiOutlineCalendar className="h-5 w-5" /> },
  { href: '/company/analytics', label: 'Analytics', icon: <HiOutlineChartBar className="h-5 w-5" /> },
  { href: '/company/notifications', label: 'Notifications', icon: <HiOutlineBell className="h-5 w-5" /> },
];

export default function Sidebar({ role }: { role: 'student' | 'company' }) {
  const pathname = usePathname();
  const links = role === 'student' ? studentLinks : companyLinks;

  return (
    <aside className="w-64 bg-white border-r border-surface-100 min-h-[calc(100vh-4rem)] hidden md:block flex-shrink-0">
      <div className="p-4 pt-6">
        <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest mb-3 px-4">
          {role === 'student' ? 'Student' : 'Recruiter'}
        </p>
        <nav className="space-y-0.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'sidebar-link-active' : 'sidebar-link'}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
