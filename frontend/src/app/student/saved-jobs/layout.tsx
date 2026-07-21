import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Jobs | CareerConnect',
  description: 'View and manage your saved job listings. Keep track of opportunities you want to apply for later.',
};

export default function StudentSavedJobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
