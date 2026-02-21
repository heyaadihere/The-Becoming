import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, ArrowRight, ArrowLeft, Check, Loader2, X, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo component - uses white version on dark backgrounds, dark version on light backgrounds
const Logo = ({ className = "h-16", variant = "dark" }) => (
  <img 
    src={variant === 'light' ? '/images/logo-white.png' : '/images/logo-dark.png'}
    alt="The Becoming" 
    className={`${className} object-contain`}
  />
);

// Subtle animated background shapes - reusable component
const AnimatedBackground = ({ variant = "light" }) => {
  const shapes = [
    { size: 300, x: "10%", y: "20%", duration: 25, delay: 0 },
    { size: 200, x: "80%", y: "60%", duration: 30, delay: 5 },
    { size: 250, x: "60%", y: "10%", duration: 28, delay: 2 },
    { size: 180, x: "20%", y: "70%", duration: 22, delay: 8 },
  ];
  
  const isLight = variant === "light";
  const baseColor = isLight ? "184, 166, 126" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: `radial-gradient(circle, rgba(${baseColor}, 0.08) 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Subtle flowing lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M0,50 Q25,30 50,50 T100,50"
          stroke={isLight ? "#B8A67E" : "#fff"}
          strokeWidth="0.2"
          fill="none"
          animate={{ d: ["M0,50 Q25,30 50,50 T100,50", "M0,50 Q25,70 50,50 T100,50", "M0,50 Q25,30 50,50 T100,50"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,30 Q35,50 70,30 T100,30"
          stroke={isLight ? "#B8A67E" : "#fff"}
          strokeWidth="0.15"
          fill="none"
          animate={{ d: ["M0,30 Q35,50 70,30 T100,30", "M0,30 Q35,10 70,30 T100,30", "M0,30 Q35,50 70,30 T100,30"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.path
          d="M0,70 Q40,90 60,70 T100,70"
          stroke={isLight ? "#B8A67E" : "#fff"}
          strokeWidth="0.15"
          fill="none"
          animate={{ d: ["M0,70 Q40,90 60,70 T100,70", "M0,70 Q40,50 60,70 T100,70", "M0,70 Q40,90 60,70 T100,70"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
      </svg>
    </div>
  );
};

// Floating particles for form/modal
const FloatingParticles = ({ count = 15 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent-gold/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Magnetic cursor effect hook
const useMagnetic = () => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) * 0.2;
    const y = (e.clientY - centerY) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return { ref, position, handleMouseMove, handleMouseLeave };
};

// Parallax text effect
const ParallaxText = ({ children, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// Staggered letter animation
const AnimatedText = ({ text, className = "", delay = 0 }) => {
  const letters = text.split('');
  
  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: delay + index * 0.03,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
};

// Section reveal animation with enhanced effects
const RevealSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating element animation
const FloatingElement = ({ children, duration = 6, delay = 0 }) => (
  <motion.div
    animate={{ 
      y: [0, -15, 0],
      rotate: [-1, 1, -1]
    }}
    transition={{ 
      duration, 
      delay,
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    {children}
  </motion.div>
);

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
    { id: 'welcome', type: 'welcome', title: "Begin Your Transformation", subtitle: "A few questions to understand where you are" },
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
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-soft-cream via-cream to-sand/90 backdrop-blur-sm"
      >
        {/* Subtle animated background for form */}
        <FloatingParticles count={20} />
        <AnimatedBackground variant="light" />
        <motion.button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 text-charcoal/60 hover:text-deep-charcoal transition-colors" 
          data-testid="close-questionnaire"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-6 h-6" />
        </motion.button>
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-sand">
          <motion.div className="h-full bg-gradient-to-r from-accent-gold via-accent-bronze to-accent-gold" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
        <div className="absolute top-8 left-8 text-xs text-charcoal/50 font-body tracking-widest uppercase">{step + 1} / {totalSteps}</div>

        {isComplete ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md text-center text-deep-charcoal">
            <motion.div 
              className="w-24 h-24 border-2 border-accent-gold flex items-center justify-center mx-auto mb-10 bg-cream"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <Check className="w-10 h-10 text-accent-gold" />
            </motion.div>
            <h2 className="font-heading text-4xl mb-4 text-deep-charcoal">Thank you, {answers.name}</h2>
            <p className="text-charcoal/70 text-sm font-body leading-relaxed mb-10 tracking-wide">Your responses have been received. We will be in touch if The Becoming feels right for you.</p>
            <motion.button 
              onClick={onClose} 
              className="btn-outline border-accent-gold text-deep-charcoal hover:bg-accent-gold/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Return
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-2xl text-deep-charcoal">
            {currentQuestion.type === 'welcome' && (
              <div className="text-center">
                <FloatingElement>
                  <Logo className="h-28 mx-auto mb-12" variant="dark" />
                </FloatingElement>
                <motion.h2 
                  className="font-heading text-4xl sm:text-5xl mb-4 italic text-deep-charcoal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentQuestion.title}
                </motion.h2>
                <motion.p 
                  className="text-charcoal/60 text-sm font-body tracking-wide mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentQuestion.subtitle}
                </motion.p>
                <motion.button 
                  onClick={handleNext} 
                  className="btn-luxe"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(184, 166, 126, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Begin <ArrowRight className="inline ml-3 w-4 h-4" />
                </motion.button>
              </div>
            )}
            {currentQuestion.type === 'text' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic text-deep-charcoal">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-charcoal/50 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <motion.input 
                  type="text" 
                  value={answers[currentQuestion.field] || ''} 
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })} 
                  placeholder={currentQuestion.placeholder || ''} 
                  className="w-full bg-transparent border-b-2 border-sand px-0 py-4 text-xl text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none transition-all font-body" 
                  autoFocus
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
            {currentQuestion.type === 'textarea' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic text-deep-charcoal">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-charcoal/50 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <textarea value={answers[currentQuestion.field] || ''} onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })} placeholder={currentQuestion.placeholder || ''} className="w-full bg-white/50 border-2 border-sand px-4 py-4 text-lg text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none transition-colors font-body min-h-[140px] resize-none" autoFocus />
              </div>
            )}
            {currentQuestion.type === 'single' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic text-deep-charcoal">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-charcoal/50 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.div 
                      key={option} 
                      initial={{ opacity: 0, x: 30 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectSingle(option)}
                      whileHover={{ x: 10, backgroundColor: "rgba(184, 166, 126, 0.15)" }}
                      className={`p-4 border-2 cursor-pointer transition-all font-body text-sm tracking-wide ${answers[currentQuestion.field] === option ? 'bg-accent-gold/20 border-accent-gold text-deep-charcoal' : 'border-sand bg-white/30 text-charcoal hover:border-accent-gold/50 hover:text-deep-charcoal'}`}
                    >
                      {option}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {currentQuestion.type === 'multi' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic text-deep-charcoal">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-charcoal/50 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <div className="grid grid-cols-2 gap-2 max-h-[45vh] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = (answers[currentQuestion.field] || []).includes(option);
                    return (
                      <motion.div 
                        key={option} 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => handleSelectMulti(option)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 border-2 cursor-pointer transition-all font-body text-sm ${isSelected ? 'bg-accent-gold/20 border-accent-gold text-deep-charcoal' : 'border-sand bg-white/30 text-charcoal hover:border-accent-gold/50'}`}
                      >
                        {option}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
            {currentQuestion.type === 'contact' && (
              <div className="space-y-8">
                <div><h2 className="font-heading text-3xl sm:text-4xl mb-3 italic text-deep-charcoal">{currentQuestion.label}</h2>{currentQuestion.hint && <p className="text-charcoal/50 text-sm font-body tracking-wide">{currentQuestion.hint}</p>}</div>
                <div className="space-y-4">
                  <input type="email" value={answers.email || ''} onChange={(e) => setAnswers({ ...answers, email: e.target.value })} placeholder="your@email.com" className="w-full bg-transparent border-b-2 border-sand px-0 py-4 text-xl text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none transition-colors font-body" />
                  <input type="tel" value={answers.phone || ''} onChange={(e) => setAnswers({ ...answers, phone: e.target.value })} placeholder="Phone (optional)" className="w-full bg-transparent border-b-2 border-sand px-0 py-4 text-xl text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none transition-colors font-body" />
                </div>
              </div>
            )}
            {currentQuestion.type !== 'welcome' && (
              <div className="flex justify-between items-center mt-12">
                <motion.button 
                  onClick={handleBack} 
                  disabled={step === 0} 
                  className="text-charcoal/50 hover:text-deep-charcoal disabled:opacity-20 transition-all flex items-center gap-2 text-sm font-body tracking-wider uppercase"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </motion.button>
                {step === totalSteps - 1 ? (
                  <motion.button 
                    onClick={handleSubmit} 
                    disabled={!canProceed() || isSubmitting} 
                    className="btn-luxe flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</> : <>Complete <Check className="w-4 h-4" /></>}
                  </motion.button>
                ) : (
                  <motion.button 
                    onClick={handleNext} 
                    disabled={!canProceed()} 
                    className="btn-luxe flex items-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </motion.button>
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
    <motion.header 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${isScrolled ? 'bg-cream/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Logo className={`${isScrolled ? 'h-14' : 'h-20'} transition-all duration-500`} variant="dark" />
        </motion.div>
        <nav className="hidden md:flex items-center gap-12">
          {['About', 'Experience', 'Journey'].map((item, idx) => (
            <motion.button 
              key={item} 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-body tracking-[0.2em] uppercase transition-all relative group text-deep-charcoal/80 hover:text-accent-gold"
              whileHover={{ y: -2 }}
            >
              {item}
              <motion.span 
                className="absolute -bottom-1 left-0 h-[1px] bg-accent-gold"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </nav>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(184, 166, 126, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onBeginJourney} 
          className="btn-luxe text-xs" 
          data-testid="nav-cta"
        >
          Enter The Becoming
        </motion.button>
      </div>
    </motion.header>
  );
};

// Hero Section - Powerful and immersive with serene landscape
const HeroSection = ({ onBeginJourney }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden" data-testid="hero-section">
      {/* Serene landscape cover image with parallax */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <img 
          src="/images/hero-cover.png"
          alt="Serene mountain landscape at sunrise"
          className="absolute w-full h-full object-cover"
        />
        {/* Soft overlay for text readability - keeping dreamy atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep-charcoal/40 via-transparent to-deep-charcoal/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-charcoal/20 via-transparent to-deep-charcoal/20" />
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,26,26,0.3)_100%)]" />
      </motion.div>
      
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-24">
        {/* Decorative lines */}
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-accent-gold to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        
        {/* Logo with elegant entrance */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <FloatingElement duration={8}>
            <Logo className="h-56 md:h-72 lg:h-96 w-auto mx-auto mb-10" variant="dark" />
          </FloatingElement>
        </motion.div>
        
        {/* Tagline */}
        <motion.p 
          initial={{ opacity: 0, letterSpacing: "0.2em" }} 
          animate={{ opacity: 1, letterSpacing: "0.5em" }} 
          transition={{ delay: 0.6, duration: 1 }}
          className="font-body text-xs md:text-sm tracking-[0.5em] text-deep-charcoal/80 uppercase mb-8 drop-shadow-sm"
        >
          A Curated Human Experience
        </motion.p>
        
        {/* Main headline - Powerful and emotive */}
        <motion.h1 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-heading text-5xl sm:text-6xl lg:text-8xl xl:text-9xl text-deep-charcoal mb-8 leading-[1.05] drop-shadow-sm"
        >
          You've been waiting<br />
          <motion.em 
            className="text-accent-bronze"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            for this
          </motion.em>
        </motion.h1>
        
        {/* Subheadline - Emotionally engaging */}
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.2, duration: 1 }}
          className="font-body text-lg md:text-xl lg:text-2xl text-deep-charcoal/80 max-w-3xl mx-auto mb-12 leading-relaxed tracking-wide drop-shadow-sm"
        >
          For those who have everything in place, yet feel a quiet stirring within.
          <br className="hidden md:block" />
          <span className="text-deep-charcoal/60">A sacred pause. A return to yourself.</span>
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
        >
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(184, 166, 126, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onBeginJourney} 
            className="btn-luxe text-base md:text-lg px-16 py-6" 
            data-testid="hero-cta"
          >
            Enter The Becoming
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(26,26,26,0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-deep-charcoal/10 backdrop-blur-sm border-2 border-deep-charcoal/40 text-deep-charcoal hover:bg-deep-charcoal/15 text-base md:text-lg px-16 py-6 font-body tracking-[0.15em] uppercase transition-all"
          >
            Discover More
          </motion.button>
        </motion.div>
        
        {/* Scroll indicator - Properly positioned */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 2.2 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-body text-xs text-deep-charcoal/60 tracking-[0.3em] uppercase">Scroll to explore</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-accent-bronze/80 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};

// About Section - Refined with parallax
const AboutSection = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const isImageInView = useInView(imageRef, { once: false, margin: "-100px" });

  return (
    <section id="about" className="py-32 lg:py-48 bg-cream relative overflow-hidden" ref={sectionRef}>
      {/* Subtle animated background */}
      <AnimatedBackground variant="light" />
      
      <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
        <RevealSection className="text-center mb-20">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-[1px] bg-accent-gold mx-auto mb-8"
          />
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="font-body text-xs md:text-sm text-accent-gold uppercase mb-6 tracking-[0.4em]"
          >
            The Essence
          </motion.p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl text-deep-charcoal italic leading-tight">
            What is The Becoming?
          </h2>
        </RevealSection>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <RevealSection delay={0.2}>
            <div className="space-y-8 text-charcoal">
              <p className="text-xl md:text-2xl leading-relaxed font-body">
                The Becoming is a <span className="text-accent-gold font-medium">curated human experience</span> for those who have outgrown their current chapter — not broken, not lost, just quietly ready for more.
              </p>
              
              <div className="py-10 border-y border-sand/60 space-y-4">
                {["retreat", "workshop", "lecture"].map((word, idx) => (
                  <motion.p 
                    key={word}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.15 }}
                    viewport={{ once: true }}
                    className="font-heading text-2xl md:text-3xl text-deep-charcoal flex items-center gap-4"
                  >
                    <span className="w-2 h-2 bg-accent-gold/50 rounded-full" />
                    It is <span className="text-accent-gold mx-2">not</span> a {word}.
                  </motion.p>
                ))}
              </div>
              
              <p className="text-lg md:text-xl leading-relaxed font-body text-charcoal/80">
                No one will teach you how to live. No one is here to fix you. We simply create space for you to remember who you are — beyond roles, beyond expectations, beyond the noise.
              </p>
            </div>
          </RevealSection>
          
          <RevealSection delay={0.4}>
            <motion.div 
              ref={imageRef}
              className="relative aspect-[4/5] overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img 
                src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80" 
                alt="Meditation" 
                className="w-full h-full object-cover"
                style={{
                  scale: isImageInView ? 1 : 1.15,
                  transition: "scale 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/40 via-transparent to-transparent" />
              
              {/* Decorative frame */}
              <div className="absolute top-6 right-6 w-24 h-24 border-t-2 border-r-2 border-accent-gold/40 transition-all duration-500 group-hover:w-28 group-hover:h-28" />
              <div className="absolute bottom-6 left-6 w-24 h-24 border-b-2 border-l-2 border-accent-gold/40 transition-all duration-500 group-hover:w-28 group-hover:h-28" />
            </motion.div>
          </RevealSection>
        </div>

        <RevealSection delay={0.3} className="mt-28 text-center max-w-4xl mx-auto">
          <motion.div
            className="relative"
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl text-accent-gold/20 font-heading">"</div>
            <p className="font-heading text-2xl md:text-3xl lg:text-4xl text-deep-charcoal italic leading-relaxed pt-8">
              No promises. No fixing. No preaching. No selling.
              <br />
              <span className="text-accent-gold">Only experiences that remind you of what's real.</span>
            </p>
          </motion.div>
        </RevealSection>
      </div>
    </section>
  );
};

// Experience Section - Enhanced with animations
const ExperienceSection = () => {
  const experiences = [
    { title: "Nature & Stillness", desc: "Step away from screens. Reconnect with earth, sky, and the rhythm of your breath.", num: "01" },
    { title: "Mindful Movement", desc: "Your body holds wisdom. Learn to listen, move, and release what no longer serves you.", num: "02" },
    { title: "Creative Expression", desc: "Paint, write, sculpt — express what words cannot capture.", num: "03" },
    { title: "Music & Poetry", desc: "Let art move through you. Create or simply receive.", num: "04" },
    { title: "Deep Conversations", desc: "Share and witness honest human stories in a circle of presence.", num: "05" }
  ];

  return (
    <section id="experience" className="py-32 lg:py-48 bg-soft-cream relative overflow-hidden">
      {/* Subtle animated background */}
      <AnimatedBackground variant="light" />
      
      <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
        <RevealSection className="text-center mb-20">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-[1px] bg-accent-gold mx-auto mb-8"
          />
          <p className="font-body text-xs md:text-sm tracking-[0.4em] text-accent-gold uppercase mb-6">The Journey</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl text-deep-charcoal italic leading-tight mb-8">
            What You Will Experience
          </h2>
          <p className="font-body text-charcoal text-lg md:text-xl max-w-2xl mx-auto">
            At The Becoming, you are invited to experience life beyond autopilot — to feel, create, and simply be.
          </p>
        </RevealSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <RevealSection key={index} delay={index * 0.1}>
              <motion.div 
                whileHover={{ y: -12, boxShadow: "0 25px 50px rgba(0,0,0,0.08)" }}
                transition={{ duration: 0.4 }}
                className="p-10 bg-cream border border-sand/50 hover:border-accent-gold/50 transition-all duration-500 group h-full cursor-pointer relative overflow-hidden"
              >
                {/* Hover gradient */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 via-transparent to-accent-bronze/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />
                
                <div className="relative z-10">
                  <motion.span 
                    className="font-body text-5xl font-light text-accent-gold/20 group-hover:text-accent-gold/40 transition-colors duration-500"
                  >
                    {exp.num}
                  </motion.span>
                  <h3 className="font-heading text-2xl md:text-3xl text-deep-charcoal mt-4 mb-4 italic group-hover:text-accent-gold transition-colors duration-300">
                    {exp.title}
                  </h3>
                  <p className="font-body text-charcoal/80 text-base md:text-lg leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
                
                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[40px] border-r-[40px] border-b-accent-gold/10 border-r-transparent group-hover:border-b-accent-gold/30 transition-colors duration-500" />
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// Journey/Who Section - More balanced alignment
const JourneySection = () => {
  const forYouIf = [
    "You're succeeding outwardly, but feel quietly exhausted inside",
    "You sense there's a version of you waiting to emerge",
    "You crave depth over distraction, presence over performance",
    "You're ready to pause the world and listen inward"
  ];

  return (
    <section id="journey" className="py-32 lg:py-48 bg-cream relative overflow-hidden">
      {/* Subtle animated background */}
      <AnimatedBackground variant="light" />
      
      <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <RevealSection>
            <motion.div 
              className="relative aspect-[4/5] overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" 
                alt="Mountains" 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.8 }}
              />
              {/* Decorative frame */}
              <div className="absolute top-6 left-6 w-24 h-24 border-t-2 border-l-2 border-accent-gold/40 transition-all duration-500 group-hover:w-28 group-hover:h-28" />
              <div className="absolute bottom-6 right-6 w-24 h-24 border-b-2 border-r-2 border-accent-gold/40 transition-all duration-500 group-hover:w-28 group-hover:h-28" />
            </motion.div>
          </RevealSection>
          
          <RevealSection delay={0.2}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="h-[1px] bg-accent-gold mb-8"
            />
            <motion.p 
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="font-body text-xs md:text-sm text-accent-gold uppercase mb-6 tracking-[0.4em]"
            >
              Is This For You?
            </motion.p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-deep-charcoal mb-10 italic leading-tight">
              Who is The Becoming For?
            </h2>
            
            <p className="font-body text-charcoal text-lg md:text-xl mb-10 leading-relaxed">
              Working professionals, creators, artists, seekers — anyone between 21-65 who feels ready for something they can't fully name yet.
            </p>
            
            <div className="space-y-4">
              <p className="font-heading text-xl md:text-2xl text-deep-charcoal italic mb-6">This may be for you if...</p>
              {forYouIf.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-5 py-4 border-b border-sand/60 group hover:border-accent-gold/50 transition-colors duration-300"
                >
                  <motion.span 
                    className="w-2 h-2 bg-accent-gold rounded-full mt-2.5 flex-shrink-0"
                    whileHover={{ scale: 1.5 }}
                  />
                  <p className="font-body text-charcoal/80 text-base md:text-lg group-hover:text-deep-charcoal transition-colors">{item}</p>
                </motion.div>
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
  const items = [
    { text: "Stay connected with you long after the experience ends", num: "01" },
    { text: "Remind you of what matters when life gets loud again", num: "02" },
    { text: "A circle of like-minded souls, growing together", num: "03" }
  ];

  return (
    <section className="py-32 lg:py-48 bg-deep-charcoal text-white relative overflow-hidden">
      {/* Subtle animated background for dark section */}
      <AnimatedBackground variant="dark" />

      <div className="max-w-5xl mx-auto px-8 lg:px-16 text-center relative z-10">
        <RevealSection>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-[1px] bg-accent-gold mx-auto mb-8"
          />
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="font-body text-xs md:text-sm text-accent-gold uppercase mb-6 tracking-[0.4em]"
          >
            Beyond The Experience
          </motion.p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl mb-8 italic leading-tight">
            Not Just an Experience.
            <br />
            <span className="text-accent-gold">A Circle.</span>
          </h2>
          <p className="font-body text-white/70 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Beyond the experience itself, The Becoming is the foundation of something larger — a community that values depth over speed, presence over performance, and humanity over hustle.
          </p>
        </RevealSection>

        <RevealSection delay={0.3} className="mt-20 grid md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -10, borderColor: "rgba(184, 166, 126, 0.5)" }}
              transition={{ duration: 0.4 }}
              className="p-10 border border-white/10 transition-all cursor-pointer group relative overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <span className="font-body text-4xl font-light text-accent-gold/30 group-hover:text-accent-gold/50 transition-colors duration-500 block mb-4">{item.num}</span>
              <p className="font-body text-white/75 text-base md:text-lg leading-relaxed group-hover:text-white transition-colors relative z-10">{item.text}</p>
            </motion.div>
          ))}
        </RevealSection>
      </div>
    </section>
  );
};

// FAQ Section - Clean and balanced
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
    <section className="py-32 lg:py-48 bg-soft-cream relative overflow-hidden">
      {/* Subtle animated background */}
      <AnimatedBackground variant="light" />
      
      <div className="max-w-4xl mx-auto px-8 lg:px-16 relative z-10">
        <RevealSection className="text-center mb-16">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="h-[1px] bg-accent-gold mx-auto mb-8"
          />
          <p className="font-body text-xs md:text-sm tracking-[0.4em] text-accent-gold uppercase mb-6">Questions</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-deep-charcoal italic">Frequently Asked</h2>
        </RevealSection>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <RevealSection key={idx} delay={idx * 0.08}>
              <motion.div 
                className="border border-sand/60 bg-cream overflow-hidden"
                whileHover={{ borderColor: "rgba(184, 166, 126, 0.5)" }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                  data-testid={`faq-${idx}`}
                >
                  <span className="font-heading text-lg md:text-xl text-deep-charcoal pr-4 group-hover:text-accent-gold transition-colors">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="w-5 h-5 text-accent-gold flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-8 pb-8 font-body text-charcoal/80 text-base md:text-lg leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section - Impactful
const CTASection = ({ onBeginJourney }) => {
  return (
    <section className="py-32 lg:py-48 bg-cream relative overflow-hidden">
      {/* Subtle animated background */}
      <AnimatedBackground variant="light" />
      {/* Additional center glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,166,126,0.1),transparent_60%)]" />
      
      <RevealSection className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        <FloatingElement duration={10}>
          <Logo className="h-40 md:h-56 mx-auto mb-12" />
        </FloatingElement>
        
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="h-[1px] bg-accent-gold mx-auto mb-8"
        />
        
        <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl text-deep-charcoal mb-8 italic leading-tight">
          Ready to begin your
          <br />
          <span className="text-accent-gold">transformation</span>?
        </h2>
        <p className="font-body text-charcoal/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          If this resonates with you, if you feel that quiet pull — take a moment and tell us who you are.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 25px 60px rgba(184, 166, 126, 0.45)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onBeginJourney} 
          className="btn-luxe text-sm px-16 py-6" 
          data-testid="cta-button"
        >
          Enter The Becoming
        </motion.button>
      </RevealSection>
    </section>
  );
};

// Footer - Refined
const Footer = () => (
  <footer className="py-20 bg-deep-charcoal text-white">
    <div className="max-w-7xl mx-auto px-8 lg:px-16">
      <div className="grid md:grid-cols-3 gap-16 mb-16">
        <div>
          <Logo className="h-20 mb-8" variant="light" />
          <p className="font-body text-white/60 text-base leading-relaxed">A curated human experience for those ready to become real again.</p>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.3em] uppercase text-accent-gold mb-8">Navigate</h4>
          <div className="space-y-4">
            {['About', 'Experience', 'Journey'].map((item) => (
              <motion.button 
                key={item} 
                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="block font-body text-base text-white/60 hover:text-accent-gold transition-colors"
                whileHover={{ x: 5 }}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-body text-xs tracking-[0.3em] uppercase text-accent-gold mb-8">Connect</h4>
          <motion.a 
            href="mailto:hello@thebecoming.in" 
            className="font-body text-base text-white/60 hover:text-accent-gold transition-colors"
            whileHover={{ x: 5 }}
          >
            hello@thebecoming.in
          </motion.a>
        </div>
      </div>
      <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-sm text-white/40 tracking-wide">© {new Date().getFullYear()} The Becoming. All rights reserved.</p>
        <p className="font-body text-sm text-white/40 tracking-wide">
          Powered by <a href="https://techbook.co.in/" target="_blank" rel="noopener noreferrer" className="text-accent-gold hover:text-white transition-colors">Techbook Technologies</a>
        </p>
      </div>
    </div>
  </footer>
);

// Main App
export default function LandingPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

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
