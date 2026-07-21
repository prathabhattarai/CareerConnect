import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | CareerConnect',
  description: 'Sign in to your CareerConnect account to manage your job applications and profile.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
