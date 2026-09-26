'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to send message.');
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-surface dark:bg-[#0f1015] text-on-surface dark:text-[#f3f0f7] transition-colors">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="font-label-caps text-secondary dark:text-secondary-fixed text-xs tracking-widest uppercase mb-2 block">
              Direct Inquiries & Support
            </span>
            <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface dark:text-[#f3f0f7] mb-3">
              We’re Here to Help
            </h1>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant dark:text-[#c4c7c5]">
              Have a question about generation, technical support, or enterprise partnerships? Reach out to our atelier team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5 text-center shadow-xs">
              <Mail className="w-6 h-6 text-secondary dark:text-secondary-fixed mx-auto mb-2" />
              <h3 className="font-title-editorial font-bold text-sm text-on-surface dark:text-white mb-1">Email Support</h3>
              <p className="font-code-spec text-xs text-on-surface-variant dark:text-[#c4c7c5]">support@bookgenie.ai</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5 text-center shadow-xs">
              <MessageSquare className="w-6 h-6 text-secondary dark:text-secondary-fixed mx-auto mb-2" />
              <h3 className="font-title-editorial font-bold text-sm text-on-surface dark:text-white mb-1">Feedback</h3>
              <p className="font-code-spec text-xs text-on-surface-variant dark:text-[#c4c7c5]">feedback@bookgenie.ai</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5 text-center shadow-xs">
              <Clock className="w-6 h-6 text-secondary dark:text-secondary-fixed mx-auto mb-2" />
              <h3 className="font-title-editorial font-bold text-sm text-on-surface dark:text-white mb-1">Response Time</h3>
              <p className="font-code-spec text-xs text-on-surface-variant dark:text-[#c4c7c5]">Under 12 hours</p>
            </div>
          </div>

          <div className="max-w-xl mx-auto rounded-3xl bg-surface-container-low dark:bg-[#1a1b22] border border-outline-variant/20 dark:border-white/5 p-8 sm:p-10 shadow-lg">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="font-headline-sm text-xl text-on-surface dark:text-white mb-1">
                  Message Sent
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant dark:text-[#c4c7c5]">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </div>
                )}
                {/* Invisible honeypot for spam bots */}
                <input
                  type="text"
                  name="hp_field"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-on-surface dark:text-white mb-1.5 font-label-caps">
                    Your Name
                  </label>
                  <Input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-on-surface dark:text-white mb-1.5 font-label-caps">
                    Email Address
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-on-surface dark:text-white mb-1.5 font-label-caps">
                    How can we help?
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    aria-required="true"
                    placeholder="Describe your question or issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface dark:bg-[#121217] text-on-surface dark:text-[#f3f0f7] focus:outline-none focus:border-secondary dark:focus:border-secondary-fixed resize-none transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full font-semibold bg-primary hover:bg-primary-hover text-on-primary shadow-sm"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </main>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
