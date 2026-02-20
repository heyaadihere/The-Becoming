import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, ArrowRight, ArrowLeft, Check, Loader2, X, Sparkles, Heart, Leaf, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo component
const Logo = ({ className = "h-12" }) => (
  <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="35" y1="10" x2="35" y2="130" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="70" cy="85" rx="40" ry="45" stroke="currentColor" strokeWidth="2" fill="none"/>
    <text x="52" y="80" fill="currentColor" fontSize="14" fontFamily="serif">the</text>
    <text x="38" y="98" fill="currentColor" fontSize="14" fontFamily="serif">becoming</text>
  </svg>
);

// Video background component
const VideoBackground = () => (
  <div className="video-bg-container">
    <video 
      autoPlay 
      muted 
      loop 
      playsInline
      className="video-bg"
      poster="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80"
    >
      <source src="https://cdn.coverr.co/videos/coverr-fog-in-the-forest-1573/1080p.mp4" type="video/mp4" />
    </video>
    <div className="video-overlay" />
  </div>
);

// Animated section wrapper
const JourneySection = ({ children, className = "", id = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`journey-section ${className}`}
    >
      {children}
    </motion.section>
  );
};

// Questionnaire Modal Component
const QuestionnaireModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState({
    name: '',
    email: '',
    phone: '',
    energyDrain: '',
    cravings: [],
    currentPhase: '',
    selfPerception: '',
    lookingForward: '',
    nextVersion: '',
    growthStyle: '',
    whyNow: '',
    showUp: '',
    timing: '',
    stayPreference: '',
    sport: '',
    creative: '',
    social: '',
    finalStatement: ''
  });

  const questions = [
    {
      id: 'welcome',
      type: 'welcome',
      title: "Let's begin your journey",
      subtitle: "A few questions to understand where you are"
    },
    {
      id: 'name',
      type: 'text',
      label: "What's your name?",
      hint: "First name is enough.",
      field: 'name',
      required: true
    },
    {
      id: 'energyDrain',
      type: 'single',
      label: "One thing that drains your energy lately?",
      hint: "Be honest. This helps us design better.",
      field: 'energyDrain',
      options: [
        'Overthinking everything',
        'Feeling stuck / unclear',
        'Self-doubt creeping in',
        'Too much noise, not enough clarity',
        'Comparing myself to others',
        'Running on autopilot'
      ]
    },
    {
      id: 'cravings',
      type: 'multi',
      label: "What are you craving more of right now?",
      hint: "Pick up to 3 that resonate.",
      field: 'cravings',
      max: 3,
      options: [
        'Mental clarity',
        'Confidence & self-trust',
        'Emotional balance',
        'Direction / purpose',
        'Better relationships',
        'Discipline / consistency',
        'Peace / stillness',
        'Momentum / action'
      ]
    },
    {
      id: 'currentPhase',
      type: 'single',
      label: "Which best describes your current phase?",
      field: 'currentPhase',
      options: [
        'Reinventing myself',
        'Feeling lost but curious',
        'Growing, but inconsistently',
        'Stable, yet restless',
        'Transitioning (career / life / identity)',
        'Honestly… figuring things out'
      ]
    },
    {
      id: 'selfPerception',
      type: 'single',
      label: "When it comes to yourself, you often…",
      field: 'selfPerception',
      options: [
        'Know what to do but don\'t act',
        'Doubt your decisions',
        'Feel capable but scattered',
        'Feel stuck in patterns',
        'Feel disconnected from yourself',
        'Feel ready for something bigger'
      ]
    },
    {
      id: 'lookingForward',
      type: 'textarea',
      label: "What are you looking forward to becoming?",
      hint: "Take a second. There's no right answer.",
      field: 'lookingForward',
      placeholder: "Share your thoughts..."
    },
    {
      id: 'nextVersion',
      type: 'textarea',
      label: "When you imagine your next version… who do you see?",
      hint: "Dream a little.",
      field: 'nextVersion',
      placeholder: "Describe your future self..."
    },
    {
      id: 'growthStyle',
      type: 'single',
      label: "How do you usually approach personal growth?",
      field: 'growthStyle',
      options: [
        'I consume a lot but struggle to apply',
        'I start strong, then fade',
        'I\'m consistent but plateaued',
        'I\'m new to this space',
        'I\'m deeply invested in growth',
        'I grow through experiences, not theory'
      ]
    },
    {
      id: 'whyNow',
      type: 'single',
      label: "Why does this feel like the right time?",
      field: 'whyNow',
      options: [
        'Something needs to change',
        'I\'m tired of repeating patterns',
        'I want deeper self-awareness',
        'I feel ready for expansion',
        'Curiosity / intuition',
        'Perfect timing'
      ]
    },
    {
      id: 'showUp',
      type: 'single',
      label: "If invited, how would you show up?",
      field: 'showUp',
      options: [
        'Curious but cautious',
        'Fully open & engaged',
        'Observing & absorbing',
        'Ready to be challenged',
        'Honestly… not sure yet'
      ]
    },
    {
      id: 'timing',
      type: 'single',
      label: "How soon can you join us?",
      field: 'timing',
      options: ['April 2026', 'June 2026', 'September 2026']
    },
    {
      id: 'stayPreference',
      type: 'single',
      label: "Your type of stay:",
      field: 'stayPreference',
      options: ['Double sharing', 'Triple sharing', 'Open to either']
    },
    {
      id: 'sport',
      type: 'text',
      label: "Do you play any sport?",
      hint: "If yes, what?",
      field: 'sport',
      placeholder: "e.g., Tennis, Yoga, Swimming..."
    },
    {
      id: 'creative',
      type: 'text',
      label: "Do you engage with poetry or play any musical instrument?",
      hint: "If yes, what?",
      field: 'creative',
      placeholder: "e.g., Guitar, Writing poetry..."
    },
    {
      id: 'contact',
      type: 'contact',
      label: "Almost there!",
      hint: "How can we reach you?"
    },
    {
      id: 'social',
      type: 'text',
      label: "Drop your Instagram or LinkedIn",
      hint: "We look at alignment, not follower counts.",
      field: 'social',
      placeholder: "@yourhandle or profile link"
    },
    {
      id: 'finalStatement',
      type: 'single',
      label: "Last one ✨ Which statement feels most like you?",
      field: 'finalStatement',
      options: [
        'I know I\'m capable of more',
        'I feel like I\'ve outgrown my current self',
        'I want clarity more than motivation',
        'I want internal change, not external hacks',
        'I\'m searching for something I can\'t fully name'
      ]
    }
  ];

  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const currentQuestion = questions[step];

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSelectSingle = (option) => {
    setAnswers({ ...answers, [currentQuestion.field]: option });
  };

  const handleSelectMulti = (option) => {
    const current = answers[currentQuestion.field] || [];
    if (current.includes(option)) {
      setAnswers({ ...answers, [currentQuestion.field]: current.filter(o => o !== option) });
    } else if (current.length < (currentQuestion.max || 10)) {
      setAnswers({ ...answers, [currentQuestion.field]: [...current, option] });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Map answers to API format
      const payload = {
        name: answers.name,
        email: answers.email,
        phone: answers.phone || '',
        why_becoming: `Energy drain: ${answers.energyDrain}\nCravings: ${answers.cravings.join(', ')}\nWhy now: ${answers.whyNow}`,
        current_state: `Phase: ${answers.currentPhase}\nSelf-perception: ${answers.selfPerception}\nGrowth style: ${answers.growthStyle}`,
        what_seeking: `Looking forward to: ${answers.lookingForward}\nNext version: ${answers.nextVersion}\nFinal statement: ${answers.finalStatement}`,
        questionnaire_data: JSON.stringify(answers)
      };
      
      await axios.post(`${API}/signup`, payload);
      setIsComplete(true);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentQuestion.type === 'welcome') return true;
    if (currentQuestion.type === 'text' && currentQuestion.required) {
      return answers[currentQuestion.field]?.trim().length > 0;
    }
    if (currentQuestion.type === 'single') {
      return answers[currentQuestion.field]?.length > 0;
    }
    if (currentQuestion.type === 'contact') {
      return answers.email?.includes('@');
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(250, 248, 245, 0.98)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-warm-sand/50 transition-colors"
          data-testid="close-questionnaire"
        >
          <X className="w-6 h-6 text-charcoal" />
        </button>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 progress-bar">
          <motion.div 
            className="progress-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="absolute top-6 left-6 text-sm text-soft-brown font-body">
          {step + 1} / {totalSteps}
        </div>

        {isComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md text-center"
          >
            <div className="w-20 h-20 rounded-full bg-deep-sage/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-deep-sage" />
            </div>
            <h2 className="font-heading text-4xl text-charcoal mb-4">Thank you, {answers.name}</h2>
            <p className="text-soft-brown mb-8">
              Your responses have been received with care. We'll be in touch if The Becoming feels right for you.
            </p>
            <button onClick={onClose} className="btn-journey">
              Return to Journey
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl"
          >
            {/* Welcome step */}
            {currentQuestion.type === 'welcome' && (
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <Sparkles className="w-16 h-16 text-terracotta mx-auto mb-6" />
                </motion.div>
                <h2 className="font-heading text-4xl sm:text-5xl text-charcoal mb-4">{currentQuestion.title}</h2>
                <p className="text-soft-brown text-lg mb-12">{currentQuestion.subtitle}</p>
                <button onClick={handleNext} className="btn-journey text-lg px-10">
                  Let's Begin <ArrowRight className="inline ml-2 w-5 h-5" />
                </button>
              </div>
            )}

            {/* Text input */}
            {currentQuestion.type === 'text' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl sm:text-4xl text-charcoal mb-2">{currentQuestion.label}</h2>
                  {currentQuestion.hint && <p className="text-soft-brown">{currentQuestion.hint}</p>}
                </div>
                <input
                  type="text"
                  value={answers[currentQuestion.field] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })}
                  placeholder={currentQuestion.placeholder || ''}
                  className="form-input text-lg"
                  autoFocus
                  data-testid={`input-${currentQuestion.field}`}
                />
              </div>
            )}

            {/* Textarea */}
            {currentQuestion.type === 'textarea' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl sm:text-4xl text-charcoal mb-2">{currentQuestion.label}</h2>
                  {currentQuestion.hint && <p className="text-soft-brown">{currentQuestion.hint}</p>}
                </div>
                <textarea
                  value={answers[currentQuestion.field] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })}
                  placeholder={currentQuestion.placeholder || ''}
                  className="form-input form-textarea text-lg"
                  autoFocus
                  data-testid={`textarea-${currentQuestion.field}`}
                />
              </div>
            )}

            {/* Single select */}
            {currentQuestion.type === 'single' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl sm:text-4xl text-charcoal mb-2">{currentQuestion.label}</h2>
                  {currentQuestion.hint && <p className="text-soft-brown">{currentQuestion.hint}</p>}
                </div>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.div
                      key={option}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectSingle(option)}
                      className={`option-card ${answers[currentQuestion.field] === option ? 'selected' : ''}`}
                      data-testid={`option-${idx}`}
                    >
                      <div className="option-circle" />
                      <span className="font-body">{option}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Multi select */}
            {currentQuestion.type === 'multi' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl sm:text-4xl text-charcoal mb-2">{currentQuestion.label}</h2>
                  {currentQuestion.hint && <p className="text-soft-brown">{currentQuestion.hint}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = (answers[currentQuestion.field] || []).includes(option);
                    return (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => handleSelectMulti(option)}
                        className={`option-card ${isSelected ? 'selected' : ''}`}
                        data-testid={`multi-option-${idx}`}
                      >
                        <div className="option-circle" />
                        <span className="font-body text-sm">{option}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contact step */}
            {currentQuestion.type === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl sm:text-4xl text-charcoal mb-2">{currentQuestion.label}</h2>
                  {currentQuestion.hint && <p className="text-soft-brown">{currentQuestion.hint}</p>}
                </div>
                <div className="space-y-4">
                  <input
                    type="email"
                    value={answers.email || ''}
                    onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                    placeholder="your@email.com"
                    className="form-input text-lg"
                    data-testid="input-email"
                  />
                  <input
                    type="tel"
                    value={answers.phone || ''}
                    onChange={(e) => setAnswers({ ...answers, phone: e.target.value })}
                    placeholder="Phone (optional)"
                    className="form-input text-lg"
                    data-testid="input-phone"
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {currentQuestion.type !== 'welcome' && (
              <div className="flex justify-between items-center mt-10">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="btn-outline flex items-center gap-2 disabled:opacity-30"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                
                {step === totalSteps - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="btn-journey flex items-center gap-2"
                    data-testid="submit-questionnaire"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                    ) : (
                      <>Complete <Check className="w-5 h-5" /></>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="btn-journey flex items-center gap-2 disabled:opacity-50"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Hero Section
const HeroSection = ({ onBeginReset }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="min-h-screen flex items-center justify-center relative px-6" data-testid="hero-section">
      <motion.div style={{ y, opacity }} className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="mb-8"
        >
          <Logo className="h-20 w-auto mx-auto text-charcoal" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body text-sm tracking-[0.3em] text-terracotta uppercase mb-8"
        >
          A Curated Human Experience
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl text-charcoal mb-6 leading-tight"
        >
          Do you need a <em className="text-terracotta">reset</em>?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-heading text-2xl sm:text-3xl text-soft-brown mb-6 italic"
        >
          The Becoming is an invitation to become real again.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-body text-base text-charcoal/70 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          For those functioning well on the outside, yet inside feeling paused, restless, or quietly lost.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onBeginReset}
            className="btn-journey text-lg"
            data-testid="hero-cta"
          >
            Begin Your Reset
          </button>
          <button
            onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline flex items-center gap-2"
          >
            Explore the Journey <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="w-8 h-8 text-terracotta/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Journey sections with cards
const JourneyContent = ({ onBeginReset }) => {
  const sections = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "What is The Becoming?",
      subtitle: "Not a retreat. Not a workshop. Not a lecture.",
      content: "A curated human experience for those doing what life expects, yet feeling there must be more meaning, more depth, more truth to who they are.",
      highlight: "No promises. No fixing. No preaching. Only experiences."
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: "What You'll Experience",
      subtitle: "Life beyond autopilot",
      items: ["Nature & Stillness", "Mindful Movement", "Reflection & Creativity", "Writing & Music", "Storytelling & Connection"],
      content: "Reconnect with your inner voice and rediscover parts of yourself you might have ignored or never known."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Is This For You?",
      subtitle: "It may be for you if...",
      items: [
        "You're functioning well outside, but feel quietly tired inside",
        "You've been chasing meaning, and suspect meaning has been chasing you",
        "You feel there must be more depth and truth to who you are"
      ]
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: "The Circle",
      subtitle: "Not just an experience",
      content: "Beyond the experience itself, The Becoming is the foundation of a community of like-minded individuals who value depth over speed, presence over performance, and humanity over hustle.",
      highlight: "It's not for now. It's for now and then and again."
    }
  ];

  return (
    <div id="journey" className="py-20">
      {sections.map((section, index) => (
        <JourneySection key={index} className="min-h-[80vh]">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="journey-card text-center"
            >
              <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-6 text-terracotta">
                {section.icon}
              </div>
              
              <p className="font-body text-sm tracking-[0.2em] text-terracotta uppercase mb-4">{section.subtitle}</p>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal mb-6">{section.title}</h2>
              
              {section.content && (
                <p className="font-body text-charcoal/70 leading-relaxed mb-6">{section.content}</p>
              )}
              
              {section.items && (
                <ul className="space-y-3 mb-6">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="font-body text-charcoal/70 flex items-center gap-3 justify-center">
                      <span className="w-2 h-2 rounded-full bg-terracotta" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              
              {section.highlight && (
                <div className="bg-soft-beige/50 rounded-2xl p-6 mt-6">
                  <p className="font-heading text-xl text-charcoal italic">"{section.highlight}"</p>
                </div>
              )}
            </motion.div>
          </div>
        </JourneySection>
      ))}

      {/* CTA Section */}
      <JourneySection className="min-h-[60vh]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-12 h-12 text-terracotta mx-auto mb-6" />
            <h2 className="font-heading text-4xl sm:text-5xl text-charcoal mb-6">Ready for your reset?</h2>
            <p className="font-body text-charcoal/70 mb-10">
              If this resonates with you, if you feel quietly ready, take a moment and tell us who you are.
            </p>
            <button
              onClick={onBeginReset}
              className="btn-journey text-lg px-12"
              data-testid="journey-cta"
            >
              Begin Your Reset
            </button>
          </motion.div>
        </div>
      </JourneySection>
    </div>
  );
};

// Footer
const Footer = () => (
  <footer className="py-16 border-t border-warm-sand">
    <div className="max-w-4xl mx-auto px-6">
      <div className="flex flex-col items-center text-center">
        <Logo className="h-14 w-auto text-charcoal mb-4" />
        <p className="font-body text-sm text-soft-brown mb-6">A curated human experience</p>
        <a href="mailto:hello@thebecoming.in" className="font-body text-terracotta hover:text-soft-brown transition-colors">
          hello@thebecoming.in
        </a>
        <div className="mt-8 pt-8 border-t border-warm-sand w-full">
          <p className="font-body text-xs text-soft-brown">
            © {new Date().getFullYear()} The Becoming. All rights reserved.
          </p>
          <p className="font-body text-xs text-soft-brown mt-2">
            Website powered by{' '}
            <a href="https://techbook.co.in/" target="_blank" rel="noopener noreferrer" className="text-terracotta hover:text-soft-brown transition-colors">
              Techbook Technologies
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

// Main App
export default function LandingPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  return (
    <div className="min-h-screen bg-warm-cream" data-testid="landing-page">
      <VideoBackground />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#faf8f5',
            color: '#3a3a3a',
            border: '1px solid rgba(196, 164, 132, 0.3)'
          }
        }}
      />
      
      <HeroSection onBeginReset={() => setShowQuestionnaire(true)} />
      <JourneyContent onBeginReset={() => setShowQuestionnaire(true)} />
      <Footer />
      
      <QuestionnaireModal 
        isOpen={showQuestionnaire} 
        onClose={() => setShowQuestionnaire(false)} 
      />
    </div>
  );
}
