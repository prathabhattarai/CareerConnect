import type { Metadata } from 'next';
import Link from 'next/link';
import {
  HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineOfficeBuilding,
  HiOutlineShieldCheck, HiOutlineGlobe, HiOutlineHeart,
  HiOutlineLightningBolt, HiOutlineChartBar, HiOutlineCheckCircle,
} from 'react-icons/hi';

export const metadata: Metadata = {
  title: 'About Us | CareerConnect — Job & Internship Portal',
  description:
    'Learn about CareerConnect, Nepal\'s leading job and internship portal connecting students with top companies. Our mission is to bridge the gap between education and employment.',
  openGraph: {
    title: 'About CareerConnect — Nepal\'s Leading Job Portal',
    description:
      'CareerConnect connects students with top companies for jobs and internships across Nepal.',
    url: 'https://careerconnect-orpin.vercel.app/about',
  },
};

const stats = [
  { value: '2,500+', label: 'Active Job Listings' },
  { value: '850+', label: 'Partner Companies' },
  { value: '15,000+', label: 'Registered Students' },
  { value: '95%', label: 'Satisfaction Rate' },
];

const values = [
  {
    icon: HiOutlineShieldCheck,
    title: 'Trust & Transparency',
    description: 'Every company and student on our platform is verified. We ensure honest job listings and authentic profiles.',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Speed & Efficiency',
    description: 'Apply to jobs in seconds. Our streamlined process saves time for both students and employers.',
  },
  {
    icon: HiOutlineHeart,
    title: 'Student-First Approach',
    description: 'Built by students, for students. We understand the challenges of starting your career and designed our platform to help.',
  },
  {
    icon: HiOutlineGlobe,
    title: 'Global Reach, Local Focus',
    description: 'While we connect opportunities worldwide, we specialize in the Nepal job market with local industry insights.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up as a student or company. Build your profile with skills, experience, and preferences.',
  },
  {
    step: '02',
    title: 'Explore Opportunities',
    description: 'Browse thousands of jobs and internships. Use smart filters to find roles that match your skills and interests.',
  },
  {
    step: '03',
    title: 'Apply & Connect',
    description: 'Submit applications with your resume and cover letter. Schedule interviews and start your career journey.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Bridging Education & Employment
            </h1>
            <p className="text-lg text-primary-100/80 leading-relaxed">
              CareerConnect is Nepal&apos;s leading job and internship portal, connecting ambitious students
              with innovative companies. We believe every student deserves access to meaningful career opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-sm text-surface-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">Our Mission</h2>
            <p className="text-lg text-surface-600 leading-relaxed">
              To empower the next generation of professionals by connecting them with opportunities that
              match their skills, passions, and aspirations. We&apos;re building a future where every student
              can find their dream job and every company can discover exceptional talent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-primary-100">
                    <value.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-surface-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">How It Works</h2>
            <p className="text-lg text-surface-600">
              Getting started on CareerConnect is simple. Follow these three steps to begin your career journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="h-16 w-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{step.title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Students & Companies */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="h-14 w-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-primary-100">
                <HiOutlineUserGroup className="h-7 w-7 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-surface-900 mb-3">For Students</h2>
              <p className="text-surface-600 mb-6 leading-relaxed">
                Find internships, entry-level positions, and graduate opportunities from Nepal&apos;s top
                companies. Build your profile, upload your resume, and let employers find you.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Browse thousands of verified job listings',
                  'Apply with one click using your profile',
                  'Track applications and interview schedules',
                  'Get matched with opportunities based on your skills',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-surface-600">
                    <HiOutlineCheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary">
                Sign Up as Student
              </Link>
            </div>

            <div className="card p-8">
              <div className="h-14 w-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-5 ring-1 ring-primary-100">
                <HiOutlineOfficeBuilding className="h-7 w-7 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-surface-900 mb-3">For Companies</h2>
              <p className="text-surface-600 mb-6 leading-relaxed">
                Post job listings and discover talented students ready to contribute to your team.
                Our platform makes hiring efficient and effective.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Post unlimited job listings for free',
                  'Access a pool of verified student candidates',
                  'Manage applications with our hiring dashboard',
                  'Schedule and track interviews seamlessly',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-surface-600">
                    <HiOutlineCheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-primary">
                Sign Up as Company
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-primary-100/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students and companies already using CareerConnect to build meaningful careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-all">
              <HiOutlineBriefcase className="h-5 w-5" />
              Browse Jobs
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/25 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
