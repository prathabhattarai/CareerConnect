import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | CareerConnect',
  description: 'Stay updated with new applications, candidate updates, and hiring活动 notifications.',
};

export default function CompanyNotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
