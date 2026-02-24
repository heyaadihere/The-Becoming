import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Loader2, X, ChevronLeft, ChevronRight, Phone, Mail, Instagram, Linkedin, MessageCircle } from 'lucide-react';
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

// Hero images for carousel
const heroImages = [
  { url: "/images/hero-cover.png", alt: "Serene mountain landscape" },
  { url: "https://images.unsplash.com/photo-1758637689126-2598f5b17ceb?w=1920&q=80", alt: "Misty mountains at sunrise" },
  { url: "https://images.unsplash.com/photo-1767591467577-6d10030bc9ce?w=1920&q=80", alt: "Snowy trees at dawn" },
  { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80", alt: "Nature landscape" }
];

// Animated background for sections
// Different background animations for each section
const FloatingOrbsBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "184, 166, 126" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          left: "5%", top: "10%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.08) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          right: "10%", bottom: "20%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.06) 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
};

const GentleWavesBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "184, 166, 126" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-full h-[2px]"
        style={{
          top: "30%",
          background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 0.15), transparent)`,
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-full h-[1px]"
        style={{
          top: "60%",
          background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 0.1), transparent)`,
        }}
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          right: "5%", top: "15%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.05) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const FloatingGeometryBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "184, 166, 126" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-32 h-32 border rounded-full"
        style={{ left: "10%", top: "20%", borderColor: `rgba(${baseColor}, 0.1)` }}
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-20 h-20 border"
        style={{ right: "15%", top: "40%", borderColor: `rgba(${baseColor}, 0.08)` }}
        animate={{ rotate: [0, 90, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-16 h-16"
        style={{ 
          left: "20%", bottom: "25%", 
          borderLeft: `1px solid rgba(${baseColor}, 0.1)`,
          borderBottom: `1px solid rgba(${baseColor}, 0.1)`,
        }}
        animate={{ rotate: [45, 135, 45] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const RisingParticlesBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "184, 166, 126" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${15 + i * 18}%`,
            bottom: "0%",
            background: `rgba(${baseColor}, 0.2)`,
          }}
          animate={{ y: [0, -500], opacity: [0, 0.6, 0] }}
          transition={{ 
            duration: 12 + i * 2, 
            repeat: Infinity, 
            ease: "easeOut",
            delay: i * 3 
          }}
        />
      ))}
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full"
        style={{
          left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.04) 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const ShimmerBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "184, 166, 126" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px]"
        style={{
          left: "-10%", top: "-10%",
          background: `conic-gradient(from 0deg, transparent, rgba(${baseColor}, 0.03), transparent, rgba(${baseColor}, 0.03), transparent)`,
          filter: "blur(30px)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-24 h-[1px]"
        style={{
          right: "20%", top: "40%",
          background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 0.2), transparent)`,
        }}
        animate={{ scaleX: [0, 1, 0], x: [0, 100, 200] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const PulsingDotsBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "184, 166, 126" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${25 + i * 25}%`,
            top: `${30 + i * 15}%`,
            background: `rgba(${baseColor}, 0.15)`,
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 1.5 
          }}
        />
      ))}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          right: "-5%", bottom: "-10%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.05) 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

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

// Animated text component
const AnimatedText = ({ text, className = "" }) => {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Questionnaire Modal with images and animations
const QuestionnaireModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState({
    name: '', email: '', phone: '', altPhone: '', socialMedia: '', socialHandle: '',
    whatBringsYou: '', currentPhase: '', seekingGrowth: '', readyFor: '', showUpAs: '',
    timing: '', stayPreference: '', creativeExpression: '', finalThought: ''
  });

  const stepImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    "https://images.unsplash.com/photo-1518173946687-a4c036bc3e77?w=800&q=80",
  ];

  const questions = [
    { id: 'welcome', type: 'welcome', title: "Welcome to The Becoming", subtitle: "A space for growth, discovery, and transformation" },
    { id: 'name', type: 'text', label: "What should we call you?", hint: "Your first name is perfect.", field: 'name', required: true },
    { id: 'whatBringsYou', type: 'single', label: "What brings you here today?", field: 'whatBringsYou',
      options: ['Seeking clarity and direction', 'Ready for personal growth', 'Looking for meaningful connections', 'Curious about self-discovery', 'Ready to learn and evolve', 'Following my intuition'] },
    { id: 'currentPhase', type: 'single', label: "Where are you in your journey right now?", field: 'currentPhase',
      options: ['Beginning a new chapter', 'Growing and expanding', 'Seeking deeper meaning', 'Ready for transformation', 'Open to possibilities', 'Trusting the process'] },
    { id: 'seekingGrowth', type: 'multi', label: "What kind of growth are you seeking?", hint: "Select all that resonate with you.", field: 'seekingGrowth', max: 4,
      options: ['Learning new perspectives', 'Emotional intelligence', 'Creative expression', 'Deeper self-awareness', 'Meaningful connections', 'Inner peace', 'Clarity of purpose', 'Personal transformation'] },
    { id: 'readyFor', type: 'textarea', label: "What are you ready to embrace?", hint: "Share what feels true for you.", field: 'readyFor', placeholder: "I'm ready to..." },
    { id: 'showUpAs', type: 'single', label: "How would you like to show up?", field: 'showUpAs',
      options: ['Open and curious', 'Ready to participate fully', 'Observing and absorbing', 'Eager to connect', 'Present and mindful'] },
    { id: 'timing', type: 'single', label: "When would you like to join us?", field: 'timing', 
      options: ['April 2026', 'June 2026', 'September 2026', 'I\'m flexible'] },
    { id: 'creativeExpression', type: 'text', label: "Do you have any creative interests?", hint: "Music, art, writing, or anything that moves you.", field: 'creativeExpression', placeholder: "e.g., Playing guitar, writing poetry..." },
    { id: 'contact', type: 'contact', label: "Let's stay connected", hint: "How can we reach you?" },
    { id: 'finalThought', type: 'textarea', label: "Anything else you'd like to share?", hint: "We're listening.", field: 'finalThought', placeholder: "Share your thoughts..." }
  ];

  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const currentQuestion = questions[step];
  const currentImage = stepImages[step % stepImages.length];

  const handleNext = () => { if (step < totalSteps - 1) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };
  const handleSelectSingle = (option) => setAnswers({ ...answers, [currentQuestion.field]: option });
  const handleSelectMulti = (option) => {
    const current = answers[currentQuestion.field] || [];
    if (Array.isArray(current)) {
      if (current.includes(option)) setAnswers({ ...answers, [currentQuestion.field]: current.filter(o => o !== option) });
      else if (current.length < (currentQuestion.max || 10)) setAnswers({ ...answers, [currentQuestion.field]: [...current, option] });
    } else {
      setAnswers({ ...answers, [currentQuestion.field]: [option] });
    }
  };

  const handleSubmit = async () => {
    if (!answers.email || !answers.phone || !answers.socialHandle) {
      toast.error('Please provide email, phone, and at least one social media handle.');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/signup`, {
        name: answers.name, email: answers.email, phone: answers.phone,
        alt_phone: answers.altPhone, social_media: `${answers.socialMedia}: ${answers.socialHandle}`,
        questionnaire_data: JSON.stringify(answers)
      });
      setIsComplete(true);
    } catch (error) { toast.error('Something went wrong. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const canProceed = () => {
    if (currentQuestion.type === 'welcome') return true;
    if (currentQuestion.type === 'text' && currentQuestion.required) return answers[currentQuestion.field]?.trim().length > 0;
    if (currentQuestion.type === 'single') return answers[currentQuestion.field]?.length > 0;
    if (currentQuestion.type === 'contact') return answers.email?.includes('@') && answers.phone?.length >= 10 && answers.socialHandle?.length > 0;
    return true;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex"
      >
        {/* Left side - Image with animation */}
        <motion.div 
          className="hidden lg:block w-1/2 relative overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img 
            key={step}
            src={currentImage}
            alt="Journey"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cream/20" />
        </motion.div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-cream via-soft-cream to-sand/50 flex items-center justify-center p-8 relative">
          <AnimatedBackground variant="light" />
          
          <motion.button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-3 text-charcoal/60 hover:text-deep-charcoal z-10" 
            data-testid="close-questionnaire"
            whileHover={{ scale: 1.1, rotate: 90 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-sand/50">
            <motion.div className="h-full bg-gradient-to-r from-accent-gold to-accent-bronze" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
          </div>
          <div className="absolute top-6 left-6 text-xs text-charcoal/50 font-sans">{step + 1} / {totalSteps}</div>

          {isComplete ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md text-center relative z-10">
              <motion.div 
                className="w-20 h-20 border-2 border-accent-gold rounded-full flex items-center justify-center mx-auto mb-8 bg-cream"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
              >
                <Check className="w-8 h-8 text-accent-gold" />
              </motion.div>
              <h2 className="font-serif text-3xl mb-4 text-deep-charcoal">Your response has been received!</h2>
              <p className="text-charcoal/70 font-sans mb-3">The Becoming awaits you.</p>
              <p className="text-accent-gold font-sans text-lg mb-8">A Becoming bud will call you soon!</p>
              <motion.button onClick={onClose} className="btn-primary" whileHover={{ scale: 1.05 }}>
                Return Home
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg relative z-10">
              {currentQuestion.type === 'welcome' && (
                <div className="text-center">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <Logo className="h-24 mx-auto mb-8" variant="dark" />
                  </motion.div>
                  <motion.h2 className="font-serif text-3xl md:text-4xl mb-4 text-deep-charcoal" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    {currentQuestion.title}
                  </motion.h2>
                  <motion.p className="text-charcoal/60 font-sans mb-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    {currentQuestion.subtitle}
                  </motion.p>
                  <motion.button onClick={handleNext} className="btn-primary" whileHover={{ scale: 1.05 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                    Begin Your Journey <ArrowRight className="inline ml-2 w-4 h-4" />
                  </motion.button>
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-2 text-deep-charcoal">{currentQuestion.label}</h2>
                    {currentQuestion.hint && <p className="text-charcoal/50 font-sans text-sm">{currentQuestion.hint}</p>}
                  </div>
                  <input 
                    type="text" 
                    value={answers[currentQuestion.field] || ''} 
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })} 
                    placeholder={currentQuestion.placeholder || ''} 
                    className="w-full bg-white/50 border-b-2 border-sand px-4 py-4 text-lg text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans" 
                    autoFocus
                  />
                </div>
              )}

              {currentQuestion.type === 'textarea' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-2 text-deep-charcoal">{currentQuestion.label}</h2>
                    {currentQuestion.hint && <p className="text-charcoal/50 font-sans text-sm">{currentQuestion.hint}</p>}
                  </div>
                  <textarea 
                    value={answers[currentQuestion.field] || ''} 
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })} 
                    placeholder={currentQuestion.placeholder || ''} 
                    className="w-full bg-white/50 border border-sand px-4 py-4 text-lg text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans min-h-[120px] resize-none" 
                  />
                </div>
              )}

              {currentQuestion.type === 'single' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl md:text-3xl text-deep-charcoal">{currentQuestion.label}</h2>
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                    {currentQuestion.options.map((option, idx) => (
                      <motion.div 
                        key={option} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelectSingle(option)}
                        className={`p-4 border-2 cursor-pointer font-sans text-sm transition-all hover:border-accent-gold/50 ${answers[currentQuestion.field] === option ? 'bg-accent-gold/15 border-accent-gold text-deep-charcoal' : 'border-sand bg-white/30 text-charcoal'}`}
                      >
                        {option}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {currentQuestion.type === 'multi' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-2 text-deep-charcoal">{currentQuestion.label}</h2>
                    {currentQuestion.hint && <p className="text-charcoal/50 font-sans text-sm">{currentQuestion.hint}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-[45vh] overflow-y-auto">
                    {currentQuestion.options.map((option, idx) => {
                      const selected = Array.isArray(answers[currentQuestion.field]) && answers[currentQuestion.field].includes(option);
                      return (
                        <motion.div 
                          key={option} 
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => handleSelectMulti(option)}
                          className={`p-3 border-2 cursor-pointer font-sans text-sm transition-all ${selected ? 'bg-accent-gold/15 border-accent-gold' : 'border-sand bg-white/30 hover:border-accent-gold/50'}`}
                        >
                          {option}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentQuestion.type === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-2 text-deep-charcoal">{currentQuestion.label}</h2>
                    <p className="text-charcoal/50 font-sans text-sm">Email, phone, and one social media are required.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-accent-gold" />
                      <input type="email" value={answers.email || ''} onChange={(e) => setAnswers({ ...answers, email: e.target.value })} placeholder="your@email.com *" className="flex-1 bg-white/50 border-b-2 border-sand px-2 py-3 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-accent-gold" />
                      <input type="tel" value={answers.phone || ''} onChange={(e) => setAnswers({ ...answers, phone: e.target.value })} placeholder="Phone number *" className="flex-1 bg-white/50 border-b-2 border-sand px-2 py-3 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-charcoal/40" />
                      <input type="tel" value={answers.altPhone || ''} onChange={(e) => setAnswers({ ...answers, altPhone: e.target.value })} placeholder="Alternate phone (optional)" className="flex-1 bg-white/50 border-b-2 border-sand px-2 py-3 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans" />
                    </div>
                    <div className="pt-2">
                      <p className="text-charcoal/60 font-sans text-sm mb-3">Social Media *</p>
                      <div className="flex gap-2 mb-3">
                        {[{ name: 'Instagram', icon: Instagram }, { name: 'LinkedIn', icon: Linkedin }].map(({ name, icon: Icon }) => (
                          <button
                            key={name}
                            onClick={() => setAnswers({ ...answers, socialMedia: name })}
                            className={`flex items-center gap-2 px-4 py-2 border-2 font-sans text-sm transition-all ${answers.socialMedia === name ? 'border-accent-gold bg-accent-gold/15' : 'border-sand hover:border-accent-gold/50'}`}
                          >
                            <Icon className="w-4 h-4" /> {name}
                          </button>
                        ))}
                      </div>
                      <input 
                        type="text" 
                        value={answers.socialHandle || ''} 
                        onChange={(e) => setAnswers({ ...answers, socialHandle: e.target.value })} 
                        placeholder={answers.socialMedia ? `Your ${answers.socialMedia} handle *` : "Select a platform first"} 
                        className="w-full bg-white/50 border-b-2 border-sand px-2 py-3 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans"
                        disabled={!answers.socialMedia}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentQuestion.type !== 'welcome' && (
                <div className="flex justify-between items-center mt-10">
                  <motion.button onClick={handleBack} disabled={step === 0} className="text-charcoal/50 hover:text-deep-charcoal disabled:opacity-20 flex items-center gap-2 font-sans text-sm" whileHover={{ x: -5 }}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </motion.button>
                  {step === totalSteps - 1 ? (
                    <motion.button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                      {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting</> : <>Submit <Check className="w-4 h-4" /></>}
                    </motion.button>
                  ) : (
                    <motion.button onClick={handleNext} disabled={!canProceed()} className="btn-primary flex items-center gap-2 disabled:opacity-50" whileHover={{ scale: 1.05 }}>
                      Continue <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
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
      initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Logo className={`${isScrolled ? 'h-20' : 'h-28'} transition-all`} variant="dark" />
        <nav className="hidden md:flex items-center gap-10">
          {['About', 'Experience', 'Journey'].map((item) => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })} className="font-sans text-sm tracking-wide text-deep-charcoal/80 hover:text-accent-gold transition-colors">
              {item}
            </button>
          ))}
        </nav>
        <motion.button onClick={onBeginJourney} className="btn-primary text-sm" whileHover={{ scale: 1.05 }} data-testid="nav-cta">
          Enter The Becoming
        </motion.button>
      </div>
    </motion.header>
  );
};

// Hero Section with Image Carousel
const HeroSection = ({ onBeginJourney }) => {
  const [currentImage, setCurrentImage] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" data-testid="hero-section">
      {/* Image Carousel Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={heroImages[currentImage].url} alt={heroImages[currentImage].alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/40 to-cream/70" />
        </motion.div>
      </AnimatePresence>

      {/* Image indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentImage ? 'bg-accent-gold w-6' : 'bg-deep-charcoal/30'}`}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
        {/* Text container with subtle backdrop for readability */}
        <div className="bg-cream/70 backdrop-blur-sm rounded-3xl py-12 px-8 md:px-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <Logo className="h-40 md:h-52 lg:h-64 w-auto mx-auto mb-6" variant="dark" />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="font-sans text-base md:text-lg tracking-[0.3em] text-accent-gold uppercase mb-4"
          >
            A Curated Human Experience
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-deep-charcoal mb-4 leading-tight"
          >
            You've always known<br />
            <span className="text-accent-gold italic">there's more to who you are</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="font-sans text-base md:text-lg text-charcoal max-w-2xl mx-auto mb-8"
          >
            This is where you stop searching and start becoming.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button onClick={onBeginJourney} className="btn-primary text-base px-10 py-4" whileHover={{ scale: 1.05 }} data-testid="hero-cta">
              Enter The Becoming
            </motion.button>
            <motion.button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary text-base px-10 py-4" whileHover={{ scale: 1.05 }}>
              Discover More
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// About Section - Positive framing, no yoga image
const AboutSection = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-cream relative overflow-hidden">
      <FloatingOrbsBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <RevealSection className="text-center mb-16">
          <p className="font-sans text-sm tracking-[0.3em] text-accent-gold uppercase mb-4">The Essence</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-deep-charcoal mb-6">
            What is The Becoming?
          </h2>
          <p className="font-sans text-lg text-charcoal/80 max-w-3xl mx-auto">
            The Becoming is a <span className="text-accent-gold font-medium">transformative human experience</span> - 
            a sacred space for those ready to embrace growth, learning, and self-discovery.
          </p>
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { title: "A Space for Growth", desc: "Where learning meets transformation, and every moment becomes an opportunity for discovery." },
            { title: "A Journey Within", desc: "An invitation to explore your depths, reconnect with your essence, and embrace your potential." },
            { title: "A Circle of Connection", desc: "A community of like-minded souls, sharing experiences and growing together." }
          ].map((item, idx) => (
            <RevealSection key={idx} delay={idx * 0.15}>
              <motion.div className="p-8 bg-white/50 border border-sand hover:border-accent-gold/50 transition-all h-full" whileHover={{ y: -5 }}>
                <span className="font-sans text-4xl text-accent-gold/30 block mb-4">0{idx + 1}</span>
                <h3 className="font-serif text-xl text-deep-charcoal mb-3">{item.title}</h3>
                <p className="font-sans text-charcoal/70">{item.desc}</p>
              </motion.div>
            </RevealSection>
          ))}
        </div>

        <RevealSection className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-12 border-t border-b border-sand"
          >
            <AnimatedText 
              text="Only experiences that remind you of what's real." 
              className="font-serif text-2xl md:text-3xl text-deep-charcoal italic"
            />
          </motion.div>
        </RevealSection>
      </div>
    </section>
  );
};

// Experience Section - Pyramid Structure with Learning
const ExperienceSection = () => {
  const experiences = [
    { title: "Learning & Unlearning", desc: "The foundation of growth - opening your mind to new perspectives and releasing what no longer serves you." },
    { title: "Self-Discovery", desc: "Exploring your inner landscape, understanding your patterns, and embracing your authentic self." },
    { title: "Creative Expression", desc: "Channeling your emotions and insights through art, music, writing, and movement." },
    { title: "Mindful Connection", desc: "Building meaningful relationships with yourself, others, and the world around you." },
    { title: "Transformation", desc: "The culmination of your journey - stepping into the person you're becoming." }
  ];

  return (
    <section id="experience" className="py-24 lg:py-32 bg-soft-cream relative overflow-hidden">
      <GentleWavesBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <RevealSection className="text-center mb-16">
          <p className="font-sans text-sm tracking-[0.3em] text-accent-gold uppercase mb-4">The Journey</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-deep-charcoal mb-6">
            What You Will Experience
          </h2>
          {/* Animated tagline */}
          <motion.p
            className="font-serif text-2xl md:text-3xl text-charcoal/80 italic"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              No promises.
            </motion.span>{" "}
            <motion.span
              className="text-accent-gold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              viewport={{ once: true }}
            >
              Only experiences.
            </motion.span>
          </motion.p>
        </RevealSection>

        {/* Pyramid Structure */}
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, idx) => {
            const width = 100 - (idx * 15);
            return (
              <RevealSection key={idx} delay={idx * 0.1}>
                <motion.div 
                  className="mx-auto mb-4 p-6 bg-white/60 border border-sand hover:border-accent-gold/50 transition-all cursor-pointer relative overflow-hidden group"
                  style={{ width: `${width}%` }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(184, 166, 126, 0.15)" }}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold/30 group-hover:bg-accent-gold transition-colors" />
                  <div className="flex items-start gap-4">
                    <span className="font-sans text-2xl text-accent-gold/50 font-light">{idx + 1}</span>
                    <div>
                      <h3 className="font-serif text-lg md:text-xl text-deep-charcoal mb-2">{exp.title}</h3>
                      <p className="font-sans text-charcoal/70 text-sm md:text-base">{exp.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Journey Section - Who it's for with bold YOU
const JourneySection = () => {
  const forYou = [
    "are ready to embrace growth and transformation",
    "seek deeper meaning and purpose in life",
    "want to learn, unlearn, and discover new perspectives",
    "crave authentic connections with like-minded souls",
    "are open to exploring your inner landscape",
    "feel ready to step into your fullest potential"
  ];

  return (
    <section id="journey" className="py-24 lg:py-32 bg-cream relative overflow-hidden">
      <AnimatedBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <RevealSection>
            <motion.div 
              className="relative aspect-[4/5] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" 
                alt="Mountain journey" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream/30 to-transparent" />
            </motion.div>
          </RevealSection>
          
          <RevealSection delay={0.2}>
            <p className="font-sans text-sm tracking-[0.3em] text-accent-gold uppercase mb-4">Is This For You?</p>
            <h2 className="font-serif text-3xl md:text-4xl text-deep-charcoal mb-8">
              This May Be For <span className="text-accent-gold">YOU</span>
            </h2>
            
            <p className="font-sans text-charcoal/80 text-lg mb-8">
              The Becoming welcomes individuals aged 21-65 who are ready to embark on a journey of growth and self-discovery.
            </p>
            
            <div className="space-y-4">
              <p className="font-serif text-xl text-deep-charcoal">Maybe <span className="font-bold text-accent-gold">YOU</span>...</p>
              {forYou.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 py-3 border-b border-sand/60"
                >
                  <span className="w-2 h-2 bg-accent-gold rounded-full mt-2 flex-shrink-0" />
                  <p className="font-sans text-charcoal/80">{item}</p>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
};

// FAQ Section - Placeholder for Mitin's answers
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "What exactly happens during The Becoming?", a: "[Answer to be provided by Mitin]" },
    { q: "How long is the experience?", a: "[Answer to be provided by Mitin]" },
    { q: "Where does it take place?", a: "[Answer to be provided by Mitin]" },
    { q: "What is the investment for this experience?", a: "[Answer to be provided by Mitin]" },
    { q: "How are participants selected?", a: "[Answer to be provided by Mitin]" }
  ];

  return (
    <section className="py-24 lg:py-32 bg-soft-cream relative overflow-hidden">
      <AnimatedBackground variant="light" />
      
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <RevealSection className="text-center mb-12">
          <p className="font-sans text-sm tracking-[0.3em] text-accent-gold uppercase mb-4">Questions</p>
          <h2 className="font-serif text-3xl md:text-4xl text-deep-charcoal">Frequently Asked</h2>
        </RevealSection>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <RevealSection key={idx} delay={idx * 0.08}>
              <div className="border border-sand bg-white/50 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent-gold/5 transition-colors"
                  data-testid={`faq-${idx}`}
                >
                  <span className="font-serif text-lg text-deep-charcoal pr-4">{faq.q}</span>
                  <motion.span animate={{ rotate: openIndex === idx ? 45 : 0 }} className="text-accent-gold text-2xl">+</motion.span>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <p className="px-6 pb-5 font-sans text-charcoal/70">{faq.a}</p>
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

// CTA Section - Bigger logo, updated content
const CTASection = ({ onBeginJourney }) => {
  return (
    <section className="py-24 lg:py-32 bg-cream relative overflow-hidden">
      <AnimatedBackground variant="light" />
      
      <RevealSection className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Logo className="h-48 md:h-64 mx-auto mb-10" />
        </motion.div>
        
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-deep-charcoal mb-6">
          Ready to begin <span className="text-accent-gold italic">your journey</span>?
        </h2>
        <p className="font-sans text-charcoal/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          If something within you resonates with this experience, take the first step. We'd love to hear from you.
        </p>
        <motion.button onClick={onBeginJourney} className="btn-primary text-base px-12 py-5" whileHover={{ scale: 1.05 }} data-testid="cta-button">
          Enter The Becoming
        </motion.button>
      </RevealSection>
    </section>
  );
};

// Contact Section with required fields
const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.phone || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <section className="py-20 bg-deep-charcoal text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <Logo className="h-48 md:h-56 lg:h-64 mb-10" variant="light" />
            <p className="font-sans text-white/70 mb-8">
              A curated human experience for those ready to embrace growth and transformation.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-gold" />
                <span className="font-sans text-white/80">hello@thebecoming.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-gold" />
                <span className="font-sans text-white/80">[Contact Number]</span>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="font-sans text-white/50 text-sm">
                <a href="#" className="hover:text-accent-gold transition-colors">Privacy Policy</a> · 
                <a href="#" className="hover:text-accent-gold transition-colors ml-2">Terms of Service</a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-accent-gold focus:outline-none font-sans"
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-accent-gold focus:outline-none font-sans"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-accent-gold focus:outline-none font-sans"
              />
              <textarea
                placeholder="Your Message *"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-accent-gold focus:outline-none font-sans resize-none"
              />
              <motion.button 
                type="submit" 
                disabled={submitting}
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
              >
                {submitting ? 'Sending...' : 'Submit'}
              </motion.button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="font-sans text-white/50 text-sm">
            © {new Date().getFullYear()} The Becoming. All rights reserved. 
            <span className="mx-2">·</span>
            Powered by <a href="https://techbook.co.in/" target="_blank" rel="noopener noreferrer" className="text-accent-gold hover:underline">Techbook Technologies</a>
          </p>
        </div>
      </div>
    </section>
  );
};

// Main App
export default function LandingPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  return (
    <div className="min-h-screen bg-cream" data-testid="landing-page">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(184, 166, 126, 0.3)' } }} />
      <Navigation onBeginJourney={() => setShowQuestionnaire(true)} />
      <HeroSection onBeginJourney={() => setShowQuestionnaire(true)} />
      <AboutSection />
      <ExperienceSection />
      <JourneySection />
      <FAQSection />
      <CTASection onBeginJourney={() => setShowQuestionnaire(true)} />
      <ContactSection />
      <QuestionnaireModal isOpen={showQuestionnaire} onClose={() => setShowQuestionnaire(false)} />
    </div>
  );
}
