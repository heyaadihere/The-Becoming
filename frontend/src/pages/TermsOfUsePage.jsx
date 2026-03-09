import { Link } from 'react-router-dom';

const Logo = ({ className = "h-16" }) => (
  <img src="/images/logo-dark.png" alt="The Becoming" className={`${className} object-contain`} />
);

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="py-6 border-b border-sand">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link to="/"><Logo className="h-10" /></Link>
          <Link to="/" className="font-sans text-sm text-accent-gold hover:underline">Back to Home</Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl text-deep-charcoal mb-2">Terms of Use</h1>
        <p className="font-sans text-accent-gold text-sm tracking-wider uppercase mb-10">The Becoming</p>

        <div className="space-y-8 font-sans text-charcoal/80 leading-relaxed">
          <p>By accessing and using The Becoming website and services, you agree to the following terms and conditions.</p>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">1. Acceptance of Terms</h2>
            <p>By using this website, you confirm that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree, please discontinue use of this website.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">2. Use of Website</h2>
            <p>This website is provided for informational purposes and to facilitate applications for The Becoming experience. You agree to use this website only for lawful purposes and in a manner that does not infringe upon the rights of others.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">3. Application Process</h2>
            <p>Submitting an application through our questionnaire does not guarantee selection. The Becoming reserves the right to accept or decline any application at its sole discretion based on readiness and fit.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">4. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and images, is the property of The Becoming and is protected by copyright laws. You may not reproduce, distribute, or use any content without prior written permission.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">5. Limitation of Liability</h2>
            <p>The Becoming is not liable for any direct, indirect, or consequential damages arising from the use of this website or participation in the experience, to the fullest extent permitted by law.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">6. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.</p>
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
