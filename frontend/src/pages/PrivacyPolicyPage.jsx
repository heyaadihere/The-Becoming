import { Link } from 'react-router-dom';

const Logo = ({ className = "h-16" }) => (
  <img src="/images/logo-dark.png" alt="The Becoming" className={`${className} object-contain`} />
);

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="py-6 border-b border-sand">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link to="/"><Logo className="h-10" /></Link>
          <Link to="/" className="font-sans text-sm text-accent-gold hover:underline">Back to Home</Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl text-deep-charcoal mb-2">Privacy Policy</h1>
        <p className="font-sans text-accent-gold text-sm tracking-wider uppercase mb-10">The Becoming</p>

        <div className="space-y-8 font-sans text-charcoal/80 leading-relaxed">
          <p>Your privacy matters to us. This Privacy Policy explains how The Becoming collects, uses, and protects your personal information when you interact with our website and services.</p>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">1. Information We Collect</h2>
            <p>We collect information you voluntarily provide through our questionnaire and contact forms, including: name, email address, phone number, social media handles, and responses to our questionnaire. We also collect standard usage data through cookies (see our Cookie Policy).</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and evaluate your application for The Becoming experience.</li>
              <li>To communicate with you about your application status and upcoming editions.</li>
              <li>To improve our services and website experience.</li>
              <li>To send you relevant updates about The Becoming (with your consent).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">3. Data Protection</h2>
            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored securely and access is restricted to authorized personnel only.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">4. Data Sharing</h2>
            <p>We do not sell, trade, or share your personal information with third parties for marketing purposes. Information may only be shared with service providers who assist in operating our website, subject to confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">5. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at enter@enteryourbecoming.com.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">6. Updates to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date.</p>
          </section>

          <p className="border-t border-sand pt-6 text-sm text-charcoal/60 italic">
            Last updated: February 2026. For questions, contact enter@enteryourbecoming.com.
          </p>
        </div>
      </main>

      <footer className="py-6 border-t border-sand">
        <div className="max-w-4xl mx-auto px-6 text-center font-sans text-charcoal/50 text-sm">
          © {new Date().getFullYear()} The Becoming. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
