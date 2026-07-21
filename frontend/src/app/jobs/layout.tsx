import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Jobs & Internships | CareerConnect',
  description:
    'Browse thousands of job and internship opportunities from top companies. Filter by job type, work mode, experience level, and location.',
  openGraph: {
    title: 'Find Jobs & Internships | CareerConnect',
    description:
      'Browse thousands of job and internship opportunities from top companies.',
    url: 'https://careerconnect-orpin.vercel.app/jobs',
  },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
