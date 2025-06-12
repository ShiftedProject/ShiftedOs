import React, { useState } from 'react';
import Button from './Button';
import SelectInput from './SelectInput';

type InquiryType = 'media_partnership' | 'sponsorship' | 'event_collaboration' | 'other';

const PartnerPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('media_partnership');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const inquiryOptions: { value: InquiryType; label: string }[] = [
    { value: 'media_partnership', label: 'Media Partnership' },
    { value: 'sponsorship', label: 'Sponsorship Opportunity' },
    { value: 'event_collaboration', label: 'Event Collaboration' },
    { value: 'other', label: 'Other Inquiry' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName || !email || !inquiryType || !message) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    // Mock submission
    console.log({
      fullName,
      company,
      email,
      inquiryType,
      message,
    });

    setIsSubmitted(true);
    // Reset form fields
    setFullName('');
    setCompany('');
    setEmail('');
    setInquiryType('media_partnership');
    setMessage('');
  };

  // The main container for PartnerPage now assumes it might be part of a larger layout
  // (e.g., within LandingPage that has its own header/footer).
  // Background and overall page structure are handled by the parent (LandingPage).

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-3 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold text-main-accent mb-6">Thank You!</h1>
        <p className="text-text-primary text-lg sm:text-xl mb-8">
          Your inquiry has been received. We appreciate your interest in partnering with Shifted Project and will be in touch soon.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="primary" size="lg" className="bg-landing-primary-cta hover:opacity-90 text-white">
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <header className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-landing-text">
          Partner With <span className="text-landing-primary-cta">Shifted Project</span>
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary">
          Interested in media partnerships, sponsorships, or collaborations? We'd love to hear from you!
        </p>
      </header>

      {submitError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
          <p className="font-medium">Error</p>
          <p>{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-200/80">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-main-accent focus:border-main-accent transition-colors bg-white text-text-primary"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1">
            Company / Organization
          </label>
          <input
            type="text"
            name="company"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-main-accent focus:border-main-accent transition-colors bg-white text-text-primary"
            placeholder="Your Company (Optional)"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-main-accent focus:border-main-accent transition-colors bg-white text-text-primary"
            placeholder="you@example.com"
          />
        </div>
        
        <SelectInput
          label="Type of Inquiry *"
          name="inquiryType"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value as InquiryType)}
          options={inquiryOptions}
          required
          className="bg-white text-text-primary border-gray-300 focus:ring-main-accent focus:border-main-accent"
          containerClassName="text-text-secondary"
        />

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">
            Message / Proposal Details <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-main-accent focus:border-main-accent transition-colors bg-white text-text-primary"
            placeholder="Tell us about your proposal or inquiry..."
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full bg-landing-primary-cta hover:opacity-90 text-white">
          Send Inquiry
        </Button>
      </form>
    </div>
  );
};

export default PartnerPage;
