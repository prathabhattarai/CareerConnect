import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Review Applicants | CareerConnect',
  description: 'Review job applications, screen candidates, and manage your hiring pipeline efficiently.',
};

export default function CompanyApplicantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
