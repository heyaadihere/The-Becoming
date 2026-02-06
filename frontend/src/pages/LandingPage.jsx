import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, Play, ArrowRight, Check, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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

// Images from design guidelines
const images = {
  foggyForest: "https://images.unsplash.com/photo-1601307426703-20d19577e455?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwyfHxmb2dneSUyMGZvcmVzdCUyMG1vcm5pbmd8ZW58MHx8fHwxNzcwMzQ4NjM2fDA&ixlib=rb-4.1.0&q=85",
  abstractShadow: "https://images.unsplash.com/photo-1758239652104-2ece77db996b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGxpZ2h0JTIwc2hhZG93JTIwdGV4dHVyZXxlbnwwfHx8fDE3NzAzNDg2NDJ8MA&ixlib=rb-4.1.0&q=85",
  silhouetteView: "https://images.unsplash.com/photo-1767238270052-c7c3540dcd3d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzaWxob3VldHRlJTIwbG9va2luZyUyMGF0JTIwdmlld3xlbnwwfHx8fDE3NzAzNDg2NDZ8MA&ixlib=rb-4.1.0&q=85",
  calmWater: "https://images.unsplash.com/photo-1763389141084-67e33aef1f6f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxwZXJzb24lMjBzaWxob3VldHRlJTIwbG9va2luZyUyMGF0JTIwdmlld3xlbnwwfHx8fDE3NzAzNDg2NDZ8MA&ixlib=rb-4.1.0&q=85"
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

// Hero Section
const HeroSection = () => {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLearnMore = () => {
    document.getElementById('what-is-it')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      data-testid="hero-section"
      className="relative min-h-screen flex items-center justify-center hero-bg"
      style={{ backgroundImage: `url(${images.foggyForest})` }}
    >
      <div className="absolute inset-0 hero-overlay" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-mono text-sm tracking-[0.3em] text-sand mb-8 uppercase"
        >
          A Curated Human Experience
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#e5e5e5] mb-8"
        >
          In a world that's constantly asking you to become <em className="text-sand">more</em>,
          <br />
          <span className="mt-4 block">The Becoming is an invitation to become <em className="text-sand">real</em> again.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base md:text-lg text-[#a3a3a3] max-w-2xl mx-auto mb-12 leading-relaxed font-body"
        >
          We live fast-paced, noisy, overworked, over-connected and deeply disconnected lives. 
          There is no me time. We get stuck in the mundane, become purposeless, but we keep going on autopilot. 
          The Becoming exists for people who are functioning well on the outside, yet inside feel paused, restless, 
          tired, quietly losing or quietly lost.
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
            I Want The Becoming
          </button>
          <button 
            data-testid="hero-cta-secondary"
            onClick={scrollToLearnMore}
            className="btn-secondary text-base flex items-center gap-2"
          >
            <span>Scroll to learn more</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-[#525252] animate-bounce" />
      </motion.div>
    </section>
  );
};

// What Is It Section
const WhatIsItSection = () => {
  return (
    <AnimatedSection id="what-is-it" className="section-spacing bg-void">
      <div className="content-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sand uppercase mb-4">
              The Essence
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#e5e5e5] mb-8">
              What is <em>The Becoming</em>?
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-base text-[#a3a3a3] leading-relaxed mb-6">
              The Becoming is a curated human experience for people who are doing what life expects of them,
              yet feel there must be more meaning, more depth, more truth to who they are.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="space-y-3 mb-8">
              <p className="text-[#e5e5e5] font-body">It is <span className="text-sand">not</span> a retreat.</p>
              <p className="text-[#e5e5e5] font-body">It is <span className="text-sand">not</span> a workshop.</p>
              <p className="text-[#e5e5e5] font-body">It is <span className="text-sand">not</span> therapy.</p>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-base text-[#a3a3a3] leading-relaxed mb-8">
              No one can teach you how to live. Nobody is here to fix you.
              Instead, The Becoming creates a safe, intentional space where you step away from routines, 
              mundane lives, screens and constant performance, and turn inward.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="becoming-card">
              <p className="font-heading text-xl text-[#e5e5e5] italic">
                "No promises. No fixing. No preaching. No selling. Only experiences."
              </p>
            </motion.div>
          </div>
          
          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute -inset-4 bg-sand/5 rounded-2xl blur-3xl" />
            <img 
              src={images.abstractShadow}
              alt="Abstract shadows representing inner exploration"
              className="relative rounded-xl w-full aspect-[4/5] object-cover"
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
    { title: "Nature & Stillness", description: "Reconnect with the natural world and find peace in silence" },
    { title: "Mindful Movement", description: "Listen to your body and move with intention" },
    { title: "Reflection & Creativity", description: "Express what words cannot capture" },
    { title: "Writing & Music", description: "Explore the landscapes of your inner world" },
    { title: "Storytelling & Connection", description: "Share and listen to honest human stories" }
  ];

  return (
    <AnimatedSection id="experience" className="section-spacing bg-ash">
      <div className="content-container">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sand uppercase mb-4">
          The Journey
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#e5e5e5] mb-6">
          What You Will <em>Experience</em>
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-base text-[#a3a3a3] max-w-2xl mb-16">
          At The Becoming, you are invited to experience life beyond autopilot.
        </motion.p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="becoming-card group"
              data-testid={`experience-card-${index}`}
            >
              <div className="w-2 h-2 rounded-full bg-sand mb-6 group-hover:scale-150 transition-transform duration-500" />
              <h3 className="font-heading text-xl text-[#e5e5e5] mb-3">{exp.title}</h3>
              <p className="text-sm text-[#a3a3a3]">{exp.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={fadeInUp} className="mt-16 max-w-3xl">
          <p className="text-base text-[#a3a3a3] leading-relaxed">
            Participants begin to listen inward and not outward. They listen to who they were, how they grew up, 
            and who they are right now. They remove the baggage of being a father, CEO, mother, wife, husband, 
            director – and return to themselves. They reconnect with their inner voice and rediscover parts of 
            themselves they might have ignored or never known.
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
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
    <AnimatedSection id="who-its-for" className="section-spacing bg-void relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-20">
        <img 
          src={images.silhouetteView}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void to-transparent" />
      </div>
      
      <div className="content-container relative z-10">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sand uppercase mb-4">
          Is This For You?
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#e5e5e5] mb-12">
          Who is The Becoming <em>For</em>?
        </motion.h2>
        
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <motion.p variants={fadeInUp} className="text-base text-[#e5e5e5] mb-8">
              The Becoming is designed for:
            </motion.p>
            
            <motion.ul variants={staggerContainer} className="space-y-4 mb-12">
              {audiences.map((item, index) => (
                <motion.li 
                  key={index} 
                  variants={fadeInUp}
                  className="flex items-center gap-4 text-[#a3a3a3]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sand" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.p variants={fadeInUp} className="text-sm text-[#525252]">
              Generally, we do not want to put an age bracket to this, but anyone from 21 to 65 can be a part of it.
              It's not about the number or the profession – it's about readiness.
            </motion.p>
          </div>
          
          <div>
            <motion.p variants={fadeInUp} className="text-base text-[#e5e5e5] mb-8">
              It may be for you if:
            </motion.p>
            
            <motion.ul variants={staggerContainer} className="space-y-6">
              {signs.map((sign, index) => (
                <motion.li 
                  key={index} 
                  variants={fadeInUp}
                  className="becoming-card"
                >
                  <p className="text-[#e5e5e5] font-heading italic">{sign}</p>
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
    <AnimatedSection id="circle" className="section-spacing bg-ash">
      <div className="content-container text-center max-w-3xl mx-auto">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sand uppercase mb-4">
          Beyond The Experience
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#e5e5e5] mb-8">
          Not Just an Experience. <em>A Circle.</em>
        </motion.h2>
        
        <motion.p variants={fadeInUp} className="text-base text-[#a3a3a3] leading-relaxed mb-12">
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
              className="becoming-card text-left"
            >
              <div className="w-8 h-8 rounded-full border border-sand/30 flex items-center justify-center mb-4">
                <span className="text-sand text-sm">{index + 1}</span>
              </div>
              <p className="text-sm text-[#a3a3a3]">{item}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div variants={fadeInUp} className="space-y-2">
          <p className="font-heading text-2xl text-[#e5e5e5] italic">It's not for now.</p>
          <p className="font-heading text-2xl text-[#e5e5e5] italic">It's for <span className="text-sand">now</span> and <span className="text-sand">then</span></p>
          <p className="font-heading text-2xl text-[#e5e5e5] italic">and <span className="text-sand">again</span>.</p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

// Pilot Batch Section
const PilotBatchSection = () => {
  return (
    <AnimatedSection id="pilot" className="section-spacing bg-void">
      <div className="content-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp} className="relative order-2 lg:order-1">
            <img 
              src={images.calmWater}
              alt="Calm waters representing inner peace"
              className="rounded-xl w-full aspect-video object-cover"
            />
          </motion.div>
          
          <div className="order-1 lg:order-2">
            <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sand uppercase mb-4">
              Limited Seats
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#e5e5e5] mb-8">
              The First Becoming: <em>Pilot Batch</em>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-base text-[#a3a3a3] leading-relaxed mb-8">
              The first experience of The Becoming will be a pilot batch of just 20 people.
              This allows us to offer more care, more nurture, and a deeply held space.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="space-y-4">
              {[
                { label: "Batch size", value: "20 participants only" },
                { label: "Audience", value: "Ready working professionals, creators, curators, artists, homemakers (21–65)" },
                { label: "Curated by", value: "Mitin and a core team, including two full‑time psychologists" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  className="flex items-start gap-4"
                >
                  <Check className="w-5 h-5 text-sand mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#e5e5e5] font-medium">{item.label}:</span>
                    <span className="text-[#a3a3a3] ml-2">{item.value}</span>
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

// How It Works Section
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
      description: "Our in‑house psychologists have designed simple archetype and reflective questions to understand who you are, where you stand in life, and why you feel you need The Becoming."
    },
    {
      number: "03",
      title: "We review for readiness",
      description: "The Becoming is not for everyone. Our psychologists and core team review responses to see who is genuinely ready for this experience."
    },
    {
      number: "04",
      title: "If it's a match, we reach out",
      description: "If we feel The Becoming is right for you at this moment, we will contact you personally with next steps."
    }
  ];

  return (
    <AnimatedSection id="how-it-works" className="section-spacing bg-ash">
      <div className="content-container">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sand uppercase mb-4">
          The Process
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#e5e5e5] mb-16">
          How It <em>Works</em>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={fadeInUp}
              className="relative"
              data-testid={`step-${index + 1}`}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-white/10" />
              )}
              <div className="becoming-card h-full">
                <span className="font-mono text-3xl text-sand/30 mb-4 block">{step.number}</span>
                <h3 className="font-heading text-xl text-[#e5e5e5] mb-3">{step.title}</h3>
                <p className="text-sm text-[#a3a3a3]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
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
      <AnimatedSection id="signup" className="section-spacing bg-void">
        <div className="content-container max-w-2xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="becoming-card py-16">
            <div className="w-16 h-16 rounded-full bg-sand/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-sand" />
            </div>
            <h2 className="font-heading text-3xl text-[#e5e5e5] mb-4">Thank You</h2>
            <p className="text-[#a3a3a3]">
              Your responses are being read with care by our core team and in‑house psychologists.
              We will reach out if The Becoming feels right for you.
            </p>
          </motion.div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection id="signup" className="section-spacing bg-void">
      <div className="content-container max-w-2xl mx-auto">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sand uppercase mb-4 text-center">
          Begin Your Journey
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#e5e5e5] mb-4 text-center">
          I Want <em>The Becoming</em>
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-base text-[#a3a3a3] mb-12 text-center">
          If this resonates with you, if you feel quietly ready, take a moment and tell us who you are.
        </motion.p>
        
        <motion.form 
          variants={staggerContainer}
          onSubmit={handleSubmit}
          className="space-y-8"
          data-testid="signup-form"
        >
          <motion.div variants={fadeInUp}>
            <label className="block text-sm text-[#a3a3a3] mb-2">Your Name *</label>
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
            <label className="block text-sm text-[#a3a3a3] mb-2">Email Address *</label>
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
            <label className="block text-sm text-[#a3a3a3] mb-2">Phone Number (Optional)</label>
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
            <label className="block text-sm text-[#a3a3a3] mb-2">Why do you feel you need The Becoming? *</label>
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
            <label className="block text-sm text-[#a3a3a3] mb-2">Where do you stand in life right now? *</label>
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
            <label className="block text-sm text-[#a3a3a3] mb-2">What are you seeking? *</label>
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
                  <span>Begin My Becoming</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-xs text-[#525252] text-center mt-4">
              Your responses are read with care by our core team and in‑house psychologists.
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
    <AnimatedSection id="founder" className="section-spacing bg-ash">
      <div className="content-container max-w-4xl mx-auto">
        <motion.p variants={fadeInUp} className="font-mono text-xs tracking-[0.3em] text-sand uppercase mb-4 text-center">
          A Personal Note
        </motion.p>
        <motion.h2 variants={fadeInUp} className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#e5e5e5] mb-12 text-center">
          From <em>Mitin</em>
        </motion.h2>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp}>
            <blockquote className="text-base text-[#a3a3a3] leading-relaxed space-y-4">
              <p>
                "For over 20 years, you've seen me as a professional host. I've been on stage, 
                on television, and in rooms full of people.
              </p>
              <p>
                Over time, I realised that while the world asked us to perform more, 
                what many of us really needed was a space to become more real.
              </p>
              <p>
                The Becoming is my attempt to curate that space – not as a teacher, not as a therapist, 
                but as a fellow human who knows what it feels like to be on autopilot."
              </p>
            </blockquote>
            <p className="mt-8 font-heading text-xl text-sand italic">— Mitin</p>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <div className="video-placeholder" data-testid="video-placeholder">
              <div className="play-button">
                <Play className="w-8 h-8 text-sand ml-1" />
              </div>
            </div>
            <p className="text-xs text-[#525252] text-center mt-4">
              Watch: Why I Created The Becoming
            </p>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 bg-void border-t border-white/5">
      <div className="content-container px-6 text-center">
        <p className="font-heading text-2xl text-[#e5e5e5] mb-2">The Becoming</p>
        <p className="text-sm text-[#525252]">A curated human experience</p>
        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs text-[#525252]">
            © {new Date().getFullYear()} The Becoming. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-void" data-testid="landing-page">
      <div className="grain-overlay" />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#161616',
            color: '#e5e5e5',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      />
      <HeroSection />
      <WhatIsItSection />
      <ExperienceSection />
      <WhoItsForSection />
      <CircleSection />
      <PilotBatchSection />
      <HowItWorksSection />
      <SignUpSection />
      <FounderSection />
      <Footer />
    </div>
  );
}
