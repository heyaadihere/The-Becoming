import { Link } from 'react-router-dom';

const Logo = ({ className = "h-16" }) => (
  <img src="/images/logo-dark.png" alt="The Becoming" className={`${className} object-contain`} />
);

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="py-6 border-b border-sand">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link to="/"><Logo className="h-10" /></Link>
          <Link to="/" className="font-sans text-sm text-accent-gold hover:underline">Back to Home</Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl text-deep-charcoal mb-2">Cookie Policy</h1>
        <p className="font-sans text-accent-gold text-sm tracking-wider uppercase mb-10">The Becoming</p>

        <div className="space-y-8 font-sans text-charcoal/80 leading-relaxed">
          <p>This Cookie Policy explains how The Becoming uses cookies and similar technologies when you visit our website.</p>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">1. What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website function properly and provide information to the site owners.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">2. Cookies We Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function. These cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website to improve the user experience.</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings for a better experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">3. Managing Cookies</h2>
            <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of this website.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">4. Third-Party Cookies</h2>
            <p>We may use third-party services (such as analytics providers) that set their own cookies. We do not control these cookies. Please refer to the respective third-party privacy policies for more information.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">5. Updates</h2>
            <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page.</p>
          </section>

          <p className="border-t border-sand pt-6 text-sm text-charcoal/60 italic">
            Last updated: February 2026. For questions, contact enter@thebecoming.in.
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
