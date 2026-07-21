import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Details | CareerConnect',
  description: 'View job details, requirements, and apply directly on CareerConnect.',
};

export default function JobDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
