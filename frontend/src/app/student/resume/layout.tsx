import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Resume | CareerConnect',
  description: 'Upload and manage your resume. Share it with potential employers when applying for jobs.',
};

export default function StudentResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
