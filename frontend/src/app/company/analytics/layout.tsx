import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hiring Analytics | CareerConnect',
  description: 'Track your hiring metrics, application trends, and recruitment performance with detailed analytics.',
};

export default function CompanyAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
