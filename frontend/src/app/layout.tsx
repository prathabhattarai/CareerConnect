import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'CareerConnect — Job & Internship Portal',
  description:
    'Connect with top companies and discover opportunities that match your skills. Find your dream job or hire exceptional talent.',
  keywords: [
    'jobs',
    'internships',
    'career',
    'hiring',
    'employment',
    'job portal',
    'Nepal jobs',
    'tech jobs',
  ],
  authors: [{ name: 'CareerConnect' }],
  openGraph: {
    title: 'CareerConnect — Job & Internship Portal',
    description:
      'Connect with top companies and discover opportunities that match your skills.',
    url: 'https://careerconnect-orpin.vercel.app',
    siteName: 'CareerConnect',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerConnect — Job & Internship Portal',
    description:
      'Connect with top companies and discover opportunities that match your skills.',
  },
  other: {
    'google-site-verification': '8V9h_v_4zuMte3CTgM1vdv70nQPxUh7WfFTlNtiC2kk',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              padding: '12px 16px',
              boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#f8fafc' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
          }}
        />
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
