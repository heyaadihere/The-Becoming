import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Loader2, X, ChevronLeft, ChevronRight, Phone, Mail, Instagram, Linkedin, MessageCircle } from 'lucide-react';
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

// Hero images for carousel
const heroImages = [
  { url: "/images/hero-cover.png", alt: "Serene mountain landscape" },
  { url: "https://images.unsplash.com/photo-1758637689126-2598f5b17ceb?w=1920&q=80", alt: "Misty mountains at sunrise" },
  { url: "https://images.unsplash.com/photo-1767591467577-6d10030bc9ce?w=1920&q=80", alt: "Snowy trees at dawn" },
  { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80", alt: "Nature landscape" }
];

// Animated background for sections
// Different background animations for each section

// Floating Orbs - Soft glowing spheres that drift gracefully
const FloatingOrbsBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  // More vibrant gold: 201, 169, 98 instead of 201, 169, 98
  const baseColor = isLight ? "201, 169, 98" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large primary orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          left: "-5%", top: "5%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.18) 0%, rgba(${baseColor}, 0.06) 40%, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 80, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Secondary orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          right: "0%", bottom: "10%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.15) 0%, rgba(${baseColor}, 0.05) 40%, transparent 70%)`,
          filter: "blur(35px)",
        }}
        animate={{ x: [0, -60, 0], y: [0, -50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Small accent orb */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          left: "40%", top: "60%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.12) 0%, transparent 60%)`,
          filter: "blur(25px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
      {/* Floating circles */}
      <motion.div
        className="absolute w-24 h-24 border-2 border-accent-gold/15 rounded-full"
        style={{ left: "15%", top: "30%" }}
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-16 h-16 border border-accent-gold/12 rounded-full"
        style={{ right: "20%", top: "20%" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// Gentle Waves - Horizontal flowing lines with soft glow
const GentleWavesBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  // More vibrant gold
  const baseColor = isLight ? "201, 169, 98" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multiple flowing lines */}
      {[20, 40, 60, 80].map((top, i) => (
        <motion.div
          key={i}
          className="absolute w-[200%] h-[2px]"
          style={{
            top: `${top}%`,
            left: "-50%",
            background: `linear-gradient(90deg, transparent 0%, rgba(${baseColor}, ${0.12 + i * 0.04}) 25%, rgba(${baseColor}, ${0.2 + i * 0.04}) 50%, rgba(${baseColor}, ${0.12 + i * 0.04}) 75%, transparent 100%)`,
          }}
          animate={{ x: ["-25%", "25%", "-25%"] }}
          transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
        />
      ))}
      {/* Floating glow */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          right: "5%", top: "10%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.14) 0%, transparent 60%)`,
          filter: "blur(30px)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full"
        style={{
          left: "10%", bottom: "15%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.1) 0%, transparent 60%)`,
          filter: "blur(25px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
};

// Floating Geometry - Elegant shapes that rotate and drift
const FloatingGeometryBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "201, 169, 98" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large circle */}
      <motion.div
        className="absolute w-48 h-48 border-2 rounded-full"
        style={{ left: "5%", top: "15%", borderColor: `rgba(${baseColor}, 0.12)` }}
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
      {/* Medium square */}
      <motion.div
        className="absolute w-32 h-32 border"
        style={{ right: "10%", top: "25%", borderColor: `rgba(${baseColor}, 0.1)` }}
        animate={{ rotate: [0, 180, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Small diamond */}
      <motion.div
        className="absolute w-20 h-20 border"
        style={{ 
          left: "25%", bottom: "20%", 
          borderColor: `rgba(${baseColor}, 0.15)`,
          transform: "rotate(45deg)"
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Corner accent lines */}
      <motion.div
        className="absolute w-32 h-[1px]"
        style={{ left: "60%", top: "70%", background: `rgba(${baseColor}, 0.15)` }}
        animate={{ scaleX: [0, 1, 0], x: [0, 50, 100] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Floating orb */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          right: "-5%", bottom: "0%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.08) 0%, transparent 60%)`,
          filter: "blur(30px)",
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// Rising Particles - Elegant dots that float upward
const RisingParticlesBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "201, 169, 98" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rising particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${8 + i * 8}%`,
            bottom: "-5%",
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            background: `rgba(${baseColor}, ${0.15 + (i % 4) * 0.05})`,
          }}
          animate={{ 
            y: [0, -800], 
            opacity: [0, 0.8, 0.8, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0]
          }}
          transition={{ 
            duration: 10 + (i % 5) * 3, 
            repeat: Infinity, 
            ease: "easeOut",
            delay: i * 1.5 
          }}
        />
      ))}
      {/* Central glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          left: "50%", top: "50%", 
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.08) 0%, transparent 60%)`,
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Accent circles */}
      <motion.div
        className="absolute w-20 h-20 border border-accent-gold/10 rounded-full"
        style={{ left: "20%", top: "30%" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// Shimmer Background - Rotating gradient with sparkles
const ShimmerBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "201, 169, 98" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large rotating gradient */}
      <motion.div
        className="absolute w-[800px] h-[800px]"
        style={{
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          background: `conic-gradient(from 0deg, transparent, rgba(${baseColor}, 0.06), transparent, rgba(${baseColor}, 0.04), transparent, rgba(${baseColor}, 0.06), transparent)`,
          filter: "blur(20px)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      {/* Shimmer lines */}
      <motion.div
        className="absolute w-40 h-[2px]"
        style={{
          left: "20%", top: "30%",
          background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 0.3), transparent)`,
        }}
        animate={{ x: [0, 200, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-32 h-[2px]"
        style={{
          right: "25%", top: "60%",
          background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 0.25), transparent)`,
        }}
        animate={{ x: [0, -150, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Corner glows */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          left: "-5%", top: "-5%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.1) 0%, transparent 60%)`,
          filter: "blur(30px)",
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full"
        style={{
          right: "-5%", bottom: "-5%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.08) 0%, transparent 60%)`,
          filter: "blur(25px)",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
};

// Pulsing Dots Background - Rhythmic dots with glowing orbs
const PulsingDotsBackground = ({ variant = "light" }) => {
  const isLight = variant === "light";
  const baseColor = isLight ? "201, 169, 98" : "255, 255, 255";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid of pulsing dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${10 + (i % 4) * 25}%`,
            top: `${20 + Math.floor(i / 4) * 40}%`,
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
            background: `rgba(${baseColor}, ${0.15 + (i % 3) * 0.05})`,
          }}
          animate={{ 
            scale: [1, 1.8, 1], 
            opacity: [0.2, 0.6, 0.2] 
          }}
          transition={{ 
            duration: 3 + (i % 3), 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 0.5 
          }}
        />
      ))}
      {/* Large floating orbs */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full"
        style={{
          right: "-10%", bottom: "-15%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.1) 0%, transparent 60%)`,
          filter: "blur(35px)",
        }}
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          left: "-5%", top: "10%",
          background: `radial-gradient(circle, rgba(${baseColor}, 0.08) 0%, transparent 60%)`,
          filter: "blur(30px)",
        }}
        animate={{ scale: [1, 1.2, 1], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Connecting lines effect */}
      <motion.div
        className="absolute w-48 h-[1px]"
        style={{
          left: "30%", top: "50%",
          background: `linear-gradient(90deg, transparent, rgba(${baseColor}, 0.2), transparent)`,
        }}
        animate={{ scaleX: [0, 1, 0], x: [-50, 50] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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

// Fade up animation for text
const FadeUpText = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Scale in animation
const ScaleIn = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide in from side
const SlideIn = ({ children, className = "", direction = "left", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger children animation wrapper
const StaggerContainer = ({ children, className = "", staggerDelay = 0.1 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: staggerDelay }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger item
const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated counter
const AnimatedCounter = ({ value, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className={className}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.span>
      )}
    </motion.span>
  );
};

// Animated line divider
const AnimatedDivider = ({ className = "" }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: "easeInOut" }}
    className={`h-[1px] bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent origin-center ${className}`}
  />
);

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
  const [fieldError, setFieldError] = useState('');
  const [answers, setAnswers] = useState({
    name: '', email: '', phone: '', altPhone: '', socialMedia: '', socialHandle: '',
    whatBringsYou: '', currentPhase: '', seekingGrowth: '', readyFor: '', showUpAs: '',
    timing: '', stayPreference: '', creativeExpression: '', finalThought: ''
  });

  const stepImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=90",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=90",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=90",
    "https://images.unsplash.com/photo-1518173946687-a4c036bc3e77?w=1920&q=90",
  ];

  const questions = [
    { id: 'welcome', type: 'welcome', title: "Welcome to The Becoming", subtitle: "A space for growth, discovery, and transformation" },
    { id: 'name', type: 'text', label: "What should we call you?", hint: "Your first name is perfect.", field: 'name', required: true },
    { id: 'phone', type: 'phone', label: "What's the best number to reach you?", hint: "We'll use this to stay in touch.", field: 'phone', required: true },
    { id: 'whatBringsYou', type: 'single', label: "What brings you here today?", field: 'whatBringsYou',
      options: ['Seeking clarity and direction', 'Ready for personal growth', 'Looking for meaningful connections', 'Curious about self-discovery', 'Ready to learn and evolve', 'Following my intuition'] },
    { id: 'currentPhase', type: 'single', label: "Where are you in your journey right now?", field: 'currentPhase',
      options: ['Beginning a new chapter', 'Growing and expanding', 'Seeking deeper meaning', 'Ready for transformation', 'Open to possibilities', 'Trusting the process'] },
    { id: 'seekingGrowth', type: 'multi', label: "What kind of growth are you seeking?", hint: "Select all that resonate with you.", field: 'seekingGrowth', max: 8,
      options: ['Learning new perspectives', 'Emotional intelligence', 'Creative expression', 'Deeper self-awareness', 'Meaningful connections', 'Inner peace', 'Clarity of purpose', 'Personal transformation'] },
    { id: 'readyFor', type: 'textarea', label: "What are you ready to embrace?", hint: "Share what feels true for you.", field: 'readyFor', placeholder: "I'm ready to..." },
    { id: 'showUpAs', type: 'single', label: "How would you like to show up?", field: 'showUpAs',
      options: ['Open and curious', 'Ready to participate fully', 'Observing and absorbing', 'Eager to connect', 'Present and mindful'] },
    { id: 'timing', type: 'single', label: "When would you like to join us?", field: 'timing', 
      options: ['April 2026', 'July 2026', 'Oct 2026', 'Flexible'] },
    { id: 'investment', type: 'single', label: "When you invest in who you're meant to become, which range feels right?", field: 'investment',
      options: ['\u20B91,75,000 \u2013 \u20B92,25,000', '\u20B92,75,000 \u2013 \u20B93,00,000', '\u20B93,25,000 \u2013 \u20B93,95,000'] },
    { id: 'creativeExpression', type: 'multi', label: "Do you have any creative interests?", hint: "Select all that resonate with you.", field: 'creativeExpression', max: 10,
      options: ['Music', 'Art', 'Writing', 'Poetry', 'Storytelling', 'Dance', 'Photography', 'Theatre', 'Other'] },
    { id: 'contact', type: 'contact', label: "Let's stay connected", hint: "How can we reach you?" },
    { id: 'finalThought', type: 'textarea', label: "Anything else you'd like to share?", hint: "We're listening.", field: 'finalThought', placeholder: "Share your thoughts..." }
  ];

  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const currentQuestion = questions[step];
  const currentImage = stepImages[step % stepImages.length];

  const handleNext = () => {
    if (!canProceed()) {
      if (currentQuestion.type === 'text' && currentQuestion.required) {
        setFieldError('This field is required to continue.');
      } else if (currentQuestion.type === 'phone') {
        setFieldError('Please enter a valid phone number to continue.');
      } else if (currentQuestion.type === 'single') {
        setFieldError('Please select an option to continue.');
      } else if (currentQuestion.type === 'multi') {
        setFieldError('Please select at least one option.');
      } else if (currentQuestion.type === 'contact') {
        if (!answers.email?.includes('@')) setFieldError('Please enter a valid email address.');
        else if (!answers.socialHandle) setFieldError('Please provide at least one social media handle.');
        else setFieldError('Please fill in all required contact fields.');
      }
      return;
    }
    setFieldError('');
    // Save partial form data after each meaningful step
    if (answers.phone && step >= 1) {
      savePartialForm();
    }
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const savePartialForm = async () => {
    try {
      await axios.post(`${API}/partial-signup`, {
        phone: answers.phone,
        name: answers.name || '',
        last_step: currentQuestion.id,
        answers: JSON.stringify(answers)
      });
    } catch (e) { /* silent */ }
  };
  const handleBack = () => { setFieldError(''); if (step > 0) setStep(step - 1); };
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
    if (currentQuestion.type === 'phone') return answers.phone?.length >= 10;
    if (currentQuestion.type === 'text' && currentQuestion.required) return answers[currentQuestion.field]?.trim().length > 0;
    if (currentQuestion.type === 'single') return answers[currentQuestion.field]?.length > 0;
    if (currentQuestion.type === 'contact') return answers.email?.includes('@') && answers.socialHandle?.length > 0;
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
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-cream via-soft-cream to-sand/50 flex items-center justify-center p-8 relative overflow-hidden">
          <FloatingOrbsBackground variant="light" />
          
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
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Logo className="h-40 mx-auto mb-6" variant="dark" />
              </motion.div>
              <motion.div 
                className="w-20 h-20 border-2 border-accent-gold rounded-full flex items-center justify-center mx-auto mb-6 bg-accent-gold/10"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
              >
                <Check className="w-8 h-8 text-accent-gold" />
              </motion.div>
              <motion.h2 
                className="font-serif text-3xl mb-3 text-deep-charcoal"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              >
                You're on Your Way!
              </motion.h2>
              <motion.p 
                className="text-accent-gold font-sans text-lg mb-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              >
                A Becoming bud will call you soon!
              </motion.p>
              <motion.p 
                className="text-charcoal/60 font-sans text-sm mb-8 italic"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              >
                "Every great journey begins with a single, courageous step."
              </motion.p>
              <motion.button 
                onClick={onClose} 
                className="btn-primary" 
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              >
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

              {currentQuestion.type === 'phone' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-2 text-deep-charcoal">{currentQuestion.label}</h2>
                    {currentQuestion.hint && <p className="text-charcoal/50 font-sans text-sm">{currentQuestion.hint}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent-gold" />
                    <input 
                      type="tel" 
                      value={answers.phone || ''} 
                      onChange={(e) => { setAnswers({ ...answers, phone: e.target.value }); setFieldError(''); }} 
                      placeholder="Your phone number" 
                      className={`flex-1 bg-white/50 border-b-2 px-4 py-4 text-lg text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans ${fieldError && (!answers.phone || answers.phone.length < 10) ? 'border-red-400' : 'border-sand'}`} 
                      autoFocus
                    />
                  </div>
                  {fieldError && <p className="text-red-500 font-sans text-sm mt-2" data-testid="field-error">{fieldError}</p>}
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-2 text-deep-charcoal">{currentQuestion.label}</h2>
                    {currentQuestion.hint && <p className="text-charcoal/50 font-sans text-sm">{currentQuestion.hint}</p>}
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={answers[currentQuestion.field] || ''} 
                      onChange={(e) => { setAnswers({ ...answers, [currentQuestion.field]: e.target.value }); setFieldError(''); }} 
                      placeholder={currentQuestion.placeholder || ''} 
                      className={`w-full bg-white/50 border-b-2 px-4 py-4 text-lg text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans ${fieldError && (!answers[currentQuestion.field]?.trim()) ? 'border-red-400' : 'border-sand'}`} 
                      autoFocus
                    />
                    {fieldError && <p className="text-red-500 font-sans text-sm mt-2" data-testid="field-error">{fieldError}</p>}
                  </div>
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
                        onClick={() => { handleSelectSingle(option); setFieldError(''); }}
                        className={`p-4 border-2 cursor-pointer font-sans text-sm transition-all hover:border-accent-gold/50 ${answers[currentQuestion.field] === option ? 'bg-accent-gold/15 border-accent-gold text-deep-charcoal' : 'border-sand bg-white/30 text-charcoal'}`}
                      >
                        {option}
                      </motion.div>
                    ))}
                  </div>
                  {fieldError && <p className="text-red-500 font-sans text-sm" data-testid="field-error">{fieldError}</p>}
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
                          onClick={() => { handleSelectMulti(option); setFieldError(''); }}
                          className={`p-3 border-2 cursor-pointer font-sans text-sm transition-all ${selected ? 'bg-accent-gold/15 border-accent-gold' : 'border-sand bg-white/30 hover:border-accent-gold/50'}`}
                        >
                          {option}
                        </motion.div>
                      );
                    })}
                  </div>
                  {fieldError && <p className="text-red-500 font-sans text-sm" data-testid="field-error">{fieldError}</p>}
                </div>
              )}

              {currentQuestion.type === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-2 text-deep-charcoal">{currentQuestion.label}</h2>
                    <p className="text-charcoal/50 font-sans text-sm">Email and one social media handle are required.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-accent-gold" />
                      <input type="email" value={answers.email || ''} onChange={(e) => { setAnswers({ ...answers, email: e.target.value }); setFieldError(''); }} placeholder="your@email.com *" className={`flex-1 bg-white/50 border-b-2 px-2 py-3 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans ${fieldError && !answers.email?.includes('@') ? 'border-red-400' : 'border-sand'}`} />
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
                            onClick={() => { setAnswers({ ...answers, socialMedia: name }); setFieldError(''); }}
                            className={`flex items-center gap-2 px-4 py-2 border-2 font-sans text-sm transition-all ${answers.socialMedia === name ? 'border-accent-gold bg-accent-gold/15' : 'border-sand hover:border-accent-gold/50'}`}
                          >
                            <Icon className="w-4 h-4" /> {name}
                          </button>
                        ))}
                      </div>
                      <input 
                        type="text" 
                        value={answers.socialHandle || ''} 
                        onChange={(e) => { setAnswers({ ...answers, socialHandle: e.target.value }); setFieldError(''); }} 
                        placeholder={answers.socialMedia ? `Your ${answers.socialMedia} handle *` : "Select a platform first"} 
                        className={`w-full bg-white/50 border-b-2 px-2 py-3 text-deep-charcoal placeholder-charcoal/30 focus:border-accent-gold focus:outline-none font-sans ${fieldError && !answers.socialHandle ? 'border-red-400' : 'border-sand'}`}
                        disabled={!answers.socialMedia}
                      />
                    </div>
                    {fieldError && <p className="text-red-500 font-sans text-sm" data-testid="field-error">{fieldError}</p>}
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
                    <motion.button onClick={handleNext} className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.05 }}>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Experience', 'Journey'];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-3 md:py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex items-center justify-between">
        <Logo className={`${isScrolled ? 'h-10 md:h-16' : 'h-12 md:h-20 lg:h-28'} transition-all`} variant="dark" />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {navItems.map((item) => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })} className="font-sans text-sm tracking-wide text-deep-charcoal/80 hover:text-accent-gold transition-colors">
              {item}
            </button>
          ))}
          <Link to="/contact" className="font-sans text-sm tracking-wide text-deep-charcoal/80 hover:text-accent-gold transition-colors">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <motion.button onClick={onBeginJourney} className="btn-primary text-[10px] md:text-sm px-3 md:px-6 py-1.5 md:py-3" whileHover={{ scale: 1.05 }} data-testid="nav-cta">
            Enter The Becoming
          </motion.button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-deep-charcoal"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }} className="w-full h-0.5 bg-deep-charcoal block" />
              <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="w-full h-0.5 bg-deep-charcoal block" />
              <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }} className="w-full h-0.5 bg-deep-charcoal block" />
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream/98 backdrop-blur-md border-t border-sand"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button 
                  key={item} 
                  onClick={() => { document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 font-sans text-base text-deep-charcoal hover:text-accent-gold transition-colors"
                >
                  {item}
                </button>
              ))}
              <Link 
                to="/contact" 
                className="block w-full text-left py-2 font-sans text-base text-deep-charcoal hover:text-accent-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Hero Section with Image Carousel and Dynamic Content
