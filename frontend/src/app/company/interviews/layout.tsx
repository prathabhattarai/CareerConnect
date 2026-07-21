import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schedule Interviews | CareerConnect',
  description: 'Schedule and manage interviews with candidates. Keep track of upcoming and completed interviews.',
};

export default function CompanyInterviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
