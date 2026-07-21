import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | CareerConnect',
  description: 'Stay updated with application status changes, interview invitations, and new opportunities.',
};

export default function StudentNotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
