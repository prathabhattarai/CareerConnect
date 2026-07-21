import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Dashboard | CareerConnect',
  description: 'Manage your job applications, profile, and career opportunities from your personalized student dashboard.',
  openGraph: {
    title: 'Student Dashboard | CareerConnect',
    description: 'Manage your job applications and career opportunities.',
  },
};

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
