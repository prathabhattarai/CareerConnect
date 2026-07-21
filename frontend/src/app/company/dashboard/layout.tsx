import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Company Dashboard | CareerConnect',
  description: 'Manage your job postings, review applications, and track hiring metrics from your company dashboard.',
};

export default function CompanyDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
