import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | CareerConnect',
  description: 'Build your professional profile, add skills, and showcase your experience to top companies.',
};

export default function StudentProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
