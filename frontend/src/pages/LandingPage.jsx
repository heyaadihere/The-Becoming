import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, ArrowLeft, Check, Loader2, X, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo component using the uploaded image
const Logo = ({ className = "h-16", variant = "dark" }) => (
  <img 
    src="/images/logo.png" 
    alt="The Becoming" 
    className={`${className} object-contain ${variant === 'light' ? 'brightness-0 invert' : ''}`}
  />
);

// Section reveal animation
const RevealSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Questionnaire Modal
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
    { id: 'welcome', type: 'welcome', title: "Begin Your Journey", subtitle: "A few questions to understand where you are" },
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
    { id: 'contact', type: 'contact', label: "Almost there", hint: "How can we reach you?" },
    { id: 'social', type: 'text', label: "Drop your Instagram or LinkedIn", hint: "We look at alignment, not follower counts.", field: 'social', placeholder: "@yourhandle or profile link" },
    { id: 'finalStatement', type: 'single', label: "Last one — Which statement feels most like you?", field: 'finalStatement',
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 text-white/60 hover:text-white transition-colors" data-testid="close-questionnaire">
          <X className="w-6 h-6" />
        </button>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
          <motion.div className="h-full bg-gradient-to-r from-accent-gold to-accent-bronze" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
        <div className="absolute top-8 left-8 text-xs text-white/40 font-body tracking-widest uppercase">{step + 1} / {totalSteps}</div>

        {isComplete ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md text-center text-white">
            <div className="w-20 h-20 border border-accent-gold flex items-center justify-center mx-auto mb-10">
              <Check className="w-8 h-8 text-accent-gold" />
            </div>
            <h2 className="font-heading text-4xl mb-4">Thank you, {answers.name}</h2>
            <p className="text-white/60 text-sm font-body leading-relaxed mb-10 tracking-wide">Your responses have been received. We will be in touch if The Becoming feels right for you.</p>
            <button onClick={onClose} className="btn-outline border-white/30 text-white hover:bg-white/10">Return</button>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl text-white">
            {currentQuestion.type === 'welcome' && (
              <div className="text-center">
                <Logo className="h-24 mx-auto mb-12" variant="light" />
                <h2 className="font-heading text-4xl sm:text-5xl mb-4 italic">{currentQuestion.title}</h2>
                <p className="text-white/50 text-sm font-body tracking-wide mb-12">{currentQuestion.subtitle}</p>
                <button onClick={handleNext} className="btn-luxe">Begin <ArrowRight className="inline ml-3 w-4 h-4" /></button>
              </div>
            )}
            {currentQuestion.type === 'text' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/40 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <input type="text" value={answers[currentQuestion.field] || ''} onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })} placeholder={currentQuestion.placeholder || ''} className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-lg text-white placeholder-white/30 focus:border-accent-gold focus:outline-none transition-colors font-body" autoFocus />
              </div>
            )}
            {currentQuestion.type === 'textarea' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/40 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <textarea value={answers[currentQuestion.field] || ''} onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })} placeholder={currentQuestion.placeholder || ''} className="w-full bg-transparent border border-white/20 px-4 py-4 text-base text-white placeholder-white/30 focus:border-accent-gold focus:outline-none transition-colors font-body min-h-[140px] resize-none" autoFocus />
              </div>
            )}
            {currentQuestion.type === 'single' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/40 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.div key={option} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                      onClick={() => handleSelectSingle(option)}
                      className={`p-4 border cursor-pointer transition-all font-body text-sm tracking-wide ${answers[currentQuestion.field] === option ? 'bg-accent-gold/20 border-accent-gold text-white' : 'border-white/10 text-white/70 hover:border-white/30 hover:text-white'}`}>
                      {option}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {currentQuestion.type === 'multi' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/40 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <div className="grid grid-cols-2 gap-2 max-h-[45vh] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = (answers[currentQuestion.field] || []).includes(option);
                    return (
                      <motion.div key={option} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}
                        onClick={() => handleSelectMulti(option)}
                        className={`p-4 border cursor-pointer transition-all font-body text-sm ${isSelected ? 'bg-accent-gold/20 border-accent-gold text-white' : 'border-white/10 text-white/60 hover:border-white/30'}`}>
                        {option}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
            {currentQuestion.type === 'contact' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-white/40 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <div className="space-y-4">
                  <input type="email" value={answers.email || ''} onChange={(e) => setAnswers({ ...answers, email: e.target.value })} placeholder="your@email.com" className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-lg text-white placeholder-white/30 focus:border-accent-gold focus:outline-none transition-colors font-body" />
                  <input type="tel" value={answers.phone || ''} onChange={(e) => setAnswers({ ...answers, phone: e.target.value })} placeholder="Phone (optional)" className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-lg text-white placeholder-white/30 focus:border-accent-gold focus:outline-none transition-colors font-body" />
                </div>
              </div>
            )}
            {currentQuestion.type !== 'welcome' && (
              <div className="flex justify-between items-center mt-12">
                <button onClick={handleBack} disabled={step === 0} className="text-white/40 hover:text-white disabled:opacity-20 transition-all flex items-center gap-2 text-sm font-body tracking-wider uppercase">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                {step === totalSteps - 1 ? (
                  <button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="btn-luxe flex items-center gap-2">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</> : <>Complete <Check className="w-4 h-4" /></>}
                  </button>
                ) : (
                  <button onClick={handleNext} disabled={!canProceed()} className="btn-luxe flex items-center gap-2 disabled:opacity-50">Continue <ArrowRight className="w-4 h-4" /></button>
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
const Navigation = ({ onBeginJourney }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6 flex items-center justify-between">
        <Logo className={`h-12 transition-all duration-300 ${isScrolled ? '' : 'brightness-0 invert'}`} />
        <nav className="hidden md:flex items-center gap-12">
          {['About', 'Experience', 'Journey'].map((item) => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              className={`text-xs font-body tracking-[0.2em] uppercase transition-colors ${isScrolled ? 'text-deep-charcoal hover:text-accent-gold' : 'text-white/90 hover:text-white'}`}>
              {item}
            </button>
          ))}
        </nav>
        <button onClick={onBeginJourney} className="btn-luxe text-xs" data-testid="nav-cta">
          Begin
        </button>
      </div>
    </motion.header>
  );
};

// Hero Section - With peaceful video background
const HeroSection = ({ onBeginJourney }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    // Attempt to play video on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, video will show poster
      });
    }
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" data-testid="hero-section">
      {/* Peaceful ocean video background */}
      <div className="absolute inset-0">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          className="absolute w-full h-full object-cover"
        >
          {/* Local peaceful ocean video */}
          <source src="/video.mp4" type="video/mp4" />
        </video>
        {/* Strong overlay layer for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Logo className="h-48 md:h-64 lg:h-80 w-auto mx-auto mb-12" variant="light" />
        </motion.div>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="font-body text-sm md:text-base tracking-[0.5em] text-accent-gold uppercase mb-10">
          A Curated Human Experience
        </motion.p>
        
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}
          className="font-heading text-6xl sm:text-7xl lg:text-9xl text-white mb-10 leading-[1.1]">
          Do you need<br /><em className="text-accent-gold">a reset?</em>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="font-body text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-14 leading-relaxed tracking-wide">
          For those functioning well on the outside, yet inside feeling paused, restless, or quietly lost.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button onClick={onBeginJourney} className="btn-luxe text-sm px-12 py-5" data-testid="hero-cta">
            Begin Your Journey
          </button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white/20 backdrop-blur-sm border border-white/40 text-white hover:bg-white/30 text-sm px-12 py-5 font-body tracking-[0.2em] uppercase transition-all">
            Learn More
          </button>
        </motion.div>
      </div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
          <ChevronDown className="w-8 h-8 text-accent-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// About Section - More spacious
const AboutSection = () => {
  return (
    <section id="about" className="py-40 lg:py-52 bg-cream">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <RevealSection className="text-center mb-24">
          <p className="font-body text-sm md:text-base tracking-[0.4em] text-accent-gold uppercase mb-8">The Essence</p>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-deep-charcoal mb-8 italic">
            What is The Becoming?
          </h2>
          <div className="w-20 h-[1px] bg-accent-gold mx-auto" />
        </RevealSection>

        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <RevealSection delay={0.2}>
            <div className="space-y-8 text-charcoal text-xl md:text-2xl leading-relaxed font-body">
              <p>
                The Becoming is a curated human experience for people who are doing what life expects of them, yet feel there must be more meaning, more depth, more truth to who they are.
              </p>
              <div className="py-10 border-t border-b border-sand space-y-4">
                <p className="font-heading text-2xl md:text-3xl text-deep-charcoal">It is <span className="text-accent-gold">not</span> a retreat.</p>
                <p className="font-heading text-2xl md:text-3xl text-deep-charcoal">It is <span className="text-accent-gold">not</span> a workshop.</p>
                <p className="font-heading text-2xl md:text-3xl text-deep-charcoal">It is <span className="text-accent-gold">not</span> a lecture.</p>
              </div>
              <p>
                No one can teach you how to live. Nobody is here to fix you. Instead, The Becoming creates a safe, intentional space where you step away from routines, screens and constant performance, and turn inward.
              </p>
            </div>
          </RevealSection>
          
          <RevealSection delay={0.4}>
            <div className="relative aspect-[4/5] bg-sand">
              <img 
                src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80" 
                alt="Meditation" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/30 to-transparent" />
            </div>
          </RevealSection>
        </div>

        <RevealSection delay={0.3} className="mt-32 text-center max-w-4xl mx-auto">
          <p className="font-heading text-3xl md:text-4xl lg:text-5xl text-deep-charcoal italic leading-relaxed">
            "No promises. No fixing. No preaching. No selling. <span className="text-accent-gold">Only experiences.</span>"
          </p>
        </RevealSection>
      </div>
    </section>
  );
};

// Experience Section - More spacious
const ExperienceSection = () => {
  const experiences = [
    { title: "Nature & Stillness", desc: "Reconnect with the natural world and find peace in silence" },
    { title: "Mindful Movement", desc: "Listen to your body and move with intention" },
    { title: "Reflection & Creativity", desc: "Express what words cannot capture" },
    { title: "Writing & Music", desc: "Explore the landscapes of your inner world" },
    { title: "Storytelling & Connection", desc: "Share and listen to honest human stories" }
  ];

  return (
    <section id="experience" className="py-40 lg:py-52 bg-soft-cream">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <RevealSection className="text-center mb-24">
          <p className="font-body text-sm md:text-base tracking-[0.4em] text-accent-gold uppercase mb-8">The Journey</p>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-deep-charcoal mb-6 italic">What You Will Experience</h2>
          <p className="font-body text-charcoal text-xl md:text-2xl max-w-xl mx-auto mt-8">
            At The Becoming, you are invited to experience life beyond autopilot.
          </p>
          <div className="w-20 h-[1px] bg-accent-gold mx-auto mt-10" />
        </RevealSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {experiences.map((exp, index) => (
            <RevealSection key={index} delay={index * 0.1}>
              <div className="p-10 bg-cream border border-sand hover:border-accent-gold transition-all duration-500 group h-full">
                <span className="font-body text-sm text-accent-gold tracking-widest">0{index + 1}</span>
                <h3 className="font-heading text-2xl md:text-3xl text-deep-charcoal mt-6 mb-4 italic group-hover:text-accent-gold transition-colors">{exp.title}</h3>
                <p className="font-body text-charcoal text-lg md:text-xl leading-relaxed">{exp.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// Journey/Who Section - More spacious
const JourneySection = () => {
  const forYouIf = [
    "You're functioning well outside, but feel quietly tired inside",
    "You've been chasing meaning, and suspect meaning has been chasing you",
    "You feel there must be more depth and truth to who you are",
    "You're ready to step away from the noise and reconnect"
  ];

  return (
    <section id="journey" className="py-40 lg:py-52 bg-cream">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <RevealSection>
            <div className="relative aspect-[4/5] bg-sand">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" 
                alt="Mountains" 
                className="w-full h-full object-cover"
              />
            </div>
          </RevealSection>
          
          <RevealSection delay={0.2}>
            <p className="font-body text-xs tracking-[0.4em] text-accent-gold uppercase mb-8">Is This For You?</p>
            <h2 className="font-heading text-5xl lg:text-6xl text-deep-charcoal mb-12 italic">
              Who is The Becoming For?
            </h2>
            
            <p className="font-body text-charcoal text-lg mb-10 leading-relaxed">
              Working professionals, creators, artists, homemakers — anyone between 21-65 who feels ready for something they can't fully name yet.
            </p>
            
            <div className="space-y-5">
              <p className="font-heading text-xl text-deep-charcoal italic mb-6">It may be for you if...</p>
              {forYouIf.map((item, idx) => (
                <div key={idx} className="flex items-start gap-5 py-4 border-b border-sand">
                  <span className="w-2 h-2 bg-accent-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="font-body text-charcoal">{item}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
};

// Circle/Community Section - More luxurious
const CircleSection = () => {
  return (
    <section className="py-40 lg:py-52 bg-deep-charcoal text-white">
      <div className="max-w-5xl mx-auto px-8 lg:px-16 text-center">
        <RevealSection>
          <p className="font-body text-xs tracking-[0.4em] text-accent-gold uppercase mb-8">Beyond The Experience</p>
          <h2 className="font-heading text-5xl lg:text-6xl mb-10 italic">
            Not Just an Experience. <span className="text-accent-gold">A Circle.</span>
          </h2>
          <div className="w-16 h-[1px] bg-accent-gold mx-auto mb-12" />
          <p className="font-body text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
            Beyond the experience itself, The Becoming is the foundation of something larger — a community of like-minded individuals who value depth over speed, presence over performance, and humanity over hustle.
          </p>
        </RevealSection>

        <RevealSection delay={0.3} className="mt-20 grid md:grid-cols-3 gap-10">
          {[
            "Stay in constant touch with you even after the experience is over",
            "Remind you of what matters, when life gets noisy again",
            "Offer a circle that continues long after the experience is done"
          ].map((item, idx) => (
            <div key={idx} className="p-8 border border-white/10 hover:border-accent-gold/50 transition-all">
              <span className="font-body text-xs text-accent-gold tracking-widest">0{idx + 1}</span>
              <p className="font-body text-white/80 mt-6 leading-relaxed">{item}</p>
            </div>
          ))}
        </RevealSection>
      </div>
    </section>
  );
};

// FAQ Section - More spacious
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "What exactly happens during The Becoming?", a: "The Becoming is a series of curated experiences designed to help you reconnect with yourself. Activities include nature immersion, mindful movement, creative expression, reflection exercises, and meaningful conversations. Each element is intentionally designed, not rushed or agenda-driven." },
    { q: "How long is the experience?", a: "The experience spans 4 days and 3 nights, carefully designed to give you enough time to truly step away from daily life and immerse yourself in the journey." },
    { q: "Where does it take place?", a: "The location is revealed to confirmed participants. We choose settings that offer natural beauty, privacy, and the right atmosphere for introspection and connection." },
    { q: "Is this like therapy or coaching?", a: "No. The Becoming is not therapy, coaching, or any form of treatment. We don't diagnose, prescribe, or promise to fix anything. We simply create space for you to reconnect with yourself through experiences." },
    { q: "How are participants selected?", a: "We carefully review each application to ensure alignment with The Becoming's values and intentions. We look for genuine readiness and openness, not credentials or achievements." }
  ];

  return (
    <section className="py-40 lg:py-52 bg-soft-cream">
      <div className="max-w-4xl mx-auto px-8 lg:px-16">
        <RevealSection className="text-center mb-20">
          <p className="font-body text-xs tracking-[0.4em] text-accent-gold uppercase mb-8">Questions</p>
          <h2 className="font-heading text-5xl text-deep-charcoal italic">Frequently Asked</h2>
          <div className="w-20 h-[1px] bg-accent-gold mx-auto mt-10" />
        </RevealSection>

        <div className="space-y-5">
          {faqs.map((faq, idx) => (
            <RevealSection key={idx} delay={idx * 0.1}>
              <div className="border border-sand bg-cream">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                  data-testid={`faq-${idx}`}
                >
                  <span className="font-heading text-xl text-deep-charcoal pr-4">{faq.q}</span>
                  {openIndex === idx ? <Minus className="w-5 h-5 text-accent-gold flex-shrink-0" /> : <Plus className="w-5 h-5 text-accent-gold flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-8 pb-8 font-body text-charcoal leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section - More impactful
const CTASection = ({ onBeginJourney }) => {
  return (
    <section className="py-40 lg:py-52 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,166,126,0.15),transparent_70%)]" />
      
      <RevealSection className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        <Logo className="h-28 mx-auto mb-14" />
        <h2 className="font-heading text-5xl lg:text-6xl text-deep-charcoal mb-8 italic">Ready for your <span className="text-accent-gold">reset</span>?</h2>
        <p className="font-body text-charcoal text-lg mb-14 max-w-2xl mx-auto leading-relaxed">
          If this resonates with you, if you feel quietly ready, take a moment and tell us who you are.
        </p>
        <button onClick={onBeginJourney} className="btn-luxe text-sm px-12 py-5" data-testid="cta-button">
          Begin Your Journey
        </button>
      </RevealSection>
    </section>
  );
};

// Footer - More refined
const Footer = () => (
  <footer className="py-20 bg-deep-charcoal text-white">
    <div className="max-w-7xl mx-auto px-8 lg:px-16">
      <div className="grid md:grid-cols-3 gap-16 mb-16">
        <div>
          <Logo className="h-16 mb-8" variant="light" />
          <p className="font-body text-white/50 leading-relaxed">A curated human experience for those ready to become real again.</p>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.3em] uppercase text-accent-gold mb-8">Navigate</h4>
          <div className="space-y-4">
            {['About', 'Experience', 'Journey'].map((item) => (
              <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="block font-body text-white/50 hover:text-accent-gold transition-colors">{item}</button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.3em] uppercase text-accent-gold mb-8">Connect</h4>
          <a href="mailto:hello@thebecoming.in" className="font-body text-white/50 hover:text-accent-gold transition-colors">hello@thebecoming.in</a>
        </div>
      </div>
      <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-white/30 tracking-wide">© {new Date().getFullYear()} The Becoming. All rights reserved.</p>
        <p className="font-body text-xs text-white/30 tracking-wide">
          Powered by <a href="https://techbook.co.in/" target="_blank" rel="noopener noreferrer" className="text-accent-gold hover:text-white transition-colors">Techbook Technologies</a>
        </p>
      </div>
    </div>
  </footer>
);

// Main App
export default function LandingPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  return (
    <div className="min-h-screen bg-cream" data-testid="landing-page">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(184, 166, 126, 0.3)', borderRadius: '0' } }} />
      <Navigation onBeginJourney={() => setShowQuestionnaire(true)} />
      <HeroSection onBeginJourney={() => setShowQuestionnaire(true)} />
      <AboutSection />
      <ExperienceSection />
      <JourneySection />
      <CircleSection />
      <FAQSection />
      <CTASection onBeginJourney={() => setShowQuestionnaire(true)} />
      <Footer />
      <QuestionnaireModal isOpen={showQuestionnaire} onClose={() => setShowQuestionnaire(false)} />
    </div>
  );
}
