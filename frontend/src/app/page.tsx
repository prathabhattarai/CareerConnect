'use client';

import Link from 'next/link';
import { HiOutlineSearch, HiOutlineBriefcase, HiOutlineOfficeBuilding, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineGlobe, HiOutlineArrowRight, HiOutlineCheckCircle, HiOutlineTrendingUp, HiOutlineLightningBolt } from 'react-icons/hi';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        <div className="absolute inset-0 opacity-10 pattern-dots" style={{ backgroundSize: '40px 40px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-8">
              <HiOutlineLightningBolt className="h-3.5 w-3.5" />
              Trusted by 10,000+ students and companies
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6 text-balance">
              Find the Right Opportunity.<br />
              <span className="text-primary-200">Build Your Future.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with top companies and discover opportunities that match your skills and aspirations. Your career journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="inline-flex items-center justify-center gap-2.5 bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary-50 transition-all shadow-elevated hover:shadow-lg hover:-translate-y-0.5">
                <HiOutlineSearch className="h-5 w-5" />
                Browse Opportunities
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center gap-2.5 bg-white/10 text-white border border-white/25 px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 transition-all backdrop-blur-sm">
                Post a Job
                <HiOutlineArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2,500+', label: 'Active Jobs' },
              { value: '850+', label: 'Companies' },
              { value: '15,000+', label: 'Students' },
              { value: '95%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-surface-900">{stat.value}</p>
                <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CareerConnect */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Why CareerConnect</p>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 tracking-tight">Everything you need to succeed</h2>
            <p className="text-surface-500 mt-3 max-w-xl mx-auto">A complete platform designed to connect exceptional talent with the right opportunities.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <HiOutlineBriefcase className="h-6 w-6" />,
                title: 'Curated Opportunities',
                description: 'Access thousands of hand-picked jobs and internships from industry-leading companies.',
                color: 'bg-primary-50 text-primary-600 ring-primary-100',
              },
              {
                icon: <HiOutlineOfficeBuilding className="h-6 w-6" />,
                title: 'Top Companies',
                description: 'Connect with verified companies actively looking for talented individuals like you.',
                color: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
              },
              {
                icon: <HiOutlineUserGroup className="h-6 w-6" />,
                title: 'Smart Matching',
                description: 'Our platform matches your skills and interests with the most relevant opportunities.',
                color: 'bg-purple-50 text-purple-600 ring-purple-100',
              },
            ].map((feature) => (
              <div key={feature.title} className="card group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ring-1 ${feature.color} mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 tracking-tight">Start in four simple steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-surface-100" />
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up as a student or company in seconds', icon: <HiOutlineUserGroup className="h-5 w-5" /> },
              { step: '2', title: 'Build Profile', desc: 'Showcase your skills and experience', icon: <HiOutlineShieldCheck className="h-5 w-5" /> },
              { step: '3', title: 'Discover & Apply', desc: 'Find and apply to the best opportunities', icon: <HiOutlineSearch className="h-5 w-5" /> },
              { step: '4', title: 'Get Hired', desc: 'Interview and land your dream role', icon: <HiOutlineTrendingUp className="h-5 w-5" /> },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="h-16 w-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 relative z-10">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-surface-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-surface-500 max-w-[200px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Explore Categories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 tracking-tight">Popular job categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Technology', count: '450+ jobs', icon: '💻' },
              { name: 'Design', count: '180+ jobs', icon: '🎨' },
              { name: 'Marketing', count: '220+ jobs', icon: '📈' },
              { name: 'Finance', count: '160+ jobs', icon: '💰' },
              { name: 'Engineering', count: '320+ jobs', icon: '⚙️' },
              { name: 'Healthcare', count: '140+ jobs', icon: '🏥' },
              { name: 'Education', count: '190+ jobs', icon: '📚' },
              { name: 'Sales', count: '210+ jobs', icon: '🤝' },
            ].map((cat) => (
              <Link key={cat.name} href="/jobs" className="card group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 text-center">
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <h3 className="font-semibold text-surface-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-surface-400 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Benefits</p>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 tracking-tight mb-6">Why professionals choose CareerConnect</h2>
              <p className="text-surface-500 mb-8 leading-relaxed">We provide the tools and connections you need to accelerate your career or find the perfect candidate. <Link href="/about" className="text-primary-600 hover:text-primary-700 font-medium">Learn more about our mission</Link>.</p>
              <div className="space-y-4">
                {[
                  'Real-time application tracking',
                  'Direct messaging with recruiters',
                  'AI-powered job recommendations',
                  'Verified company profiles',
                  'Resume review and feedback',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <HiOutlineCheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-surface-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 border border-primary-200/50">
              <div className="space-y-4">
                {[
                  { role: 'Student', text: '"CareerConnect helped me land my dream internship at a top tech company. The platform is incredibly easy to use."', name: 'Sarah K.', detail: 'Computer Science Student' },
                  { role: 'Company', text: '"We\'ve hired 12 talented developers through CareerConnect. The quality of candidates is outstanding."', name: 'James L.', detail: 'HR Director, TechCorp' },
                ].map((testimonial) => (
                  <div key={testimonial.name} className="bg-white rounded-2xl p-5 shadow-card">
                    <p className="text-sm text-surface-600 italic mb-3">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{testimonial.name}</p>
                        <p className="text-xs text-surface-400">{testimonial.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pattern-dots-sm" style={{ backgroundSize: '32px 32px' }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Ready to start your career journey?</h2>
              <p className="text-primary-100/80 mb-8 text-lg">Join thousands of students and companies already on CareerConnect</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-all shadow-elevated">
                  Create Free Account
                </Link>
                <Link href="/jobs" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-900 mb-6">Your Gateway to Career Success</h2>
          <div className="prose prose-slate max-w-none text-surface-600 leading-relaxed space-y-4 text-sm">
            <p>
              CareerConnect is a comprehensive job and internship platform designed to bridge the gap between
              education and employment. Whether you are a student looking for your first internship, a recent
              graduate searching for entry-level positions, or a company seeking talented individuals,
              CareerConnect provides the tools and connections you need to succeed.
            </p>
            <p>
              Our platform features thousands of verified job listings across multiple industries including
              technology, design, marketing, finance, engineering, healthcare, and education. Each listing is
              reviewed by our team to ensure authenticity and quality, so you can apply with confidence.
            </p>
            <p>
              For students, CareerConnect offers a streamlined application process. Create your profile,
              showcase your skills and experience, upload your resume, and start applying to opportunities
              that match your qualifications. Track your applications in real-time, receive interview
              invitations, and get hired faster than ever before.
            </p>
            <p>
              For companies, CareerConnect provides a powerful hiring dashboard. Post job listings, review
              applications from qualified candidates, schedule interviews, and manage your entire recruitment
              pipeline from one centralized platform. Our smart matching algorithm helps you discover
              candidates who are the perfect fit for your open roles.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-surface-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Is CareerConnect free for students?', a: 'Yes, CareerConnect is completely free for students. You can create a profile, browse jobs, and apply to unlimited positions at no cost.' },
              { q: 'How do I apply for jobs on CareerConnect?', a: 'Simply create a student account, complete your profile with your skills and experience, upload your resume, and click "Apply Now" on any job listing that interests you.' },
              { q: 'Can companies post jobs for free?', a: 'Yes, companies can post job listings and browse candidate profiles at no cost. We believe in making hiring accessible for businesses of all sizes.' },
              { q: 'How does the matching algorithm work?', a: 'Our smart matching system analyzes your skills, experience level, location preferences, and career interests to suggest the most relevant job opportunities for you.' },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-surface-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
