import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, ArrowRight, Check, Loader2, ChevronUp, Menu, X, Quote, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo component - soft sage green version for light theme
const Logo = ({ className = "h-12", dark = false }) => (
  <svg 
    viewBox="0 0 120 140" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Vertical line */}
    <line x1="35" y1="10" x2="35" y2="130" stroke={dark ? "#2d3748" : "currentColor"} strokeWidth="2"/>
    {/* Oval */}
    <ellipse cx="70" cy="85" rx="40" ry="45" stroke={dark ? "#2d3748" : "currentColor"} strokeWidth="2" fill="none"/>
    {/* Text "the" */}
    <text x="52" y="80" fill={dark ? "#2d3748" : "currentColor"} fontSize="14" fontFamily="serif">the</text>
    {/* Text "becoming" */}
    <text x="38" y="98" fill={dark ? "#2d3748" : "currentColor"} fontSize="14" fontFamily="serif">becoming</text>
  </svg>
);

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Soft, calming images
const images = {
  hero: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80",
  nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  peaceful: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80",
  meditation: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
  calm: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&q=80"
};

// Color classes for richer pastels
const colors = {
  sage: '#6b9080',
  sageLight: '#a4c3b2',
  sageLighter: '#cce3de',
  mint: '#eaf4f4',
  sky: '#84a9c0',
  skyLight: '#b8d4e3',
  lavender: '#a390bc',
  lavenderLight: '#d4c8e0',
  cream: '#f6f4f0',
};