const HeroSection = ({ onBeginJourney }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 4 different hero content versions that change with images
  const heroSlides = [
    {
      image: heroImages[0]?.url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
      tagline: "A Curated Human Experience",
      headline: "You've always known",
      highlight: "there's more to who you are",
      subtext: "This is where you stop searching and start becoming."
    },
    {
      image: heroImages[1]?.url || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80",
      tagline: "Embrace Your Transformation",
      headline: "The journey within",
      highlight: "begins with a single step",
      subtext: "Discover the path to your authentic self."
    },
    {
      image: heroImages[2]?.url || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80",
      tagline: "Awaken Your Potential",
      headline: "Where learning meets",
      highlight: "transformation",
      subtext: "A sacred space for growth, discovery, and connection."
    },
    {
      image: heroImages[3]?.url || "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80",
      tagline: "Find Your True Self",
      headline: "Not just an experience",
      highlight: "but a becoming",
      subtext: "Join a community of souls ready to evolve together."
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentContent = heroSlides[currentSlide];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" data-testid="hero-section">
      {/* Image Carousel Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={currentContent.image} alt="The Becoming" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/40 to-cream/70" />
        </motion.div>
      </AnimatePresence>

      {/* Image indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-accent-gold w-6' : 'bg-charcoal/30'}`}
          />
        ))}
      </div>
      
      <div className="relative z-10 text-center px-3 md:px-6 max-w-5xl mx-auto pt-20 md:pt-20">
        {/* Text container with subtle backdrop for readability */}
        <div className="bg-cream/75 backdrop-blur-sm rounded-2xl md:rounded-3xl py-6 md:py-12 px-4 md:px-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <Logo className="h-44 sm:h-48 md:h-56 lg:h-72 w-auto mx-auto mb-4 md:mb-6" variant="dark" />
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p className="font-sans text-xs sm:text-sm md:text-lg tracking-[0.15em] md:tracking-[0.3em] text-accent-gold uppercase mb-3 md:mb-4">
                {currentContent.tagline}
              </motion.p>
              
              <motion.h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-deep-charcoal mb-3 md:mb-4 leading-tight">
                {currentContent.headline}<br />
                <span className="text-accent-gold italic">{currentContent.highlight}</span>
              </motion.h1>
              
              <motion.p className="font-sans text-sm md:text-base lg:text-lg text-charcoal max-w-2xl mx-auto mb-6 md:mb-8 px-2">
                {currentContent.subtext}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <motion.button onClick={onBeginJourney} className="btn-primary text-sm md:text-base px-6 md:px-10 py-3 md:py-4 w-full sm:w-auto" whileHover={{ scale: 1.05 }} data-testid="hero-cta">
              Enter The Becoming
            </motion.button>
            <motion.button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary text-sm md:text-base px-6 md:px-10 py-3 md:py-4 w-full sm:w-auto" whileHover={{ scale: 1.05 }}>
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
    <section id="about" className="py-16 md:py-24 lg:py-32 bg-cream relative overflow-hidden">
      <FloatingOrbsBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <FadeUpText>
            <motion.p 
              className="font-sans text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-accent-gold uppercase mb-3 md:mb-4"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              The Essence
            </motion.p>
          </FadeUpText>
          <FadeUpText delay={0.1}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-deep-charcoal mb-4 md:mb-6">
              What is The Becoming?
            </h2>
          </FadeUpText>
          <FadeUpText delay={0.2}>
            <p className="font-sans text-sm md:text-base lg:text-lg text-charcoal/80 max-w-3xl mx-auto px-2">
              The Becoming is a <motion.span 
                className="text-accent-gold font-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >human experience</motion.span> where being ends and becoming begins. A psychological reset designed to bridge the gap between who you are and who you could choose to become, moving from routine repetition to active evolution.
            </p>
          </FadeUpText>
        </div>

        <AnimatedDivider className="mb-10 md:mb-16 max-w-md mx-auto" />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16" staggerDelay={0.15}>
          {[
            { 
              title: "A Space for Growth", 
              desc: "Where learning meets transformation, and every moment becomes an opportunity for discovery.", 
              icon: "01",
              image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=90"
            },
            { 
              title: "A Journey Within", 
              desc: "An invitation to explore your depths, reconnect with your essence, and embrace your potential.", 
              icon: "02",
              image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=90"
            },
            { 
              title: "A Circle of Connection", 
              desc: "A community of like-minded souls, sharing experiences and growing together.", 
              icon: "03",
              image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=90"
            }
          ].map((item, idx) => (
            <StaggerItem key={idx}>
              <motion.div 
                className="bg-white/50 border border-sand hover:border-accent-gold/50 transition-all h-full group cursor-pointer relative overflow-hidden"
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(201, 169, 98, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Content */}
                <div className="p-6">
                  <motion.span 
                    className="font-sans text-4xl text-accent-gold/20 block mb-3 relative z-10"
                    whileHover={{ scale: 1.1, color: "rgba(201, 169, 98, 0.4)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.span>
                  <h3 className="font-serif text-xl text-deep-charcoal mb-2 relative z-10 group-hover:text-accent-gold transition-colors duration-300">{item.title}</h3>
                  <p className="font-sans text-charcoal/70 text-sm relative z-10">{item.desc}</p>
                </div>
                {/* Animated underline */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-[2px] bg-accent-gold"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScaleIn className="text-center">
          <motion.div
            className="py-8 md:py-12 border-t border-b border-sand relative"
          >
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -top-3 w-6 h-6 bg-cream flex items-center justify-center"
            >
              <motion.div 
                className="w-2 h-2 bg-accent-gold rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <AnimatedText 
              text="Only experiences that remind you of what's real." 
              className="font-serif text-lg md:text-2xl lg:text-3xl text-deep-charcoal italic px-4"
            />
          </motion.div>
        </ScaleIn>
      </div>
    </section>
  );
};

// Experience Section - Pyramid Structure with Learning
const ExperienceSection = () => {
  const experiences = [
    { title: "Learning & Unlearning", desc: "The foundation of growth - opening your mind to new perspectives and releasing what no longer serves you.", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=90" },
    { title: "Self-Discovery", desc: "Exploring your inner landscape, understanding your patterns, and embracing your authentic self.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=90" },
    { title: "Creative Expression", desc: "Channeling your emotions and insights through art, music, writing, and movement.", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=90" },
    { title: "Mindful Connection", desc: "Building meaningful relationships with yourself, others, and the world around you.", image: "https://images.unsplash.com/photo-1740065592719-052d3e5ec6fb?w=800&q=90" },
    { title: "Transformation", desc: "The culmination of your journey - stepping into the person you're becoming.", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=90" }
  ];

  return (
    <section id="experience" className="py-16 md:py-24 lg:py-32 bg-soft-cream relative overflow-hidden">
      <GentleWavesBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        {/* Image strip at the top - hide on mobile, show as scroll on tablet+ */}
        <div className="hidden sm:flex gap-2 mb-10 md:mb-16 overflow-hidden">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx} 
              className="flex-1 h-24 md:h-32 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <img src={exp.image} alt={exp.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-10 md:mb-16">
          <FadeUpText>
            <motion.p 
              className="font-sans text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-accent-gold uppercase mb-3 md:mb-4"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              The Journey
            </motion.p>
          </FadeUpText>
          <FadeUpText delay={0.1}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-deep-charcoal mb-4 md:mb-6">
              What You Will Experience
            </h2>
          </FadeUpText>
          {/* Animated tagline with typewriter effect */}
          <motion.p
            className="font-serif text-lg md:text-2xl lg:text-3xl text-charcoal/80 italic px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              No promises.
            </motion.span>{" "}
            <motion.span
              className="text-accent-gold"
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              Only experiences.
            </motion.span>
          </motion.p>
        </div>

        <AnimatedDivider className="mb-8 md:mb-12 max-w-sm mx-auto" />

        {/* Pyramid Structure with enhanced animations */}
        <div className="max-w-4xl mx-auto px-2">
          {experiences.map((exp, idx) => {
            // On mobile, use full width; on desktop, use pyramid
            const width = 100 - (idx * 8);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              >
                <motion.div 
                  className="mx-auto mb-3 md:mb-4 p-4 md:p-6 bg-white/60 border border-sand hover:border-accent-gold/50 transition-all cursor-pointer relative overflow-hidden group"
                  style={{ width: window.innerWidth < 640 ? '100%' : `${width}%` }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(201, 169, 98, 0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated side bar */}
                  <motion.div 
                    className="absolute top-0 left-0 w-1 bg-accent-gold/30 group-hover:bg-accent-gold transition-colors"
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                  />
                  {/* Shimmer effect on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                  <div className="flex items-start gap-3 md:gap-4 relative z-10">
                    <motion.span 
                      className="font-sans text-xl md:text-3xl text-accent-gold/40 font-light flex-shrink-0"
                      whileHover={{ scale: 1.2, color: "rgba(201, 169, 98, 0.8)" }}
                    >
                      {idx + 1}
                    </motion.span>
                    <div>
                      <h3 className="font-serif text-base md:text-lg lg:text-xl text-deep-charcoal mb-1 md:mb-2 group-hover:text-accent-gold transition-colors duration-300">{exp.title}</h3>
                      <p className="font-sans text-charcoal/70 text-xs md:text-sm lg:text-base">{exp.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Journey Section - Who is The Becoming for
const JourneySection = () => {
  const targetAudience = [
    { 
      title: "Working Professionals", 
      desc: "High-functioning externally but feeling paused or restless inside, seeking deeper meaning beyond the daily grind.",
      icon: "01"
    },
    { 
      title: "Creators & Freelancers", 
      desc: "Independent spirits who understand the value of self-investment and are ready to unlock new dimensions of creativity.",
      icon: "02"
    },
    { 
      title: "Artists", 
      desc: "Creative souls seeking inspiration, connection, and the courage to express their authentic voice.",
      icon: "03"
    },
    { 
      title: "Homemakers", 
      desc: "Those who nurture others and are ready to rediscover and nurture themselves.",
      icon: "04"
    }
  ];

  return (
    <section id="journey" className="py-16 md:py-24 lg:py-32 bg-cream relative overflow-hidden">
      <FloatingGeometryBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <FadeUpText>
            <motion.p 
              className="font-sans text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-accent-gold uppercase mb-3 md:mb-4"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Your Tribe Awaits
            </motion.p>
          </FadeUpText>
          <FadeUpText delay={0.1}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-deep-charcoal mb-4 md:mb-6">
              Who Is This For?
            </h2>
          </FadeUpText>
          <FadeUpText delay={0.2}>
            <p className="font-sans text-sm md:text-base lg:text-lg text-charcoal/80 max-w-2xl mx-auto px-2">
              The Becoming welcomes those who are ready to embark on a journey of growth and self-discovery.
            </p>
          </FadeUpText>
        </div>

        <AnimatedDivider className="mb-10 md:mb-16 max-w-md mx-auto" />

        {/* Target Audience Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16" staggerDelay={0.1}>
          {targetAudience.map((audience, idx) => (
            <StaggerItem key={idx}>
              <motion.div 
                className="p-6 md:p-8 bg-white/50 border border-sand hover:border-accent-gold/50 transition-all h-full group cursor-pointer relative overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 15px 40px rgba(201, 169, 98, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Hover gradient */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <motion.span 
                    className="font-sans text-3xl md:text-4xl text-accent-gold/20 block mb-3"
                    whileHover={{ scale: 1.1, color: "rgba(201, 169, 98, 0.4)" }}
                  >
                    {audience.icon}
                  </motion.span>
                  <h3 className="font-serif text-xl md:text-2xl text-deep-charcoal mb-2 group-hover:text-accent-gold transition-colors duration-300">
                    {audience.title}
                  </h3>
                  <p className="font-sans text-sm md:text-base text-charcoal/70">
                    {audience.desc}
                  </p>
                </div>
                
                {/* Animated underline */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-[2px] bg-accent-gold"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* And Maybe YOU - Highlighted Call to Action */}
        <ScaleIn>
          <motion.div 
            className="text-center py-12 md:py-16 px-6 md:px-12 bg-gradient-to-br from-soft-cream to-cream border border-accent-gold/30 relative overflow-hidden"
            whileHover={{ boxShadow: "0 20px 60px rgba(201, 169, 98, 0.2)" }}
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-accent-gold/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-accent-gold/30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
            
            <div className="mb-4" />
            
            <motion.h3 
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-deep-charcoal mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Maybe{" "}
              <motion.span 
                className="text-accent-gold inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                YOU
              </motion.span>
            </motion.h3>
            
            <motion.p 
              className="font-sans text-base md:text-lg text-charcoal/80 max-w-xl mx-auto mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              If something within you resonates with these words, perhaps this journey is calling you.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <motion.button 
                onClick={() => document.querySelector('[data-testid="hero-cta"]')?.click()}
                className="btn-primary text-sm md:text-base px-8 md:px-12 py-3 md:py-4"
                whileHover={{ scale: 1.05 }}
              >
                Begin Your Journey
              </motion.button>
            </motion.div>
          </motion.div>
        </ScaleIn>

        <FadeUpText delay={0.3}>
          <motion.div 
            className="text-center mt-10 md:mt-14 py-6 px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="font-sans text-sm md:text-base text-charcoal/60 max-w-2xl mx-auto italic">
              The Becoming is <span className="text-charcoal/80 font-medium">not</span> for those seeking a party vibe, clinical therapy, or quick-fix transformations.
            </p>
          </motion.div>
        </FadeUpText>
      </div>
    </section>
  );
};

// What It Is / What It Isn't Section
const WhatItIsSection = () => {
  const whatItIs = [
    { title: "Exclusive & Intentional", desc: "A highly curated space limited to exactly 21 individuals." },
    { title: "A Human Experience", desc: "A space where being ends and becoming begins." },
    { title: "A Mirror", desc: "A direct confrontation with the reality of whether you are growing or just growing older." },
    { title: "A Growth Catalyst", desc: "Designed to trigger introspection and a genuine desire to evolve." },
    { title: "A Reset for the Nervous System", desc: "7 days of nature, stillness, and mindful, intentional movement to quiet the internal noise." },
    { title: "A Skill-Building Journey", desc: "An immersive engagement with communication, storytelling, music, poetry, creativity, self-love and more." },
    { title: "A Community", desc: "Of people who are ready to choose their Becoming." }
  ];

  const whatItIsnt = [
    { title: "Not Therapy", desc: "While deep and reflective, it is not a clinical or medical intervention." },
    { title: "Not a Networking Event", desc: "This is not just another networking event. We curate for intention and readiness, not for professional status or titles." },
    { title: "Not a Party Vibe", desc: "This is a space for those seeking depth and a need for a reset, not social entertainment." },
    { title: "Not a Passive Retreat", desc: "You will not just consume content; you will work on yourself and develop new skills." },
    { title: "Not a Quick Fix", desc: "There are no promises of instant transformation; we provide the environment, you provide the effort." },
    { title: "Not a Digital Workspace", desc: "This is a no phone, no device experience. Intentional digital reduction is integral to cultivating presence and clarity." }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-cream relative overflow-hidden">
      <FloatingOrbsBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <FadeUpText>
            <motion.p 
              className="font-sans text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-accent-gold uppercase mb-3 md:mb-4"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              The Anatomy of an Experience
            </motion.p>
          </FadeUpText>
          <FadeUpText delay={0.1}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-deep-charcoal mb-4 md:mb-6">
              What It Is <span className="text-accent-gold">/</span> What It Isn't
            </h2>
          </FadeUpText>
          <FadeUpText delay={0.2}>
            <p className="font-sans text-sm md:text-base lg:text-lg text-charcoal/80 max-w-2xl mx-auto px-2">
              To ensure we curate for the right mindset, it is essential to define the boundaries of The Becoming.
            </p>
          </FadeUpText>
        </div>

        <AnimatedDivider className="mb-10 md:mb-16 max-w-md mx-auto" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* What It Is */}
          <div>
            <FadeUpText>
              <h3 className="font-serif text-xl md:text-2xl text-deep-charcoal mb-6 text-center lg:text-left">
                What It <span className="text-accent-gold italic">Is</span>
              </h3>
            </FadeUpText>
            <StaggerContainer className="space-y-3" staggerDelay={0.08}>
              {whatItIs.map((item, idx) => (
                <StaggerItem key={idx}>
                  <motion.div 
                    className="flex gap-4 p-4 bg-white/40 border border-sand hover:border-accent-gold/40 transition-all group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-accent-gold font-serif text-lg mt-0.5 shrink-0" data-testid={`what-it-is-${idx}`}>+</span>
                    <div>
                      <h4 className="font-serif text-base md:text-lg text-deep-charcoal group-hover:text-accent-gold transition-colors">{item.title}</h4>
                      <p className="font-sans text-sm text-charcoal/70 mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* What It Isn't */}
          <div>
            <FadeUpText>
              <h3 className="font-serif text-xl md:text-2xl text-deep-charcoal mb-6 text-center lg:text-left">
                What It <span className="text-charcoal/40 italic">Isn't</span>
              </h3>
            </FadeUpText>
            <StaggerContainer className="space-y-3" staggerDelay={0.08}>
              {whatItIsnt.map((item, idx) => (
                <StaggerItem key={idx}>
                  <motion.div 
                    className="flex gap-4 p-4 bg-soft-cream/60 border border-sand/60 hover:border-charcoal/20 transition-all group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-charcoal/30 font-serif text-lg mt-0.5 shrink-0" data-testid={`what-it-isnt-${idx}`}>*</span>
                    <div>
                      <h4 className="font-serif text-base md:text-lg text-deep-charcoal group-hover:text-charcoal/70 transition-colors">{item.title}</h4>
                      <p className="font-sans text-sm text-charcoal/60 mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

// Founder Story Section
const FounderStorySection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-soft-cream relative overflow-hidden">
      <GentleWavesBackground variant="light" />
      
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <FadeUpText>
            <motion.p 
              className="font-sans text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-accent-gold uppercase mb-3 md:mb-4"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              The Origin
            </motion.p>
          </FadeUpText>
          <FadeUpText delay={0.1}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-deep-charcoal">
              How It Began
            </h2>
          </FadeUpText>
        </div>

        <AnimatedDivider className="mb-10 md:mb-14 max-w-sm mx-auto" />

        <FadeUpText delay={0.2}>
          <div className="space-y-6 font-sans text-charcoal/80 text-base md:text-lg leading-relaxed">
            <p>
              Somewhere along the way, life became very serious. Calendars filled up. Minds got noisy. Days started repeating themselves. And strangely... even the wins began to feel routine.
            </p>
            <p>
              The Becoming emerged from a very simple observation: <span className="text-deep-charcoal font-medium">Most people are not lost. They're just disconnected</span> from the parts of themselves that once felt light, curious, and fully alive.
            </p>
            <p>
              That version of you still exists. Just buried under deadlines, roles, expectations, and the endless "what's next?"
            </p>
            <p>
              The Becoming is a space created for a different kind of experience. One where you slow down without guilt. Think without pressure. Feel without filters. Laugh without performance. Reflect without heaviness.
            </p>
            <motion.blockquote 
              className="border-l-2 border-accent-gold pl-6 py-2 my-8 font-serif text-lg md:text-xl lg:text-2xl text-deep-charcoal italic"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Because becoming isn't always about fixing something. Sometimes, it's about remembering something.
            </motion.blockquote>
            <p>
              Your clarity. Your playfulness. Your joy. Your depth. Your aliveness.
            </p>
            <p>
              At its heart, The Becoming carries one simple belief: <span className="text-deep-charcoal font-medium">You are not meant to stay one version of yourself forever.</span> Life moves. You evolve. Your inner world expands.
            </p>
            <p className="text-accent-gold font-medium text-lg md:text-xl">
              Because becoming should feel less like pressure, and more like coming alive.
            </p>
          </div>
        </FadeUpText>
      </div>
    </section>
  );
};

// Accommodation Section - Before FAQ
const AccommodationSection = () => {
  const accommodationImages = [
    { url: "https://images.unsplash.com/photo-1748859462647-9acc66c919db?w=1200&q=90", label: "Mountain Sunrise" },
    { url: "https://images.unsplash.com/photo-1759855021430-d6e2121b6928?w=1200&q=90", label: "Monsoon Valley" },
    { url: "https://images.unsplash.com/photo-1665394617059-a6803a41ba60?w=1200&q=90", label: "Beach & Open Sky" },
    { url: "https://images.unsplash.com/photo-1541578870040-09ac67e46304?w=1200&q=90", label: "Starry Night" }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-soft-cream relative overflow-hidden">
      <GentleWavesBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <FadeUpText>
            <motion.p 
              className="font-sans text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-accent-gold uppercase mb-3 md:mb-4"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Your Sanctuary
            </motion.p>
          </FadeUpText>
          <FadeUpText delay={0.1}>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-deep-charcoal mb-4 md:mb-6">
              Accommodation
            </h2>
          </FadeUpText>
          <FadeUpText delay={0.2}>
            <p className="font-sans text-sm md:text-base lg:text-lg text-charcoal/80 max-w-2xl mx-auto px-2">
              Rest and rejuvenate in thoughtfully designed spaces that nurture your journey of transformation.
            </p>
          </FadeUpText>
        </div>

        <AnimatedDivider className="mb-8 md:mb-12 max-w-sm mx-auto" />

        {/* Image Gallery */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8 md:mb-12" staggerDelay={0.1}>
          {accommodationImages.map((img, idx) => (
            <StaggerItem key={idx}>
              <motion.div 
                className="relative aspect-[4/5] overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={img.url} 
                  alt={img.label} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-charcoal/60 to-transparent">
                  <p className="text-white font-sans text-xs md:text-sm tracking-wider">{img.label}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div 
                  className="absolute top-2 md:top-3 left-2 md:left-3 w-6 md:w-8 h-6 md:h-8 border-l-2 border-t-2 border-white/0 group-hover:border-white/60 transition-all duration-300"
                />
                <motion.div 
                  className="absolute bottom-2 md:bottom-3 right-2 md:right-3 w-6 md:w-8 h-6 md:h-8 border-r-2 border-b-2 border-white/0 group-hover:border-white/60 transition-all duration-300"
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {[
            { title: "Serene Surroundings", desc: "Nestled in nature, away from the chaos of everyday life." },
            { title: "Comfortable Spaces", desc: "Thoughtfully designed rooms for rest and reflection." },
            { title: "Nourishing Meals", desc: "Wholesome cuisine that feeds body and soul." }
          ].map((feature, idx) => (
            <FadeUpText key={idx} delay={idx * 0.1}>
              <motion.div 
                className="text-center p-6 bg-white/40 border border-sand hover:border-accent-gold/50 transition-all"
                whileHover={{ y: -5 }}
              >
                <span className="text-3xl text-accent-gold/40 font-serif block mb-3">0{idx + 1}</span>
                <h3 className="font-serif text-xl text-deep-charcoal mb-2">{feature.title}</h3>
                <p className="font-sans text-charcoal/70 text-sm">{feature.desc}</p>
              </motion.div>
            </FadeUpText>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section - Placeholder for Mitin's answers
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "What exactly happens during The Becoming?", a: "The Becoming is a 7-day psychological and creative reset. You step away from routine and into reflection, nature, mindful movement, creative expression, and honest human conversation. There is intentional digital reduction, structured introspection, storytelling, writing, music, and skill-building." },
    { q: "How long is the experience?", a: "7 Days, 6 Nights. Long enough to reset your nervous system. Long enough to create meaningful internal shifts." },
    { q: "Where does it take place?", a: "In a carefully selected, nature-led environment away from city noise. The exact location is shared with confirmed participants to preserve privacy." },
    { q: "What is the investment?", a: "The Becoming is a premium, fully curated experience limited to 21 participants. The investment includes: Accommodation, Curated meals, All creative materials, The full immersive experience, Access to the post-experience community. Exact investment details are shared during the application process." },
    { q: "How are participants selected?", a: "We curate for intention, not status. Selection is based on readiness, your willingness to engage deeply, embrace silence, reduce device use, and actively participate. It is not a party retreat, therapy, or a quick-fix transformation. Only 21 participants are selected per edition." },
    { q: "Is it spiritual or religious?", a: "No. The Becoming is a human experience focused on growth, not aligned with any spiritual or religious practice." },
    { q: "Is it therapy?", a: "No. While deep and reflective, The Becoming is an experience, not a clinical or medical intervention." },
    { q: "Can I come alone?", a: "Yes, absolutely. The focus is on honest human connection with a curated group. Most participants arrive on their own and leave with meaningful connections." }
  ];

  return (
    <section className="py-24 lg:py-32 bg-cream relative overflow-hidden">
      <RisingParticlesBackground variant="light" />
      
      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <FadeUpText>
            <motion.p 
              className="font-sans text-sm tracking-[0.3em] text-accent-gold uppercase mb-4"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              Have Questions?
            </motion.p>
          </FadeUpText>
          <FadeUpText delay={0.1}>
            <h2 className="font-serif text-3xl md:text-4xl text-deep-charcoal">Frequently Asked Questions</h2>
          </FadeUpText>
        </div>

        <AnimatedDivider className="mb-10 max-w-xs mx-auto" />

        <StaggerContainer className="space-y-3" staggerDelay={0.1}>
          {faqs.map((faq, idx) => (
            <StaggerItem key={idx}>
              <motion.div 
                className="border border-sand bg-white/50 overflow-hidden group"
                whileHover={{ borderColor: "rgba(201, 169, 98, 0.5)" }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent-gold/5 transition-colors"
                  data-testid={`faq-${idx}`}
                >
                  <span className="font-serif text-lg text-deep-charcoal pr-4 group-hover:text-accent-gold transition-colors">{faq.q}</span>
                  <motion.span 
                    animate={{ rotate: openIndex === idx ? 45 : 0, scale: openIndex === idx ? 1.2 : 1 }} 
                    className="text-accent-gold text-2xl"
                    transition={{ duration: 0.3 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: "auto", opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }} 
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <motion.p 
                        className="px-6 pb-5 font-sans text-charcoal/70"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {faq.a}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

// CTA Section - Bigger logo, updated content
const CTASection = ({ onBeginJourney }) => {
  return (
    <section className="py-24 lg:py-32 bg-cream relative overflow-hidden">
      <ShimmerBackground variant="light" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <ScaleIn>
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
            >
              <Logo className="h-48 md:h-64 mx-auto mb-10" />
            </motion.div>
          </motion.div>
        </ScaleIn>
        
        <FadeUpText delay={0.2}>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-deep-charcoal mb-6">
            Ready to begin{" "}
            <motion.span 
              className="text-accent-gold italic inline-block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              your journey
            </motion.span>?
          </h2>
        </FadeUpText>
        <FadeUpText delay={0.4}>
          <motion.button 
            onClick={onBeginJourney} 
            className="btn-primary text-base px-12 py-5 relative overflow-hidden group" 
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(201, 169, 98, 0.3)" }} 
            whileTap={{ scale: 0.98 }}
            data-testid="cta-button"
          >
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
            <span className="relative z-10">Enter The Becoming</span>
          </motion.button>
        </FadeUpText>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 border border-accent-gold/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-16 h-16 border border-accent-gold/15"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </section>
  );
};

// Contact Section with required fields - Warm cream theme
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
    <section className="py-20 bg-soft-cream relative overflow-hidden">
      <PulsingDotsBackground variant="light" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col">
            <Logo className="h-48 md:h-56 lg:h-64 mb-10" variant="dark" />
            <p className="font-sans text-charcoal/80 mb-8">
              A curated human experience for those ready to embrace growth and transformation.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-gold/10 flex items-center justify-center rounded-full">
                  <Mail className="w-5 h-5 text-accent-gold" />
                </div>
                <span className="font-sans text-deep-charcoal">enter@thebecoming.in</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-gold/10 flex items-center justify-center rounded-full">
                  <Phone className="w-5 h-5 text-accent-gold" />
                </div>
                <span className="font-sans text-deep-charcoal">enter@thebecoming.in</span>
              </div>
            </div>
            <div className="mt-auto pt-8 border-t border-sand">
              <p className="font-sans text-charcoal/60 text-sm">
                <a href="/privacy-policy" className="hover:text-accent-gold transition-colors">Privacy Policy</a> · 
                <a href="/terms-of-use" className="hover:text-accent-gold transition-colors ml-2">Terms of Use</a>
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="font-serif text-2xl text-deep-charcoal mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/60 border border-sand px-4 py-3 text-deep-charcoal placeholder-charcoal/40 focus:border-accent-gold focus:outline-none font-sans"
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-white/60 border border-sand px-4 py-3 text-deep-charcoal placeholder-charcoal/40 focus:border-accent-gold focus:outline-none font-sans"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full bg-white/60 border border-sand px-4 py-3 text-deep-charcoal placeholder-charcoal/40 focus:border-accent-gold focus:outline-none font-sans"
              />
              <textarea
                placeholder="Your Message *"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                className="w-full bg-white/60 border border-sand px-4 py-3 text-deep-charcoal placeholder-charcoal/40 focus:border-accent-gold focus:outline-none font-sans resize-none flex-1"
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
      </div>
    </section>
  );
};

// Footer Section - Warm cream theme
const FooterSection = () => {
  return (
    <footer className="py-8 bg-cream border-t border-sand">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-16" variant="dark" />
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 font-sans text-sm text-charcoal/60">
            <a href="/refund-policy" className="hover:text-accent-gold transition-colors">Refund Policy</a>
            <span className="hidden sm:inline">·</span>
            <a href="/privacy-policy" className="hover:text-accent-gold transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline">·</span>
            <a href="/terms-of-use" className="hover:text-accent-gold transition-colors">Terms of Use</a>
            <span className="hidden sm:inline">·</span>
            <a href="/cookie-policy" className="hover:text-accent-gold transition-colors">Cookie Policy</a>
          </div>
          <p className="font-sans text-charcoal/60 text-sm text-center">
            © {new Date().getFullYear()} The Becoming. All rights reserved. 
            <span className="mx-2">·</span>
            Powered by <a href="https://techbook.co.in/" target="_blank" rel="noopener noreferrer" className="text-accent-gold hover:underline">Techbook Technologies</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App
export default function LandingPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  return (
    <div className="min-h-screen bg-cream" data-testid="landing-page">
      <Toaster position="top-center" toastOptions={{ style: { background: '#FAF7F2', color: '#1a1a1a', border: '1px solid rgba(201, 169, 98, 0.3)' } }} />
      <Navigation onBeginJourney={() => setShowQuestionnaire(true)} />
      <HeroSection onBeginJourney={() => setShowQuestionnaire(true)} />
      <AboutSection />
      <ExperienceSection />
      <WhatItIsSection />
      <JourneySection />
      <AccommodationSection />
      <FounderStorySection />
      <CTASection onBeginJourney={() => setShowQuestionnaire(true)} />
      <FAQSection />
      <ContactSection />
      <FooterSection />
      <QuestionnaireModal isOpen={showQuestionnaire} onClose={() => setShowQuestionnaire(false)} />
    </div>
  );
}
