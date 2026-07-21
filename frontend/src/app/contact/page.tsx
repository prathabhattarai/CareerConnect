'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
  HiOutlineClock, HiOutlineArrowRight, HiOutlineChatAlt2,
  HiOutlineQuestionMarkCircle, HiOutlineBriefcase,
} from 'react-icons/hi';

const contactInfo = [
  {
    icon: HiOutlineMail,
    title: 'Email Us',
    details: ['support@careerconnect.com', 'info@careerconnect.com'],
    description: 'We reply within 24 hours',
  },
  {
    icon: HiOutlinePhone,
    title: 'Call Us',
    details: ['+977-1-4567890', '+977-9801234567'],
    description: 'Sun-Fri, 9AM - 6PM NPT',
  },
  {
    icon: HiOutlineLocationMarker,
    title: 'Visit Us',
    details: ['Kathmandu, Nepal', 'New Baneshwor, Bagmati'],
    description: 'Headquarters',
  },
  {
    icon: HiOutlineClock,
    title: 'Working Hours',
    details: ['Sunday - Friday', '9:00 AM - 6:00 PM NPT'],
    description: 'Closed on Saturdays',
  },
];

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'Click the "Get Started" button and choose whether you want to register as a Student or Company. Fill in your details and you\'re ready to go.',
  },
  {
    question: 'Is CareerConnect free to use?',
    answer: 'Yes! CareerConnect is completely free for students. Companies can also post jobs and browse candidates at no cost.',
  },
  {
    question: 'How do I apply for jobs?',
    answer: 'Create a student account, complete your profile, upload your resume, and then browse jobs. Click "Apply Now" on any job listing to submit your application.',
  },
  {
    question: 'Can I edit my profile after signing up?',
    answer: 'Absolutely! You can update your profile, skills, resume, and other information at any time from your dashboard.',
  },
  {
    question: 'How do companies verify their accounts?',
    answer: 'Companies provide their business details during registration. Our team reviews and verifies each company to ensure authenticity.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-primary-100/80 leading-relaxed">
              Have questions, feedback, or need help? We&apos;re here to assist you. Reach out to our
              team and we&apos;ll respond as quickly as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info) => (
              <div key={info.title} className="card p-6 text-center">
                <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4 ring-1 ring-primary-100">
                  <info.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-surface-900 mb-1">{info.title}</h3>
                <p className="text-sm text-surface-600 mb-1">{info.details[0]}</p>
                {info.details[1] && <p className="text-sm text-surface-600">{info.details[1]}</p>}
                <p className="text-xs text-surface-400 mt-2">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-surface-900 mb-2">Send Us a Message</h2>
              <p className="text-surface-500 mb-8">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="textarea-field h-36"
                    placeholder="Tell us more about your question or feedback..."
                    required
                  />
                </div>
                <button type="submit" disabled={sending} className="btn-primary">
                  {sending ? 'Sending...' : (
                    <><HiOutlineArrowRight className="h-4 w-4" /> Send Message</>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-surface-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-surface-500 mb-8">Quick answers to common questions.</p>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="card p-5">
                    <div className="flex items-start gap-3">
                      <HiOutlineQuestionMarkCircle className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-surface-900 mb-1">{faq.question}</h3>
                        <p className="text-sm text-surface-600 leading-relaxed">{faq.answer}</p>
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
      <section className="py-16 bg-surface-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-14 w-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <HiOutlineChatAlt2 className="h-7 w-7 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 mb-3">Ready to Get Started?</h2>
          <p className="text-surface-600 mb-8 max-w-xl mx-auto">
            Join CareerConnect today and take the first step towards your dream career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="btn-primary">
              <HiOutlineBriefcase className="h-4 w-4" /> Create Account
            </a>
            <a href="/jobs" className="btn-secondary">
              Browse Jobs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
