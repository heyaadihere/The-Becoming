import { Link } from 'react-router-dom';

const Logo = ({ className = "h-16" }) => (
  <img src="/images/logo-dark.png" alt="The Becoming" className={`${className} object-contain`} />
);

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="py-6 border-b border-sand">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link to="/"><Logo className="h-10" /></Link>
          <Link to="/" className="font-sans text-sm text-accent-gold hover:underline">Back to Home</Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <h1 className="font-serif text-3xl md:text-4xl text-deep-charcoal mb-2">Refund Policy</h1>
        <p className="font-sans text-accent-gold text-sm tracking-wider uppercase mb-10">The Becoming</p>

        <div className="space-y-8 font-sans text-charcoal/80 leading-relaxed">
          <p>
            At The Becoming, participation is intentionally limited to 21 individuals. Each seat is reserved with careful planning, personal attention, and curated resources. Once a spot is confirmed, it impacts the experience design for the entire group. Because of this structure, we maintain a strict refund policy.
          </p>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">1. Registration & Seat Confirmation</h2>
            <p>Your seat is confirmed only after full payment is received. Partial payments do not guarantee participation unless explicitly approved in writing by the team.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">2. Refund Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Before 7 days from the start date:</strong> If you request cancellation at least 7 days before the official start date, you are eligible for a 50% refund of the total fee.</li>
              <li><strong>Within 7 days of the start date:</strong> No refunds will be issued.</li>
              <li><strong>After the experience begins:</strong> No refunds will be issued under any circumstances.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">3. Transfer Policy</h2>
            <p>If you are unable to attend, you may request to transfer your seat to another individual. This is subject to approval by The Becoming team and must be requested at least 5 days before the start date.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">4. No-Show Policy</h2>
            <p>Failure to attend without prior written communication will result in forfeiture of the full amount paid.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">5. Exceptional Circumstances</h2>
            <p>In rare and genuine emergencies, requests may be reviewed at the sole discretion of The Becoming team. Approval is not guaranteed.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-deep-charcoal mb-3">6. Event Modifications</h2>
            <p>The Becoming reserves the right to reschedule, modify, or adjust the format if necessary due to unforeseen circumstances. In such cases, participants will be informed promptly. Refunds in such scenarios will be handled on a case-by-case basis.</p>
          </section>

          <p className="border-t border-sand pt-6 text-sm text-charcoal/60 italic">
            By completing your registration, you acknowledge that you have read and agreed to this Refund Policy.
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
