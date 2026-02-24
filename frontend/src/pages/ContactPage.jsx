import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo component
const Logo = ({ className = "h-16", variant = "dark" }) => (
  <img 
    src={variant === 'light' ? '/images/logo-white.png' : '/images/logo-dark.png'}
    alt="The Becoming" 
    className={`${className} object-contain`}
  />
);

// Subtle background animation for contact page
const ContactBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          right: "-10%", top: "10%",
          background: "radial-gradient(circle, rgba(184, 166, 126, 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          left: "-5%", bottom: "10%",
          background: "radial-gradient(circle, rgba(184, 166, 126, 0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
      {/* Subtle line accents */}
      <motion.div
        className="absolute w-[1px] h-40"
        style={{
          left: "20%", top: "20%",
          background: "linear-gradient(to bottom, transparent, rgba(184, 166, 126, 0.15), transparent)",
        }}
        animate={{ y: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-40 h-[1px]"
        style={{
          right: "15%", bottom: "30%",
          background: "linear-gradient(to right, transparent, rgba(184, 166, 126, 0.12), transparent)",
        }}
        animate={{ x: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.phone || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream" data-testid="contact-page">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(184, 166, 126, 0.3)' } }} />
      
      {/* Header */}
      <header className="py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <Logo className="h-20 md:h-24" variant="dark" />
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-charcoal hover:text-accent-gold transition-colors font-sans text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative overflow-hidden">
        <ContactBackground />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-stretch min-h-[600px]">
            
            {/* Left Side - Image & Info */}
            <motion.div 
              className="flex flex-col"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Image */}
              <div className="relative flex-1 min-h-[300px] lg:min-h-0 mb-8 lg:mb-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518173946687-a4c036bc3e77?w=800&q=80" 
                  alt="Serene nature" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cream/50 to-transparent" />
              </div>
              
              {/* Contact Info */}
              <div className="lg:absolute lg:bottom-0 lg:left-0 lg:right-0 p-8 bg-cream/90 backdrop-blur-sm">
                <h3 className="font-serif text-2xl text-deep-charcoal mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-gold/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">Email</p>
                      <p className="font-sans text-deep-charcoal">hello@thebecoming.in</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-gold/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-accent-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">Phone</p>
                      <p className="font-sans text-deep-charcoal">[Contact Number]</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-gold/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent-gold" />
                    </div>
                    <div>
                      <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">Location</p>
                      <p className="font-sans text-deep-charcoal">India</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div 
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-8">
                <p className="font-sans text-sm tracking-[0.3em] text-accent-gold uppercase mb-4">Contact Us</p>
                <h1 className="font-serif text-4xl md:text-5xl text-deep-charcoal mb-4">
                  We'd Love to<br />
                  <span className="text-accent-gold italic">Hear From You</span>
                </h1>
                <p className="font-sans text-charcoal/70 text-lg">
                  Have questions about The Becoming? Reach out and we'll get back to you soon.
                </p>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/50 border border-sand p-12 text-center"
                >
                  <div className="w-16 h-16 border-2 border-accent-gold rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-7 h-7 text-accent-gold" />
                  </div>
                  <h3 className="font-serif text-2xl text-deep-charcoal mb-3">Message Sent!</h3>
                  <p className="font-sans text-charcoal/70 mb-6">Thank you for reaching out. We'll be in touch soon.</p>
                  <button 
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                    className="text-accent-gold hover:text-accent-bronze transition-colors font-sans text-sm"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="font-sans text-xs text-charcoal/60 uppercase tracking-wider mb-2 block">Your Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full bg-white/50 border border-sand px-4 py-4 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans transition-colors"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="font-sans text-xs text-charcoal/60 uppercase tracking-wider mb-2 block">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="w-full bg-white/50 border border-sand px-4 py-4 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-charcoal/60 uppercase tracking-wider mb-2 block">Phone Number *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 00000 00000"
                        required
                        className="w-full bg-white/50 border border-sand px-4 py-4 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-sans text-xs text-charcoal/60 uppercase tracking-wider mb-2 block">Your Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      required
                      rows={5}
                      className="w-full bg-white/50 border border-sand px-4 py-4 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans resize-none transition-colors"
                    />
                  </div>
                  <motion.button 
                    type="submit" 
                    disabled={submitting}
                    className="btn-primary w-full py-5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              )}

              <p className="font-sans text-charcoal/50 text-sm mt-6">
                By submitting, you agree to our{' '}
                <a href="#" className="text-accent-gold hover:underline">Privacy Policy</a> and{' '}
                <a href="#" className="text-accent-gold hover:underline">Terms of Service</a>.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-12 border-t border-sand">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo className="h-12" variant="dark" />
          <p className="font-sans text-charcoal/50 text-sm">
            © {new Date().getFullYear()} The Becoming. All rights reserved. · 
            Powered by <a href="https://techbook.co.in/" target="_blank" rel="noopener noreferrer" className="text-accent-gold hover:underline">Techbook Technologies</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
