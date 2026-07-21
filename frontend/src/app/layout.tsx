import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = 'https://careerconnect-orpin.vercel.app';

export const metadata: Metadata = {
  title: 'CareerConnect – Find Jobs & Internships',
  description:
    'Find your dream job or internship. Connect with top companies, apply in seconds, and build your career on CareerConnect.',
  keywords: [
    'jobs',
    'internships',
    'career',
    'hiring',
    'employment',
    'job portal',
    'Nepal jobs',
    'tech jobs',
    'student jobs',
    'graduate jobs',
  ],
  authors: [{ name: 'CareerConnect' }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CareerConnect – Find Jobs & Internships',
    description:
      'Find your dream job or internship. Connect with top companies and build your career.',
    url: siteUrl,
    siteName: 'CareerConnect',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerConnect – Find Jobs & Internships',
    description:
      'Find your dream job or internship. Connect with top companies and build your career.',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  other: {
    'google-site-verification': '8V9h_v_4zuMte3CTgM1vdv70nQPxUh7WfFTlNtiC2kk',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CareerConnect',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    'Nepal\'s leading job and internship portal connecting students with top companies.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@careerconnect.com',
    contactType: 'customer service',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
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
