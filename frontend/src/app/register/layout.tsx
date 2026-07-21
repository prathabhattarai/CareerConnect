import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | CareerConnect',
  description: 'Join CareerConnect today. Create a student or company account to start your career journey.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