// Section component with scroll animation
const AnimatedSection = ({ children, className = "", id = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ end, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Navigation Header
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#what-is-it' },
    { label: 'Experience', href: '#experience' },
    { label: 'For You?', href: '#who-its-for' },
    { label: 'Process', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ];

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-mint/95 backdrop-blur-lg border-b border-sage-light/30 shadow-sm' : 'bg-transparent'
        }`}
        data-testid="navigation"
      >
        <div className="content-container px-6 py-4 flex items-center justify-between">
          <a href="#" className="text-text-primary hover:text-sage transition-colors duration-300">
            <Logo className="h-10 w-auto" dark />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href)}
                className="text-sm text-text-secondary hover:text-sage transition-colors duration-300 animated-underline"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#signup')}
              className="btn-primary text-sm py-2 px-6"
              data-testid="nav-cta"
            >
              Begin Your Reset
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-text-primary p-2"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-mint/98 backdrop-blur-lg pt-20 md:hidden"
          >
            <nav className="flex flex-col items-center gap-6 p-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  className="text-xl text-text-primary hover:text-sage transition-colors duration-300"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('#signup')}
                className="btn-primary mt-4"
              >
                Begin Your Reset
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hero Section with new headline
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLearnMore = () => {
    document.getElementById('what-is-it')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sage-lighter"
    >
      <motion.div 
        style={{ y }}
        className="absolute inset-0"
      >
        <img 
          src={images.hero} 
          alt="" 
          className="w-full h-full object-cover scale-110 opacity-50"
        />
      </motion.div>
      <div className="absolute inset-0 hero-overlay" />
      
      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-6"
        >
          <Logo className="h-16 w-auto mx-auto text-text-primary" dark />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-mono text-sm tracking-[0.3em] text-sage mb-6 uppercase"
        >
          A Curated Human Experience
        </motion.p>
        
        {/* NEW MAIN HEADLINE */}
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl leading-tight text-text-primary mb-6"
        >
          Do you need a <em className="text-sage">reset</em>?
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-heading text-2xl sm:text-3xl text-text-secondary mb-8 italic"
        >
          The Becoming is an invitation to become <span className="text-sage">real</span> again.
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-base md:text-lg text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed font-body"
        >
          We live fast-paced, noisy, overworked, over-connected and deeply disconnected lives. 
          The Becoming exists for people who are functioning well on the outside, yet inside feel paused, 
          restless, or quietly lost.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            data-testid="hero-cta-primary"
            onClick={scrollToSignup}
            className="btn-primary text-base"
          >
            I'm Ready for a Reset
          </button>
          <button 
            data-testid="hero-cta-secondary"
            onClick={scrollToLearnMore}
            className="btn-secondary text-base flex items-center gap-2"
          >
            <span>Learn more</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-sage animate-bounce" />
      </motion.div>
    </section>
  );
};

// Stats Section - removed psychologists, updated text
const StatsSection = () => {
  const stats = [
    { value: 20, suffix: '', label: 'Curated Seats' },
    { value: 4, suffix: '', label: 'Days of Immersion' },
    { value: 100, suffix: '%', label: 'Intentional Focus' },
  ];

  return (
    <div className="py-16 bg-sage-light/40 border-y border-sage/20">
      <div className="content-container px-6">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="font-heading text-4xl lg:text-5xl text-sage mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// What Is It Section - removed therapy mentions
const WhatIsItSection = () => {
  return (
    <AnimatedSection id="what-is-it" className="section-spacing bg-mint">
      <div className="content-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sage uppercase mb-4">
              The Essence
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-8">
              What is <em className="text-sage">The Becoming</em>?
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-base text-text-secondary leading-relaxed mb-6">
              The Becoming is a curated human experience for people who are doing what life expects of them,
              yet feel there must be more meaning, more depth, more truth to who they are.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="space-y-3 mb-8">
              <p className="text-text-primary font-body">It is <span className="text-sage font-medium">not</span> a retreat.</p>
              <p className="text-text-primary font-body">It is <span className="text-sage font-medium">not</span> a workshop.</p>
              <p className="text-text-primary font-body">It is <span className="text-sage font-medium">not</span> a lecture.</p>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-base text-text-secondary leading-relaxed mb-8">
              No one can teach you how to live. Nobody is here to fix you.
              Instead, The Becoming creates a safe, intentional space where you step away from routines, 
              screens and constant performance, and turn inward.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="becoming-card bg-sage-lighter/60">
              <p className="font-heading text-xl text-text-primary italic">
                "No promises. No fixing. No preaching. No selling. Only experiences."
              </p>
            </motion.div>
          </div>
          
          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute -inset-4 bg-sage/10 rounded-3xl blur-3xl" />
            <img 
              src={images.peaceful}
              alt="Peaceful nature representing inner exploration"
              className="relative rounded-2xl w-full aspect-[4/5] object-cover shadow-xl"
            />
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Experience Section
const ExperienceSection = () => {
  const experiences = [
    { title: "Nature & Stillness", description: "Reconnect with the natural world and find peace in silence", color: "bg-sage-lighter" },
    { title: "Mindful Movement", description: "Listen to your body and move with intention", color: "bg-sky-light" },
    { title: "Reflection & Creativity", description: "Express what words cannot capture", color: "bg-lavender-light" },
    { title: "Writing & Music", description: "Explore the landscapes of your inner world", color: "bg-sage-lighter" },
    { title: "Storytelling & Connection", description: "Share and listen to honest human stories", color: "bg-sky-light" }
  ];

  return (
    <AnimatedSection id="experience" className="section-spacing bg-cream">
      <div className="content-container">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sage uppercase mb-4">
          The Journey
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-6">
          What You Will <em className="text-sage">Experience</em>
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-base text-text-secondary max-w-2xl mb-16">
          At The Becoming, you are invited to experience life beyond autopilot.
        </motion.p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`becoming-card group cursor-pointer ${exp.color}`}
              data-testid={`experience-card-${index}`}
            >
              <div className="w-3 h-3 rounded-full bg-sage mb-6 group-hover:scale-150 transition-transform duration-500" />
              <h3 className="font-heading text-xl text-text-primary mb-3">{exp.title}</h3>
              <p className="text-sm text-text-secondary">{exp.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={fadeInUp} className="mt-16 max-w-3xl">
          <p className="text-base text-text-secondary leading-relaxed">
            Participants begin to listen inward and not outward. They listen to who they were, how they grew up, 
            and who they are right now. They reconnect with their inner voice and rediscover parts of 
            themselves they might have ignored or never known.
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "I came thinking I needed answers. I left understanding that I am the answer I've been searching for.",
      author: "Priya S.",
      role: "Corporate Executive",
    },
    {
      quote: "For the first time in decades, I felt permission to just be. Not perform. Not achieve. Just exist.",
      author: "Rahul M.",
      role: "Entrepreneur",
    },
    {
      quote: "The Becoming didn't fix me. It helped me realize I was never broken. Just buried.",
      author: "Ananya K.",
      role: "Artist & Mother",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="section-spacing bg-lavender-light/50 relative overflow-hidden">
      <div className="content-container relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-[0.3em] text-lavender uppercase mb-4 text-center"
        >
          Voices From Within
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-16 text-center"
        >
          What They <em className="text-lavender">Discovered</em>
        </motion.h2>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Quote className="w-12 h-12 text-lavender mx-auto mb-8" />
              <p className="font-heading text-2xl lg:text-3xl text-text-primary italic mb-8 leading-relaxed">
                "{testimonials[activeIndex].quote}"
              </p>
              <p className="text-sage font-medium">{testimonials[activeIndex].author}</p>
              <p className="text-sm text-text-muted">{testimonials[activeIndex].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-lavender w-8' : 'bg-lavender/30 hover:bg-lavender/50'
                }`}
                data-testid={`testimonial-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Who It's For Section
const WhoItsForSection = () => {
  const audiences = [
    "Working professionals",
    "Creators and curators",
    "Artists",
    "Homemakers",
    "And maybe you"
  ];

  const signs = [
    "You're functioning well on the outside, but feel quietly tired or lost inside.",
    "You've been chasing meaning, and suspect meaning has been chasing you.",
    "You feel there must be more depth and truth to who you are."
  ];

  return (
    <AnimatedSection id="who-its-for" className="section-spacing bg-sage-lighter/50 relative overflow-hidden">
      <div className="content-container relative z-10">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sage uppercase mb-4">
          Is This For You?
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-12">
          Who is The Becoming <em className="text-sage">For</em>?
        </motion.h2>
        
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <motion.p variants={fadeInUp} className="text-base text-text-primary mb-8">
              The Becoming is designed for:
            </motion.p>
            
            <motion.ul variants={staggerContainer} className="space-y-4 mb-12">
              {audiences.map((item, index) => (
                <motion.li 
                  key={index} 
                  variants={fadeInUp}
                  className="flex items-center gap-4 text-text-secondary"
                >
                  <span className="w-2 h-2 rounded-full bg-sage" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.p variants={fadeInUp} className="text-sm text-text-muted">
              Generally, we do not want to put an age bracket to this, but anyone from 21 to 65 can be a part of it.
              It's not about the number or the profession – it's about readiness.
            </motion.p>
          </div>
          
          <div>
            <motion.p variants={fadeInUp} className="text-base text-text-primary mb-8">
              It may be for you if:
            </motion.p>
            
            <motion.ul variants={staggerContainer} className="space-y-6">
              {signs.map((sign, index) => (
                <motion.li 
                  key={index} 
                  variants={fadeInUp}
                  whileHover={{ x: 8, transition: { duration: 0.3 } }}
                  className="becoming-card bg-white/80 cursor-pointer"
                >
                  <p className="text-text-primary font-heading italic">{sign}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// The Circle Section
const CircleSection = () => {
  return (
    <AnimatedSection id="circle" className="section-spacing bg-sky-light/40">
      <div className="content-container text-center max-w-3xl mx-auto">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sky uppercase mb-4">
          Beyond The Experience
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-8">
          Not Just an Experience. <em className="text-sky">A Circle.</em>
        </motion.h2>
        
        <motion.p variants={fadeInUp} className="text-base text-text-secondary leading-relaxed mb-12">
          Beyond the experience itself, The Becoming is the foundation of something larger – 
          a community of like‑minded individuals who value depth over speed, presence over performance, 
          and humanity over hustle.
        </motion.p>
        
        <motion.div variants={staggerContainer} className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            "Stay in constant touch with you even after the experience is over.",
            "Remind you of what matters, when life gets noisy again.",
            "Offer a circle that continues long after the experience is done."
          ].map((item, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="becoming-card text-left bg-white/80"
            >
              <div className="w-8 h-8 rounded-full border-2 border-sky/50 flex items-center justify-center mb-4">
                <span className="text-sky text-sm font-medium">{index + 1}</span>
              </div>
              <p className="text-sm text-text-secondary">{item}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div variants={fadeInUp} className="space-y-2">
          <p className="font-heading text-2xl text-text-primary italic">It's not for now.</p>
          <p className="font-heading text-2xl text-text-primary italic">It's for <span className="text-sage">now</span> and <span className="text-sky">then</span></p>
          <p className="font-heading text-2xl text-text-primary italic">and <span className="text-lavender">again</span>.</p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Pilot Batch Section - updated to remove psychologists mention
const PilotBatchSection = () => {
  return (
    <AnimatedSection id="pilot" className="section-spacing bg-mint">
      <div className="content-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp} className="relative order-2 lg:order-1">
            <img 
              src={images.calm}
              alt="Calm setting representing inner peace"
              className="rounded-2xl w-full aspect-video object-cover shadow-xl"
            />
          </motion.div>
          
          <div className="order-1 lg:order-2">
            <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sage uppercase mb-4">
              Limited Seats
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-8">
              The First Becoming: <em className="text-sage">Pilot Batch</em>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-base text-text-secondary leading-relaxed mb-8">
              The first experience of The Becoming will be a pilot batch of just 20 people.
              This allows us to offer more care, more nurture, and a deeply held space.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="space-y-4">
              {[
                { label: "Batch size", value: "20 participants only" },
                { label: "Audience", value: "Ready working professionals, creators, curators, artists, homemakers (21–65)" },
                { label: "Curated by", value: "Mitin and a dedicated support team focused on your emotional wellness" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  className="flex items-start gap-4"
                >
                  <Check className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-text-primary font-medium">{item.label}:</span>
                    <span className="text-text-secondary ml-2">{item.value}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// How It Works Section - updated language
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Sign up your interest",
      description: "Leave your name, email, and (optionally) your phone number."
    },
    {
      number: "02",
      title: "Answer a few guided questions",
      description: "Simple reflective questions to understand who you are, where you stand in life, and why you feel you need this reset."
    },
    {
      number: "03",
      title: "We review for readiness",
      description: "The Becoming is not for everyone. Our team reviews responses to see who is genuinely ready for this experience."
    },
    {
      number: "04",
      title: "If it's a match, we reach out",
      description: "If we feel The Becoming is right for you at this moment, we will contact you personally with next steps."
    }
  ];

  return (
    <AnimatedSection id="how-it-works" className="section-spacing bg-pale-mint">
      <div className="content-container">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-soft-sage uppercase mb-4">
          The Process
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-16">
          How It <em className="text-soft-sage">Works</em>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative"
              data-testid={`step-${index + 1}`}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-pastel-green/30" />
              )}
              <div className="becoming-card h-full bg-white">
                <span className="font-mono text-3xl text-pastel-green mb-4 block">{step.number}</span>
                <h3 className="font-heading text-xl text-text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// FAQ Section - updated to remove therapy mentions
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How is The Becoming different from a retreat or workshop?",
      answer: "The Becoming is not designed to teach, preach, or fix. Unlike retreats focused on wellness activities or workshops with learning outcomes, we create an intentional space for you to simply be. There's no agenda to follow, no skills to acquire—just an invitation to turn inward and reconnect with yourself."
    },
    {
      question: "What happens during the 4 days?",
      answer: "Each day unfolds organically through nature walks, stillness practices, creative expression, music, storytelling circles, and deep human connection. There are no rigid schedules—only invitations. Our support team is present throughout to hold space safely."
    },
    {
      question: "Do I need to have any specific issues or problems to attend?",
      answer: "Not at all. The Becoming isn't for people who are broken. It's for people who are functioning fine but feel there's something more. If you're on autopilot, feeling quietly lost, or simply curious about what lies beneath the surface of your everyday life—you're ready."
    },
    {
      question: "Why is there a screening process?",
      answer: "The Becoming requires a certain readiness. Our team reviews applications to ensure participants are in a stable place to engage with introspection. It's not about qualification—it's about timing and genuine resonance with what we offer."
    },
    {
      question: "What do I need to bring?",
      answer: "Just yourself. We ask that you leave your work, devices, and everyday identities behind. Come as you are—not as a CEO, mother, professional, or any role. We'll provide everything else you need for the experience."
    },
    {
      question: "What happens after The Becoming ends?",
      answer: "You join The Circle—a continuing community of like-minded individuals. We stay in touch, offer periodic gatherings, and remind you of what matters when life gets noisy again. The Becoming is not a one-time event; it's the beginning of a longer journey."
    }
  ];

  return (
    <AnimatedSection id="faq" className="section-spacing bg-cream">
      <div className="content-container max-w-3xl mx-auto">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-soft-sage uppercase mb-4 text-center">
          Questions
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-12 text-center">
          Frequently <em className="text-soft-sage">Asked</em>
        </motion.h2>

        <motion.div variants={staggerContainer} className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="becoming-card overflow-hidden bg-white"
              data-testid={`faq-${index}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left py-2"
              >
                <span className="font-heading text-lg text-text-primary pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-soft-sage flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-soft-sage flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-text-secondary pt-4 pb-2 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Sign Up Form Section
const SignUpSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    why_becoming: '',
    current_state: '',
    what_seeking: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/signup`, formData);
      setIsSubmitted(true);
      toast.success('Your submission has been received. We will be in touch.');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AnimatedSection id="signup" className="section-spacing bg-pastel-green-light/30">
        <div className="content-container max-w-2xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="becoming-card py-16 bg-white">
            <div className="w-16 h-16 rounded-full bg-pastel-green/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-soft-sage" />
            </div>
            <h2 className="font-heading text-3xl text-text-primary mb-4">Thank You</h2>
            <p className="text-text-secondary">
              Your responses are being read with care by our team.
              We will reach out if The Becoming feels right for you.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection id="signup" className="section-spacing bg-pastel-green-light/30">
      <div className="content-container max-w-2xl mx-auto">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-soft-sage uppercase mb-4 text-center">
          Begin Your Journey
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4 text-center">
          Ready for Your <em className="text-soft-sage">Reset</em>?
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-base text-text-secondary mb-12 text-center">
          If this resonates with you, if you feel quietly ready, take a moment and tell us who you are.
        </motion.p>
        
        <motion.form 
          variants={staggerContainer}
          onSubmit={handleSubmit}
          className="space-y-8 becoming-card bg-white"
          data-testid="signup-form"
        >
          <motion.div variants={fadeInUp}>
            <label className="block text-sm text-text-muted mb-2">Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="becoming-input"
              placeholder="How should we call you?"
              data-testid="input-name"
            />
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <label className="block text-sm text-text-muted mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="becoming-input"
              placeholder="your@email.com"
              data-testid="input-email"
            />
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <label className="block text-sm text-text-muted mb-2">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="becoming-input"
              placeholder="+91 ..."
              data-testid="input-phone"
            />
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <label className="block text-sm text-text-muted mb-2">Why do you feel you need this reset? *</label>
            <textarea
              name="why_becoming"
              value={formData.why_becoming}
              onChange={handleChange}
              required
              className="becoming-textarea"
              placeholder="Take your time with this..."
              rows={4}
              data-testid="input-why"
            />
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <label className="block text-sm text-text-muted mb-2">Where do you stand in life right now? *</label>
            <textarea
              name="current_state"
              value={formData.current_state}
              onChange={handleChange}
              required
              className="becoming-textarea"
              placeholder="What does your day-to-day look like? How are you really feeling?"
              rows={4}
              data-testid="input-state"
            />
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <label className="block text-sm text-text-muted mb-2">What clarity are you seeking? *</label>
            <textarea
              name="what_seeking"
              value={formData.what_seeking}
              onChange={handleChange}
              required
              className="becoming-textarea"
              placeholder="What would 'becoming real' mean for you?"
              rows={4}
              data-testid="input-seeking"
            />
          </motion.div>
          
          <motion.div variants={fadeInUp} className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
              data-testid="submit-button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Begin My Reset</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-xs text-text-muted text-center mt-4">
              Your responses are read with care by our team.
            </p>
          </motion.div>
        </motion.form>
      </div>
    </AnimatedSection>
  );
};

// Founder's Note Section
const FounderSection = () => {
  return (
    <AnimatedSection id="founder" className="section-spacing bg-cream">
      <div className="content-container max-w-4xl mx-auto">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-soft-sage uppercase mb-4 text-center">
          A Personal Note
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-12 text-center">
          From <em className="text-soft-sage">Mitin</em>
        </motion.h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp}>
            <blockquote className="text-base text-text-secondary leading-relaxed space-y-4">
              <p>
                "For over 20 years, you've seen me as a professional host. I've been on stage, 
                on television, and in rooms full of people.
              </p>
              <p>
                Over time, I realised that while the world asked us to perform more, 
                what many of us really needed was a space to become more real.
              </p>
              <p>
                The Becoming is my attempt to curate that space – not as a teacher, not as a guide, 
                but as a fellow human who knows what it feels like to be on autopilot."
              </p>
            </blockquote>
            <p className="mt-8 font-heading text-xl text-soft-sage italic">— Mitin</p>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <div className="video-placeholder group" data-testid="video-placeholder">
              <div className="play-button group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-soft-sage ml-1" />
              </div>
            </div>
            <p className="text-xs text-text-muted text-center mt-4">
              Watch: Why I Created The Becoming
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Back to Top Button
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-soft-sage text-white flex items-center justify-center shadow-lg hover:bg-soft-sage/80 transition-colors duration-300 z-50"
          data-testid="back-to-top"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Footer
const Footer = () => {
  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="py-16 bg-off-white border-t border-pastel-green/20">
      <div className="content-container px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo and tagline */}
          <div>
            <Logo className="h-16 w-auto text-text-primary" dark />
            <p className="text-sm text-text-muted mt-4">A curated human experience for those ready for a reset.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-text-primary mb-4">Explore</h4>
            <nav className="space-y-3">
              {[
                { label: 'About', href: '#what-is-it' },
                { label: 'Experience', href: '#experience' },
                { label: 'Who It\'s For', href: '#who-its-for' },
                { label: 'Process', href: '#how-it-works' },
                { label: 'FAQ', href: '#faq' },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block text-sm text-text-secondary hover:text-soft-sage transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg text-text-primary mb-4">Connect</h4>
            <p className="text-sm text-text-secondary mb-4">
              Have questions? Reach out to us.
            </p>
            <a 
              href="mailto:hello@thebecoming.in" 
              className="text-soft-sage hover:text-soft-sage/70 transition-colors duration-300"
            >
              hello@thebecoming.in
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-pastel-green/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} The Becoming. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
        
        <div className="pt-6 text-center">
          <p className="text-xs text-text-muted">
            Website powered by{' '}
            <a 
              href="https://techbook.co.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-soft-sage hover:text-soft-sage/70 transition-colors duration-300"
            >
              Techbook Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream" data-testid="landing-page">
      <div className="grain-overlay" />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#2d3748',
            border: '1px solid rgba(168, 213, 186, 0.3)'
          }
        }}
      />
      <Navigation />
      <HeroSection />
      <StatsSection />
      <WhatIsItSection />
      <ExperienceSection />
      <TestimonialsSection />
      <WhoItsForSection />
      <CircleSection />
      <PilotBatchSection />
      <HowItWorksSection />
      <FAQSection />
      <SignUpSection />
      <FounderSection />
      <Footer />
      <BackToTop />
    </div>
  );
}
