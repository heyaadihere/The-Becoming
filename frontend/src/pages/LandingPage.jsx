import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, ArrowRight, ArrowLeft, Check, Loader2, X, Sparkles, Heart, Leaf, Sun, Moon, Star, Feather, Wind, Waves, Quote, Users, Clock, MapPin } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// High-quality images
const images = {
  hero: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
  nature1: "https://images.unsplash.com/photo-1518173946687-a4c036bc3c95?w=1200&q=80",
  nature2: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  meditation: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&q=80",
  forest: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80",
  calm: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1200&q=80",
  peaceful: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=80",
  journey: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
  reflection: "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=1200&q=80",
  mountains: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
  lake: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
  sunset: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200&q=80"
};

// Logo component
const Logo = ({ className = "h-12" }) => (
  <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="35" y1="10" x2="35" y2="130" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="70" cy="85" rx="40" ry="45" stroke="currentColor" strokeWidth="2" fill="none"/>
    <text x="52" y="80" fill="currentColor" fontSize="14" fontFamily="serif">the</text>
    <text x="38" y="98" fill="currentColor" fontSize="14" fontFamily="serif">becoming</text>
  </svg>
);

// Floating particles animation
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-white/20"
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{ 
          y: [null, Math.random() * -200 - 100],
          opacity: [0.2, 0.8, 0.2]
        }}
        transition={{ 
          duration: Math.random() * 10 + 10, 
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
  </div>
);

// Animated gradient background
const AnimatedGradient = ({ children, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 via-transparent to-deep-sage/5 animate-pulse" style={{ animationDuration: '8s' }} />
    {children}
  </div>
);

// Video background with overlay
const VideoHero = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute w-full h-full object-cover scale-105"
        poster={images.hero}
      >
        <source src="https://cdn.coverr.co/videos/coverr-fog-rolling-over-forested-mountains-1584/1080p.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/90" />
      <FloatingParticles />
    </div>
  );
};

// Parallax Image Component
const ParallaxImage = ({ src, alt, className = "", speed = 0.5 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img 
        src={src} 
        alt={alt} 
        style={{ y }}
        className="w-full h-[120%] object-cover"
      />
    </div>
  );
};

// Animated counter
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

