import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Company Profile | CareerConnect',
  description: 'Build your company profile, showcase your culture, and attract top talent to your organization.',
};

export default function CompanyProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
