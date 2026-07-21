import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post a Job | CareerConnect',
  description: 'Create and publish job listings to reach thousands of qualified candidates. Find the perfect hire for your team.',
};

export default function CompanyJobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