// Section reveal animation
const RevealSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Questionnaire Modal (keeping same as before but with enhanced styling)
const QuestionnaireModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState({
    name: '', email: '', phone: '', energyDrain: '', cravings: [], currentPhase: '',
    selfPerception: '', lookingForward: '', nextVersion: '', growthStyle: '',
    whyNow: '', showUp: '', timing: '', stayPreference: '', sport: '', creative: '',
    social: '', finalStatement: ''
  });

  const questions = [
    { id: 'welcome', type: 'welcome', title: "Let's begin your journey", subtitle: "A few questions to understand where you are" },
    { id: 'name', type: 'text', label: "What's your name?", hint: "First name is enough.", field: 'name', required: true },
    { id: 'energyDrain', type: 'single', label: "One thing that drains your energy lately?", field: 'energyDrain',
      options: ['Overthinking everything', 'Feeling stuck / unclear', 'Self-doubt creeping in', 'Too much noise, not enough clarity', 'Comparing myself to others', 'Running on autopilot'] },
    { id: 'cravings', type: 'multi', label: "What are you craving more of right now?", hint: "Pick up to 3 that resonate.", field: 'cravings', max: 3,
      options: ['Mental clarity', 'Confidence & self-trust', 'Emotional balance', 'Direction / purpose', 'Better relationships', 'Discipline / consistency', 'Peace / stillness', 'Momentum / action'] },
    { id: 'currentPhase', type: 'single', label: "Which best describes your current phase?", field: 'currentPhase',
      options: ['Reinventing myself', 'Feeling lost but curious', 'Growing, but inconsistently', 'Stable, yet restless', 'Transitioning (career / life / identity)', 'Honestly… figuring things out'] },
    { id: 'selfPerception', type: 'single', label: "When it comes to yourself, you often…", field: 'selfPerception',
      options: ['Know what to do but don\'t act', 'Doubt your decisions', 'Feel capable but scattered', 'Feel stuck in patterns', 'Feel disconnected from yourself', 'Feel ready for something bigger'] },
    { id: 'lookingForward', type: 'textarea', label: "What are you looking forward to becoming?", hint: "Take a second. There's no right answer.", field: 'lookingForward', placeholder: "Share your thoughts..." },
    { id: 'nextVersion', type: 'textarea', label: "When you imagine your next version… who do you see?", hint: "Dream a little.", field: 'nextVersion', placeholder: "Describe your future self..." },
    { id: 'growthStyle', type: 'single', label: "How do you usually approach personal growth?", field: 'growthStyle',
      options: ['I consume a lot but struggle to apply', 'I start strong, then fade', 'I\'m consistent but plateaued', 'I\'m new to this space', 'I\'m deeply invested in growth', 'I grow through experiences, not theory'] },
    { id: 'whyNow', type: 'single', label: "Why does this feel like the right time?", field: 'whyNow',
      options: ['Something needs to change', 'I\'m tired of repeating patterns', 'I want deeper self-awareness', 'I feel ready for expansion', 'Curiosity / intuition', 'Perfect timing'] },
    { id: 'showUp', type: 'single', label: "If invited, how would you show up?", field: 'showUp',
      options: ['Curious but cautious', 'Fully open & engaged', 'Observing & absorbing', 'Ready to be challenged', 'Honestly… not sure yet'] },
    { id: 'timing', type: 'single', label: "How soon can you join us?", field: 'timing', options: ['April 2026', 'June 2026', 'September 2026'] },
    { id: 'stayPreference', type: 'single', label: "Your type of stay:", field: 'stayPreference', options: ['Double sharing', 'Triple sharing', 'Open to either'] },
    { id: 'sport', type: 'text', label: "Do you play any sport?", hint: "If yes, what?", field: 'sport', placeholder: "e.g., Tennis, Yoga, Swimming..." },
    { id: 'creative', type: 'text', label: "Do you engage with poetry or play any musical instrument?", hint: "If yes, what?", field: 'creative', placeholder: "e.g., Guitar, Writing poetry..." },
    { id: 'contact', type: 'contact', label: "Almost there!", hint: "How can we reach you?" },
    { id: 'social', type: 'text', label: "Drop your Instagram or LinkedIn", hint: "We look at alignment, not follower counts.", field: 'social', placeholder: "@yourhandle or profile link" },
    { id: 'finalStatement', type: 'single', label: "Last one ✨ Which statement feels most like you?", field: 'finalStatement',
      options: ['I know I\'m capable of more', 'I feel like I\'ve outgrown my current self', 'I want clarity more than motivation', 'I want internal change, not external hacks', 'I\'m searching for something I can\'t fully name'] }
  ];

  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const currentQuestion = questions[step];

  const handleNext = () => { if (step < totalSteps - 1) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };
  const handleSelectSingle = (option) => setAnswers({ ...answers, [currentQuestion.field]: option });
  const handleSelectMulti = (option) => {
    const current = answers[currentQuestion.field] || [];
    if (current.includes(option)) setAnswers({ ...answers, [currentQuestion.field]: current.filter(o => o !== option) });
    else if (current.length < (currentQuestion.max || 10)) setAnswers({ ...answers, [currentQuestion.field]: [...current, option] });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: answers.name, email: answers.email, phone: answers.phone || '',
        why_becoming: `Energy drain: ${answers.energyDrain}\nCravings: ${answers.cravings.join(', ')}\nWhy now: ${answers.whyNow}`,
        current_state: `Phase: ${answers.currentPhase}\nSelf-perception: ${answers.selfPerception}\nGrowth style: ${answers.growthStyle}`,
        what_seeking: `Looking forward to: ${answers.lookingForward}\nNext version: ${answers.nextVersion}\nFinal statement: ${answers.finalStatement}`,
        questionnaire_data: JSON.stringify(answers)
      };
      await axios.post(`${API}/signup`, payload);
      setIsComplete(true);
    } catch (error) { toast.error('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const canProceed = () => {
    if (currentQuestion.type === 'welcome') return true;
    if (currentQuestion.type === 'text' && currentQuestion.required) return answers[currentQuestion.field]?.trim().length > 0;
    if (currentQuestion.type === 'single') return answers[currentQuestion.field]?.length > 0;
    if (currentQuestion.type === 'contact') return answers.email?.includes('@');
    return true;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors" data-testid="close-questionnaire">
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <motion.div className="h-full bg-gradient-to-r from-terracotta to-deep-sage" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
        <div className="absolute top-6 left-6 text-sm text-white/60 font-body">{step + 1} / {totalSteps}</div>

        {isComplete ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md text-center text-white">
            <div className="w-24 h-24 rounded-full bg-deep-sage/30 flex items-center justify-center mx-auto mb-8">
              <Check className="w-12 h-12 text-deep-sage" />
            </div>
            <h2 className="font-heading text-5xl mb-4">Thank you, {answers.name}</h2>
            <p className="text-white/70 text-lg mb-10">Your responses have been received with care. We'll be in touch if The Becoming feels right for you.</p>
            <button onClick={onClose} className="btn-journey">Return to Journey</button>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl text-white">
            {currentQuestion.type === 'welcome' && (
              <div className="text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-10">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-terracotta to-soft-brown flex items-center justify-center mx-auto">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </motion.div>
                <h2 className="font-heading text-5xl sm:text-6xl mb-4">{currentQuestion.title}</h2>
                <p className="text-white/70 text-xl mb-12">{currentQuestion.subtitle}</p>
                <button onClick={handleNext} className="btn-journey text-lg px-12">Let's Begin <ArrowRight className="inline ml-2 w-5 h-5" /></button>
              </div>
            )}
            {currentQuestion.type === 'text' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-4xl sm:text-5xl mb-3">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/60 text-lg">{currentQuestion.hint}</p>}</div>
                <input type="text" value={answers[currentQuestion.field] || ''} onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })} placeholder={currentQuestion.placeholder || ''} className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-5 text-xl text-white placeholder-white/40 focus:border-terracotta focus:outline-none transition-colors" autoFocus />
              </div>
            )}
            {currentQuestion.type === 'textarea' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-4xl sm:text-5xl mb-3">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/60 text-lg">{currentQuestion.hint}</p>}</div>
                <textarea value={answers[currentQuestion.field] || ''} onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })} placeholder={currentQuestion.placeholder || ''} className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-5 text-lg text-white placeholder-white/40 focus:border-terracotta focus:outline-none transition-colors min-h-[150px] resize-none" autoFocus />
              </div>
            )}
            {currentQuestion.type === 'single' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-4xl sm:text-5xl mb-3">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/60 text-lg">{currentQuestion.hint}</p>}</div>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.div key={option} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectSingle(option)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${answers[currentQuestion.field] === option ? 'bg-terracotta/20 border-terracotta' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                      <span className="font-body text-lg">{option}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {currentQuestion.type === 'multi' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-4xl sm:text-5xl mb-3">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/60 text-lg">{currentQuestion.hint}</p>}</div>
                <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = (answers[currentQuestion.field] || []).includes(option);
                    return (
                      <motion.div key={option} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}
                        onClick={() => handleSelectMulti(option)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'bg-terracotta/20 border-terracotta' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <span className="font-body">{option}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
            {currentQuestion.type === 'contact' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-4xl sm:text-5xl mb-3">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/60 text-lg">{currentQuestion.hint}</p>}</div>
                <div className="space-y-4">
                  <input type="email" value={answers.email || ''} onChange={(e) => setAnswers({ ...answers, email: e.target.value })} placeholder="your@email.com" className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-5 text-xl text-white placeholder-white/40 focus:border-terracotta focus:outline-none transition-colors" />
                  <input type="tel" value={answers.phone || ''} onChange={(e) => setAnswers({ ...answers, phone: e.target.value })} placeholder="Phone (optional)" className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-5 text-xl text-white placeholder-white/40 focus:border-terracotta focus:outline-none transition-colors" />
                </div>
              </div>
            )}
            {currentQuestion.type !== 'welcome' && (
              <div className="flex justify-between items-center mt-12">
                <button onClick={handleBack} disabled={step === 0} className="px-8 py-4 rounded-full border-2 border-white/20 text-white hover:bg-white/10 disabled:opacity-30 transition-all flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                {step === totalSteps - 1 ? (
                  <button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="btn-journey flex items-center gap-2">
                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <>Complete <Check className="w-5 h-5" /></>}
                  </button>
                ) : (
                  <button onClick={handleNext} disabled={!canProceed()} className="btn-journey flex items-center gap-2 disabled:opacity-50">Continue <ArrowRight className="w-5 h-5" /></button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Navigation
const Navigation = ({ onBeginReset }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-warm-cream/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo className={`h-12 transition-colors duration-300 ${isScrolled ? 'text-charcoal' : 'text-white'}`} />
        <nav className="hidden md:flex items-center gap-8">
          {['About', 'Experience', 'Journey', 'Stories'].map((item) => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              className={`text-sm font-body tracking-wide transition-colors ${isScrolled ? 'text-charcoal/70 hover:text-terracotta' : 'text-white/80 hover:text-white'}`}>
              {item}
            </button>
          ))}
        </nav>
        <button onClick={onBeginReset} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${isScrolled ? 'bg-terracotta text-white hover:bg-soft-brown' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'}`}>
          Begin Reset
        </button>
      </div>
    </motion.header>
  );
};

