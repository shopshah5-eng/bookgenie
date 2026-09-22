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
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1612]">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1612] mb-3">
              We’re Here to Help
            </h1>
            <p className="text-sm text-[#6B635B]">
              Have a question about generation, technical support, or enterprise partnerships? Reach out to our editorial team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-2xl bg-white border border-[#EFECE6] text-center shadow-2xs">
              <Mail className="w-6 h-6 text-[#9A6F3C] mx-auto mb-2" />
              <h3 className="font-bold text-sm text-[#1A1612] mb-1">Email Support</h3>
              <p className="text-xs text-[#6B635B]">support@bookgenie.ai</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#EFECE6] text-center shadow-2xs">
              <MessageSquare className="w-6 h-6 text-[#9A6F3C] mx-auto mb-2" />
              <h3 className="font-bold text-sm text-[#1A1612] mb-1">Feedback</h3>
              <p className="text-xs text-[#6B635B]">feedback@bookgenie.ai</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#EFECE6] text-center shadow-2xs">
              <Clock className="w-6 h-6 text-[#9A6F3C] mx-auto mb-2" />
              <h3 className="font-bold text-sm text-[#1A1612] mb-1">Response Time</h3>
              <p className="text-xs text-[#6B635B]">Under 12 hours</p>
            </div>
          </div>

          <div className="max-w-xl mx-auto rounded-3xl bg-white border border-[#EFECE6] p-8 shadow-sm">
            {sent ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-serif font-bold text-[#1A1612] mb-1">
                  Message Sent
                </h3>
                <p className="text-xs text-[#6B635B]">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[#1A1612] mb-1.5">
                    Your Name
                  </label>
                  <Input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[#1A1612] mb-1.5">
                    Email Address
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#1A1612] mb-1.5">
                    How can we help?
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Describe your question or issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EFECE6] bg-[#FDFBF7] text-[#1A1612] focus:outline-none focus:border-[#9A6F3C] resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full font-semibold"
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
