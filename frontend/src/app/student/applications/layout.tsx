import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Applications | CareerConnect',
  description: 'Track your job applications, interview schedules, and application status in one place.',
};

export default function StudentApplicationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