// Hero Section - Full Screen with Video
const HeroSection = ({ onBeginReset }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      <VideoHero />
      
      <motion.div style={{ y, opacity, scale }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Logo className="h-24 w-auto mx-auto text-white mb-6" />
        </motion.div>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="font-body text-sm tracking-[0.4em] text-white/70 uppercase mb-8">
          A Curated Human Experience
        </motion.p>
        
        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
          className="font-heading text-6xl sm:text-7xl lg:text-8xl text-white mb-8 leading-[0.9]">
          Do you need<br /><em className="text-terracotta">a reset?</em>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="font-heading text-2xl sm:text-3xl text-white/80 mb-6 italic">
          The Becoming is an invitation to become real again.
        </motion.p>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="font-body text-lg text-white/60 max-w-2xl mx-auto mb-12">
          For those functioning well on the outside, yet inside feeling paused, restless, or quietly lost. 
          A space to step away from the noise and reconnect with yourself.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onBeginReset} className="btn-journey text-lg px-10 py-4" data-testid="hero-cta">
            Begin Your Reset <ArrowRight className="inline ml-2 w-5 h-5" />
          </button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
            Explore <ChevronDown className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
          <ChevronDown className="w-10 h-10 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Stats Banner
const StatsBanner = () => {
  const stats = [
    { icon: <Users />, value: 20, label: "Curated Seats", suffix: "" },
    { icon: <Clock />, value: 4, label: "Days of Immersion", suffix: "" },
    { icon: <MapPin />, value: 1, label: "Transformative Location", suffix: "" },
    { icon: <Heart />, value: 100, label: "Intentional Focus", suffix: "%" }
  ];

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={images.forest} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-charcoal/80" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <RevealSection key={index} delay={index * 0.1} className="text-center">
              <div className="w-16 h-16 rounded-full bg-terracotta/30 flex items-center justify-center mx-auto mb-4 text-terracotta">
                {stat.icon}
              </div>
              <p className="font-heading text-5xl lg:text-6xl text-white mb-2 drop-shadow-lg">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-body text-white/80 text-lg">{stat.label}</p>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Section - Full Width with Parallax
const AboutSection = () => {
  return (
    <section id="about" className="relative">
      {/* First block */}
      <div className="min-h-screen flex items-center bg-warm-cream py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <RevealSection>
            <p className="font-body text-sm tracking-[0.3em] text-terracotta uppercase mb-6">The Essence</p>
            <h2 className="font-heading text-5xl lg:text-6xl text-charcoal mb-8 leading-tight">
              What is <em className="text-terracotta">The Becoming</em>?
            </h2>
            <div className="space-y-6 text-charcoal/80 text-lg leading-relaxed">
              <p>The Becoming is a curated human experience for people who are doing what life expects of them, yet feel there must be more meaning, more depth, more truth to who they are.</p>
              <div className="flex flex-col gap-3 py-6 bg-soft-beige/50 rounded-2xl px-6">
                <span className="font-heading text-2xl text-charcoal">It is <span className="text-terracotta font-semibold">not</span> a retreat.</span>
                <span className="font-heading text-2xl text-charcoal">It is <span className="text-terracotta font-semibold">not</span> a workshop.</span>
                <span className="font-heading text-2xl text-charcoal">It is <span className="text-terracotta font-semibold">not</span> a lecture.</span>
              </div>
              <p>No one can teach you how to live. Nobody is here to fix you. Instead, The Becoming creates a safe, intentional space where you step away from routines, screens and constant performance, and turn inward.</p>
            </div>
          </RevealSection>
          <RevealSection delay={0.2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-terracotta/20 to-deep-sage/20 rounded-3xl blur-3xl" />
              <ParallaxImage src={images.meditation} alt="Meditation" className="relative rounded-3xl h-[600px] shadow-2xl" />
            </div>
          </RevealSection>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="py-32 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={images.nature1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-charcoal/70" />
        <RevealSection className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Quote className="w-16 h-16 text-terracotta mx-auto mb-8" />
          <p className="font-heading text-4xl lg:text-5xl text-white italic leading-relaxed drop-shadow-lg">
            "No promises. No fixing. No preaching. No selling. Only experiences."
          </p>
        </RevealSection>
      </div>
    </section>
  );
};

// Experience Section - Full Width Cards
const ExperienceSection = () => {
  const experiences = [
    { icon: <Leaf />, title: "Nature & Stillness", desc: "Reconnect with the natural world and find peace in the silence of the mountains", image: images.forest },
    { icon: <Wind />, title: "Mindful Movement", desc: "Listen to your body and move with intention through guided practices", image: images.peaceful },
    { icon: <Feather />, title: "Reflection & Creativity", desc: "Express what words cannot capture through art, writing, and creative exploration", image: images.reflection },
    { icon: <Star />, title: "Writing & Music", desc: "Explore the landscapes of your inner world through journaling and musical experiences", image: images.sunset },
    { icon: <Heart />, title: "Storytelling & Connection", desc: "Share and listen to honest human stories in a circle of trust", image: images.calm }
  ];

  return (
    <section id="experience" className="py-32 bg-warm-cream">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection className="text-center mb-20">
          <p className="font-body text-sm tracking-[0.3em] text-terracotta uppercase mb-6">The Journey</p>
          <h2 className="font-heading text-5xl lg:text-6xl text-charcoal mb-6">What You Will <em className="text-terracotta">Experience</em></h2>
          <p className="font-body text-xl text-charcoal/60 max-w-2xl mx-auto">At The Becoming, you are invited to experience life beyond autopilot.</p>
        </RevealSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <RevealSection key={index} delay={index * 0.1}>
              <motion.div whileHover={{ y: -10 }} className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer">
                <img src={exp.image} alt={exp.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="w-14 h-14 rounded-full bg-terracotta/20 backdrop-blur-sm flex items-center justify-center mb-4 text-white">
                    {exp.icon}
                  </div>
                  <h3 className="font-heading text-2xl text-white mb-2">{exp.title}</h3>
                  <p className="font-body text-white/70">{exp.desc}</p>
                </div>
              </motion.div>
            </RevealSection>
          ))}
        </div>

        <RevealSection delay={0.5} className="mt-20 max-w-3xl mx-auto text-center">
          <p className="font-body text-xl text-charcoal/70 leading-relaxed">
            Participants begin to listen inward and not outward. They reconnect with their inner voice and rediscover parts of themselves they might have ignored or never known.
          </p>
        </RevealSection>
      </div>
    </section>
  );
};

// Journey Section - Horizontal Scroll Feel
const JourneySection = () => {
  const sections = [
    { title: "Who Is This For?", items: ["Working professionals feeling the weight", "Creators seeking deeper meaning", "Artists in need of reset", "Homemakers wanting more", "Anyone ready to become real"] },
    { title: "It May Be For You If...", items: ["You're functioning well outside, but feel quietly tired inside", "You've been chasing meaning, and suspect meaning has been chasing you", "You feel there must be more depth and truth to who you are"] }
  ];

  return (
    <section id="journey" className="relative">
      {/* Full width image banner */}
      <div className="h-[60vh] relative overflow-hidden">
        <ParallaxImage src={images.mountains} alt="Mountains" className="absolute inset-0 h-full" />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <RevealSection className="text-center">
            <p className="font-body text-sm tracking-[0.3em] text-terracotta uppercase mb-6">Is This For You?</p>
            <h2 className="font-heading text-5xl lg:text-7xl text-white">Who is The Becoming <em className="text-terracotta">For</em>?</h2>
          </RevealSection>
        </div>
      </div>

      {/* Content */}
      <div className="py-32 bg-soft-beige">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          {sections.map((section, idx) => (
            <RevealSection key={idx} delay={idx * 0.2}>
              <h3 className="font-heading text-3xl text-charcoal mb-8">{section.title}</h3>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <motion.div key={i} whileHover={{ x: 10 }} className="flex items-start gap-4 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-terracotta/10 hover:border-terracotta/30 transition-all cursor-pointer">
                    <div className="w-3 h-3 rounded-full bg-terracotta mt-2 flex-shrink-0" />
                    <p className="font-body text-charcoal/80 text-lg">{item}</p>
                  </motion.div>
                ))}
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// Circle Section
const CircleSection = () => {
  return (
    <section className="py-32 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src={images.lake} alt="" className="w-full h-full object-cover" />
      </div>
      <FloatingParticles />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <RevealSection>
          <p className="font-body text-sm tracking-[0.3em] text-terracotta uppercase mb-6">Beyond The Experience</p>
          <h2 className="font-heading text-5xl lg:text-6xl text-white mb-8">Not Just an Experience. <em className="text-terracotta">A Circle.</em></h2>
          <p className="font-body text-xl text-white/70 mb-16 leading-relaxed">
            Beyond the experience itself, The Becoming is the foundation of something larger – a community of like-minded individuals who value depth over speed, presence over performance, and humanity over hustle.
          </p>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            "Stay in constant touch with you even after the experience is over",
            "Remind you of what matters, when life gets noisy again",
            "Offer a circle that continues long after the experience is done"
          ].map((item, idx) => (
            <RevealSection key={idx} delay={idx * 0.1}>
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-terracotta/30 transition-all">
                <div className="w-12 h-12 rounded-full border-2 border-terracotta/50 flex items-center justify-center mx-auto mb-6">
                  <span className="font-heading text-xl text-terracotta">{idx + 1}</span>
                </div>
                <p className="font-body text-white/80">{item}</p>
              </div>
            </RevealSection>
          ))}
        </div>

        <RevealSection delay={0.4}>
          <div className="space-y-2">
            <p className="font-heading text-3xl text-white italic">It's not for now.</p>
            <p className="font-heading text-3xl text-white italic">It's for <span className="text-terracotta">now</span> and <span className="text-deep-sage">then</span></p>
            <p className="font-heading text-3xl text-white italic">and <span className="text-terracotta">again</span>.</p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

// Stories/Testimonials
const StoriesSection = () => {
  const [active, setActive] = useState(0);
  const stories = [
    { quote: "I came thinking I needed answers. I left understanding that I am the answer I've been searching for.", author: "Priya S.", role: "Corporate Executive" },
    { quote: "For the first time in decades, I felt permission to just be. Not perform. Not achieve. Just exist.", author: "Rahul M.", role: "Entrepreneur" },
    { quote: "The Becoming didn't fix me. It helped me realize I was never broken. Just buried.", author: "Ananya K.", role: "Artist & Mother" }
  ];

  useEffect(() => {
    const interval = setInterval(() => setActive((prev) => (prev + 1) % stories.length), 6000);
    return () => clearInterval(interval);
  }, [stories.length]);

  return (
    <section id="stories" className="py-32 bg-warm-cream">
      <div className="max-w-5xl mx-auto px-6">
        <RevealSection className="text-center mb-16">
          <p className="font-body text-sm tracking-[0.3em] text-terracotta uppercase mb-6">Voices From Within</p>
          <h2 className="font-heading text-5xl lg:text-6xl text-charcoal">What They <em className="text-terracotta">Discovered</em></h2>
        </RevealSection>

        <div className="relative h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <Quote className="w-20 h-20 text-terracotta/20 mb-8" />
              <p className="font-heading text-3xl lg:text-4xl text-charcoal italic mb-10 leading-relaxed">"{stories[active].quote}"</p>
              <p className="font-body text-terracotta font-medium text-lg">{stories[active].author}</p>
              <p className="font-body text-charcoal/50">{stories[active].role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3">
          {stories.map((_, idx) => (
            <button key={idx} onClick={() => setActive(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === active ? 'bg-terracotta w-10' : 'bg-terracotta/30 hover:bg-terracotta/50'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = ({ onBeginReset }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="https://cdn.coverr.co/videos/coverr-woman-meditating-by-the-ocean-at-sunset-2802/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-charcoal/70" />
      </div>
      <FloatingParticles />
      
      <RevealSection className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-terracotta to-soft-brown flex items-center justify-center mx-auto mb-10">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="font-heading text-5xl lg:text-7xl text-white mb-8">Ready for your <em className="text-terracotta">reset</em>?</h2>
        <p className="font-body text-xl text-white/70 mb-12 max-w-2xl mx-auto">
          If this resonates with you, if you feel quietly ready, take a moment and tell us who you are. Your journey begins with a single step.
        </p>
        <button onClick={onBeginReset} className="btn-journey text-xl px-14 py-5" data-testid="cta-button">
          Begin Your Reset <ArrowRight className="inline ml-3 w-6 h-6" />
        </button>
      </RevealSection>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="py-20 bg-charcoal border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-12 mb-16">
        <div>
          <Logo className="h-16 text-white mb-6" />
          <p className="font-body text-white/50">A curated human experience for those ready to become real again.</p>
        </div>
        <div>
          <h4 className="font-heading text-xl text-white mb-6">Navigate</h4>
          <div className="space-y-3">
            {['About', 'Experience', 'Journey', 'Stories'].map((item) => (
              <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="block font-body text-white/50 hover:text-terracotta transition-colors">{item}</button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading text-xl text-white mb-6">Connect</h4>
          <a href="mailto:hello@thebecoming.in" className="font-body text-terracotta hover:text-white transition-colors">hello@thebecoming.in</a>
        </div>
      </div>
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-sm text-white/30">© {new Date().getFullYear()} The Becoming. All rights reserved.</p>
        <p className="font-body text-sm text-white/30">
          Website powered by <a href="https://techbook.co.in/" target="_blank" rel="noopener noreferrer" className="text-terracotta hover:text-white transition-colors">Techbook Technologies</a>
        </p>
      </div>
    </div>
  </footer>
);

// Main App
export default function LandingPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  return (
    <div className="min-h-screen bg-warm-cream" data-testid="landing-page">
      <Toaster position="top-center" toastOptions={{ style: { background: '#3a3a3a', color: '#fff', border: '1px solid rgba(196, 164, 132, 0.3)' } }} />
      <Navigation onBeginReset={() => setShowQuestionnaire(true)} />
      <HeroSection onBeginReset={() => setShowQuestionnaire(true)} />
      <StatsBanner />
      <AboutSection />
      <ExperienceSection />
      <JourneySection />
      <CircleSection />
      <StoriesSection />
      <CTASection onBeginReset={() => setShowQuestionnaire(true)} />
      <Footer />
      <QuestionnaireModal isOpen={showQuestionnaire} onClose={() => setShowQuestionnaire(false)} />
    </div>
  );
}
