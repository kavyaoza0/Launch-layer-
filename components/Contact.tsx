import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Magnetic from './Magnetic';
import { useSectionReveal } from '../hooks/useSectionReveal';

interface FormErrors {
  name?: string;
  email?: string;
  description?: string;
}

interface FormTouched {
  name?: boolean;
  email?: boolean;
  description?: boolean;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SERVICE_OPTIONS = [
  'Custom Website (Design & Build)',
  'Web Application & SaaS MVP',
  'Brand Identity & Design System',
  'Building a One-Off Landing Page',
];

interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  rate: number; // multiplier from USD
}

const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)', rate: 1 },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.92 },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', rate: 0.78 },
  { code: 'INR', symbol: '₹', label: 'INR (₹)', rate: 86 },
  { code: 'CAD', symbol: 'CA$', label: 'CAD ($)', rate: 1.38 },
  { code: 'AUD', symbol: 'AU$', label: 'AUD ($)', rate: 1.55 },
];

// Discrete slider steps starting from 150 USD
const PRICE_STEPS_USD = [150, 300, 500, 800, 1200, 1800, 2500, 3500, 5000, 7500, 10000];

const FORMSUBMIT_TOKEN = 'c56fcf57a34660b09918a7e17a03b161';

// Dynamic project scope tier and turnaround metadata
const getScopeMetadata = (usdPrice: number) => {
  if (usdPrice <= 500) {
    return {
      tier: 'RAPID SPRINT',
      turnaround: '5–7 DAYS',
      deliverables: 'Focused Landing Page or Comprehensive UX & Speed Audit',
      badge: 'Brisk Delivery',
    };
  } else if (usdPrice <= 1800) {
    return {
      tier: 'CORE LAUNCH',
      turnaround: '2–3 WEEKS',
      deliverables: 'Complete Bespoke Brand Website with Responsive Architecture',
      badge: 'Flagship Tier',
    };
  } else if (usdPrice <= 5000) {
    return {
      tier: 'CUSTOM APP / MVP',
      turnaround: '3–5 WEEKS',
      deliverables: 'Interactive SaaS MVP, Reactive State Management & Auth',
      badge: 'Product Scale',
    };
  } else {
    return {
      tier: 'BESPOKE PLATFORM',
      turnaround: 'DEDICATED SPRINT',
      deliverables: 'Full-Scale Digital Platform, Bespoke Micro-Engines & Custom Stack',
      badge: 'Executive Suite',
    };
  }
};

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [priceStepIndex, setPriceStepIndex] = useState(0); // Starts at $150
  const [description, setDescription] = useState('');
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [copied, setCopied] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const prefersReducedMotion = useReducedMotion();

  const activeCurrency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const rawUsdPrice = PRICE_STEPS_USD[priceStepIndex];
  const convertedPrice = Math.round((rawUsdPrice * activeCurrency.rate) / 10) * 10 || Math.round(rawUsdPrice * activeCurrency.rate);
  const isMaxStep = priceStepIndex === PRICE_STEPS_USD.length - 1;
  const formattedBudget = `${activeCurrency.symbol}${convertedPrice.toLocaleString()}${isMaxStep ? '+' : ''} (${activeCurrency.code})`;
  const scopeMeta = getScopeMetadata(rawUsdPrice);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('launchlayer.dev@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const validateEmail = (value: string): string | undefined => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Please enter your email so I can reply back.';
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return 'Please enter a valid email address (e.g. name@company.com).';
    }
    return undefined;
  };

  const validateName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Please let me know what name to call you.';
    }
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Please write a brief note about what you would like to build.';
    }
    return undefined;
  };

  const validateAll = (): boolean => {
    const emailErr = validateEmail(email);
    const nameErr = validateName(name);
    const descErr = validateDescription(description);

    const newErrors: FormErrors = {};
    if (emailErr) newErrors.email = emailErr;
    if (nameErr) newErrors.name = nameErr;
    if (descErr) newErrors.description = descErr;

    setErrors(newErrors);
    setTouched({ name: true, email: true, description: true });

    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(val),
      }));
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    setErrors(prev => ({
      ...prev,
      email: validateEmail(email),
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (touched.name) {
      setErrors(prev => ({
        ...prev,
        name: validateName(val),
      }));
    }
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    setErrors(prev => ({
      ...prev,
      name: validateName(name),
    }));
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDescription(val);
    if (touched.description) {
      setErrors(prev => ({
        ...prev,
        description: validateDescription(val),
      }));
    }
  };

  const handleDescBlur = () => {
    setTouched(prev => ({ ...prev, description: true }));
    setErrors(prev => ({
      ...prev,
      description: validateDescription(description),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateAll();
    if (!isValid) {
      return;
    }

    setFormStatus('sending');

    try {
      await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service_interested: service,
          estimated_budget: formattedBudget,
          scope_tier: scopeMeta.tier,
          estimated_turnaround: scopeMeta.turnaround,
          message: description.trim(),
          _subject: `New Project Inquiry from ${name.trim()} (${service} · ${formattedBudget})`,
          _replyto: email.trim(),
          _captcha: "false",
          _template: "table",
        }),
      });
    } catch {
      // Graceful fallback
    }

    setFormStatus('success');
  };

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen, { passive: true });
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Organic spring physics for micro-interactions
  const springConfig = {
    type: 'spring' as const,
    damping: 18,
    stiffness: 70,
    mass: 0.85,
  };

  const { ref: sectionRef, isVisible } = useSectionReveal<HTMLElement>({
    threshold: 0.3,
    once: true,
    staggerInterval: 120,
  });

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      data-reveal-section
      className={`py-14 sm:py-20 md:py-28 lg:py-36 bg-transparent px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32 border-t border-black/[0.05] dark:border-white/[0.08] relative z-10 transition-colors duration-400 section-reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-start">
          
          {/* Left Column: Direct Info & Kinetic Status Accents */}
          <motion.div 
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="lg:sticky lg:top-36">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5 md:mb-6">
                <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.25em] text-black/70 dark:text-white/70 font-semibold flex items-center gap-2">
                  <span>Let's Talk</span>
                  <span className="text-black/30 dark:text-white/30">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] tracking-widest">[DIRECT INQUIRY]</span>
                </span>
                <div className="h-px w-10 sm:w-12 bg-black/15 dark:bg-white/20"></div>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3rem] xl:text-[3.5rem] font-serif italic font-normal mb-4 sm:mb-6 md:mb-7 text-[#0A0A0A] dark:text-[#F9F8F6] leading-[1.08] tracking-normal">
                Start a <br />
                <span className="not-italic font-syne font-extrabold uppercase tracking-tight block mt-1 sm:mt-1.5 text-black/90 dark:text-white/90 text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] xl:text-[2.75rem]">
                  Dialogue.
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-black/75 dark:text-white/75 leading-relaxed mb-6 sm:mb-10 max-w-md">
                Have a project in mind, need advice, or looking for an honest estimate? Share your details and they will go straight to <span className="font-semibold text-black dark:text-white">launchlayer.dev@gmail.com</span>.
              </p>

              <div className="space-y-5 sm:space-y-8 md:space-y-10">
                 {/* Email directly with Silky Magnetic Snap Button */}
                 <div className="space-y-1.5 sm:space-y-2.5">
                   <div className="flex items-center gap-2">
                     <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.2em] text-black/60 dark:text-white/60 block font-semibold">
                       Email Directly
                     </span>
                     <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-black/45 dark:text-white/45">
                       [ZERO MIDDLEMEN]
                     </span>
                   </div>
                   <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
                     <a href="mailto:launchlayer.dev@gmail.com" className="text-base sm:text-xl md:text-2xl font-serif italic font-semibold hover:opacity-60 transition-all premium-link pb-1 text-[#0A0A0A] dark:text-[#F9F8F6] break-all sm:break-normal">
                       launchlayer.dev@gmail.com
                     </a>
                     <Magnetic strength={0.35} tilt={true} tiltStrength={6}>
                       <button
                         type="button"
                         onClick={handleCopyEmail}
                         className="px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#161616] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300 text-xs font-mono uppercase tracking-[0.16em] shadow-2xs hover:shadow-md flex items-center gap-1.5 cursor-pointer text-[#0A0A0A] dark:text-[#F9F8F6] touch-manipulation font-medium active:scale-95"
                       >
                         {copied ? (
                           <>
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                             <span className="text-emerald-500 font-semibold">Copied ✦</span>
                           </>
                         ) : (
                           <>
                             <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                             </svg>
                             <span>Copy</span>
                           </>
                         )}
                       </button>
                     </Magnetic>
                   </div>
                 </div>

                 {/* Social channels */}
                 <div className="space-y-1.5 sm:space-y-2.5">
                   <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.2em] text-black/50 dark:text-white/50 block font-semibold">Social Channels</span>
                   <div className="flex flex-wrap gap-x-5 sm:gap-x-8 gap-y-2 text-xs sm:text-sm md:text-base font-normal">
                     {['LinkedIn', 'Twitter / X', 'GitHub', 'Read.cv'].map((soc) => (
                       <a key={soc} href="#" className="hover:text-black dark:hover:text-white text-black/65 dark:text-white/65 transition-colors premium-link">
                         {soc}
                       </a>
                     ))}
                   </div>
                 </div>

                 {/* Live Architectural Availability Card with Kinetic Radar */}
                 <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] space-y-2.5">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2.5">
                       <span className="relative flex h-2.5 w-2.5">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                       </span>
                       <span className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-black/85 dark:text-white/85">
                         Available for Projects
                       </span>
                     </div>
                     <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                       [Q2/Q3 READY]
                     </span>
                   </div>
                   <p className="text-xs sm:text-sm text-black/65 dark:text-white/65 leading-relaxed">
                     Taking on select bespoke websites and web applications. Typical turnaround timeframes range from 1 to 4 weeks depending on scope.
                   </p>
                   <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-black/45 dark:text-white/45">
                     <span>[AVG RESPONSE SLA: &lt; 3 HRS]</span>
                     <span className="text-emerald-600 dark:text-emerald-400 font-semibold">ACTIVE STATUS</span>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interaction Form with Kinetic Micro-Typography */}
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-7 bg-white dark:bg-[#121212] p-4 sm:p-8 md:p-12 lg:p-14 rounded-2xl sm:rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-400 overflow-hidden"
          >
            {/* Subtle Ambient Border Shimmer */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden pointer-events-none">
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'linear' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent"
              />
            </div>
            
            {formStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="py-8 sm:py-12 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 flex items-center justify-center text-2xl font-mono shadow-sm">
                  ✓
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="text-2xl sm:text-3xl font-serif italic font-semibold text-[#0A0A0A] dark:text-[#F9F8F6]">
                    Thank you, {name}!
                  </h3>
                  <p className="text-sm sm:text-base text-black/75 dark:text-white/75 leading-relaxed">
                    Your inquiry has been received. I will review your project details and get back to you at <span className="font-semibold text-black dark:text-white">{email}</span> within 24 hours.
                  </p>
                </div>

                {/* Inquiry Summary Card */}
                <div className="w-full max-w-md p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/15 text-left space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.16em] text-black/50 dark:text-white/50 border-b border-black/[0.06] dark:border-white/[0.08] pb-2">
                    <span>Inquiry Overview</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Received</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-black/60 dark:text-white/60">Selected Scope</span>
                    <span className="font-medium text-black dark:text-white text-right">{service}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-black/60 dark:text-white/60">Estimated Budget</span>
                    <span className="font-medium text-black dark:text-white">{formattedBudget}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-black/60 dark:text-white/60">Target Tier</span>
                    <span className="font-mono text-xs uppercase font-semibold text-emerald-600 dark:text-emerald-400">{scopeMeta.tier}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col items-center gap-3">
                  <Magnetic strength={0.3} tilt={true}>
                    <button
                      type="button"
                      onClick={() => {
                        setFormStatus('idle');
                        setName('');
                        setEmail('');
                        setDescription('');
                        setPriceStepIndex(0);
                        setErrors({});
                        setTouched({});
                      }}
                      className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono text-xs uppercase tracking-[0.16em] font-semibold hover:opacity-85 transition-opacity cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      Send Another Message
                    </button>
                  </Magnetic>

                  <span className="text-xs font-mono text-black/45 dark:text-white/45">
                    Prefer direct email?{' '}
                    <a href="mailto:launchlayer.dev@gmail.com" className="underline hover:text-black dark:hover:text-white">
                      launchlayer.dev@gmail.com
                    </a>
                  </span>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-8 md:space-y-9">
                
                {/* Field 01: Name with Kinetic Validation Micro-Badge */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="name" className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-black/70 dark:text-white/70 block font-semibold">
                      01. Your Name
                    </label>
                    <div className="flex items-center gap-1.5">
                      {touched.name && !errors.name && name.trim() ? (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold"
                        >
                          <span>[✓ READY]</span>
                        </motion.span>
                      ) : (
                        <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
                          [REQUIRED]
                        </span>
                      )}
                    </div>
                  </div>
                  <input 
                    id="name"
                    type="text" 
                    value={name}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    placeholder="What should I call you?" 
                    className={`w-full bg-transparent border-b py-2 sm:py-3 text-sm sm:text-base md:text-lg font-normal placeholder:text-black/35 dark:placeholder:text-white/35 focus:outline-none transition-all duration-300 text-[#0A0A0A] dark:text-[#F9F8F6] ${
                      touched.name && errors.name 
                        ? 'border-rose-500 dark:border-rose-400 focus:border-rose-600 focus:shadow-[0_1px_0_0_rgba(244,63,94,0.6)]' 
                        : 'border-black/15 dark:border-white/20 focus:border-emerald-500/80 dark:focus:border-emerald-400/80 focus:shadow-[0_1px_0_0_rgba(16,185,129,0.5)]'
                    }`}
                    aria-invalid={touched.name && !!errors.name}
                    aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                  />
                  <AnimatePresence>
                    {touched.name && errors.name && (
                      <motion.div
                        id="name-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1.5 text-xs font-mono text-rose-500 dark:text-rose-400 pt-1"
                      >
                        <span>⚠</span>
                        <span>{errors.name}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Field 02: Email with Kinetic Validation Micro-Badge */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="email" className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-black/70 dark:text-white/70 block font-semibold">
                      02. Your Email
                    </label>
                    <div className="flex items-center gap-1.5">
                      {touched.email && !errors.email && email.trim() ? (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold"
                        >
                          <span>[✓ VERIFIED]</span>
                        </motion.span>
                      ) : (
                        <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
                          [REPLY CHANNEL]
                        </span>
                      )}
                    </div>
                  </div>
                  <input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="Where can I reach you back?" 
                    className={`w-full bg-transparent border-b py-2 sm:py-3 text-sm sm:text-base md:text-lg font-normal placeholder:text-black/35 dark:placeholder:text-white/35 focus:outline-none transition-all duration-300 text-[#0A0A0A] dark:text-[#F9F8F6] ${
                      touched.email && errors.email 
                        ? 'border-rose-500 dark:border-rose-400 focus:border-rose-600 focus:shadow-[0_1px_0_0_rgba(244,63,94,0.6)]' 
                        : 'border-black/15 dark:border-white/20 focus:border-emerald-500/80 dark:focus:border-emerald-400/80 focus:shadow-[0_1px_0_0_rgba(16,185,129,0.5)]'
                    }`}
                    aria-invalid={touched.email && !!errors.email}
                    aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                  />
                  <AnimatePresence>
                    {touched.email && errors.email && (
                      <motion.div
                        id="email-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1.5 text-xs font-mono text-rose-500 dark:text-rose-400 pt-1"
                      >
                        <span>⚠</span>
                        <span>{errors.email}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Field 03: Service Interested Dropdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="service" className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-black/70 dark:text-white/70 block font-semibold">
                      03. Service Interested
                    </label>
                    <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
                      [DISCIPLINE]
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      id="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full appearance-none bg-black/[0.02] dark:bg-white/[0.03] border border-black/15 dark:border-white/20 rounded-xl px-4 py-3 text-sm sm:text-base text-[#0A0A0A] dark:text-[#F9F8F6] focus:outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer font-medium pr-10 hover:border-black/40 dark:hover:border-white/40"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-white dark:bg-[#181818] text-black dark:text-white py-2">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-black/50 dark:text-white/50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Field 04: Kinetic Budget Calculator & Magnetic Currency Switcher */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor="price-slider" className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-black/70 dark:text-white/70 block font-semibold">
                        04. Estimated Investment Bar
                      </label>
                    </div>

                    {/* Currency Selector with Silky Magnetic Snaps */}
                    <div className="w-full sm:w-auto flex items-center justify-between gap-1 sm:gap-1.5 bg-black/[0.04] dark:bg-white/[0.05] p-1 rounded-xl border border-black/10 dark:border-white/15">
                      {CURRENCIES.map((c) => (
                        <Magnetic key={c.code} strength={0.25} className="flex-1 sm:flex-initial">
                          <button
                            type="button"
                            onClick={() => setCurrencyCode(c.code)}
                            className={`w-full px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer text-center font-medium touch-manipulation active:scale-95 ${
                              currencyCode === c.code
                                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                                : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                          >
                            {c.code}
                          </button>
                        </Magnetic>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Kinetic Price Display Card with Real-time Scope Metadata */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/15 flex flex-col gap-3.5 shadow-2xs">
                    <div className="flex items-baseline justify-between flex-wrap gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-black/45 dark:text-white/45 font-medium">
                            Investment Range
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                            [{scopeMeta.tier}]
                          </span>
                        </div>
                        
                        {/* Kinetic Spring-Interpolated Budget Counter */}
                        <div className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-normal text-[#0A0A0A] dark:text-[#F9F8F6] tracking-tight mt-0.5 flex items-baseline">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={`${activeCurrency.code}-${convertedPrice}`}
                              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8, filter: 'blur(3px)' }}
                              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8, filter: 'blur(3px)' }}
                              transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                              className="inline-block"
                            >
                              {activeCurrency.symbol}{convertedPrice.toLocaleString()}{isMaxStep ? '+' : ''}
                            </motion.span>
                          </AnimatePresence>
                          <span className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 not-italic ml-2 font-semibold tracking-wider">
                            {activeCurrency.code}
                          </span>
                        </div>
                      </div>

                      {/* Live Dynamic Turnaround Badge */}
                      <motion.div 
                        key={scopeMeta.turnaround}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-end text-right"
                      >
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Est. {scopeMeta.turnaround}</span>
                        </span>
                        <span className="text-[10px] font-mono text-black/40 dark:text-white/40 mt-1 uppercase">
                          {scopeMeta.badge}
                        </span>
                      </motion.div>
                    </div>

                    {/* Scope Deliverable Highlight */}
                    <div className="py-2 px-3 rounded-xl bg-black/[0.025] dark:bg-white/[0.035] border border-black/5 dark:border-white/10 flex items-center gap-2 text-xs text-black/70 dark:text-white/70">
                      <span className="text-emerald-500 font-mono text-xs">✦</span>
                      <span className="font-sans line-clamp-1">{scopeMeta.deliverables}</span>
                    </div>

                    {/* Interactive Slider Bar */}
                    <div className="relative pt-2 pb-1">
                      <input
                        id="price-slider"
                        type="range"
                        min={0}
                        max={PRICE_STEPS_USD.length - 1}
                        step={1}
                        value={priceStepIndex}
                        onChange={(e) => setPriceStepIndex(Number(e.target.value))}
                        className="w-full h-2.5 bg-black/15 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white focus:outline-none"
                        style={{
                          background: `linear-gradient(to right, #10B981 0%, #10B981 ${(priceStepIndex / (PRICE_STEPS_USD.length - 1)) * 100}%, rgba(120,120,120,0.2) ${(priceStepIndex / (PRICE_STEPS_USD.length - 1)) * 100}%, rgba(120,120,120,0.2) 100%)`
                        }}
                      />
                      
                      {/* Min & Max Indicators with Micro-Typography */}
                      <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-black/40 dark:text-white/40 mt-2 font-medium">
                        <span>Min: {activeCurrency.symbol}{Math.round(150 * activeCurrency.rate).toLocaleString()}</span>
                        <span className="hidden sm:inline">[DRAG BAR TO TUNE ACCORDINGLY]</span>
                        <span>Max: {activeCurrency.symbol}{Math.round(10000 * activeCurrency.rate).toLocaleString()}+</span>
                      </div>
                    </div>

                    {/* Quick Preset Buttons with Magnetic Touch */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 pt-1 border-t border-black/[0.06] dark:border-white/[0.08]">
                      {[0, 2, 4, 6, 8, 10].map((idx) => {
                        const stepUsd = PRICE_STEPS_USD[idx];
                        const stepConverted = Math.round((stepUsd * activeCurrency.rate) / 10) * 10 || Math.round(stepUsd * activeCurrency.rate);
                        const isCurrent = priceStepIndex === idx;
                        return (
                          <Magnetic key={idx} strength={0.2} className="w-full">
                            <button
                              type="button"
                              onClick={() => setPriceStepIndex(idx)}
                              className={`w-full py-1.5 px-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-semibold shadow-xs'
                                  : 'border-transparent text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                            >
                              {activeCurrency.symbol}{stepConverted >= 1000 ? `${(stepConverted / 1000).toFixed(stepConverted % 1000 === 0 ? 0 : 1)}k` : stepConverted}{idx === 10 ? '+' : ''}
                            </button>
                          </Magnetic>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Field 05: Description with Micro-Typography Indicator */}
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="description" className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-black/70 dark:text-white/70 block font-semibold">
                      05. Tell Me About Your Project
                    </label>
                    <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
                      {description.length > 0 ? `[${description.length} CHARS]` : '[BRIEF DETAILS]'}
                    </span>
                  </div>
                  <textarea 
                    id="description"
                    rows={4}
                    value={description}
                    onChange={handleDescChange}
                    onBlur={handleDescBlur}
                    placeholder="Tell me a little about your project, timeline, or goals..." 
                    className={`w-full bg-transparent border-b py-2 sm:py-3 text-sm sm:text-base md:text-lg font-normal placeholder:text-black/35 dark:placeholder:text-white/35 focus:outline-none transition-all duration-300 resize-none text-[#0A0A0A] dark:text-[#F9F8F6] ${
                      touched.description && errors.description 
                        ? 'border-rose-500 dark:border-rose-400 focus:border-rose-600 focus:shadow-[0_1px_0_0_rgba(244,63,94,0.6)]' 
                        : 'border-black/15 dark:border-white/20 focus:border-emerald-500/80 dark:focus:border-emerald-400/80 focus:shadow-[0_1px_0_0_rgba(16,185,129,0.5)]'
                    }`}
                    aria-invalid={touched.description && !!errors.description}
                    aria-describedby={touched.description && errors.description ? 'description-error' : undefined}
                  />
                  <AnimatePresence>
                    {touched.description && errors.description && (
                      <motion.div
                        id="description-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1.5 text-xs font-mono text-rose-500 dark:text-rose-400 pt-1"
                      >
                        <span>⚠</span>
                        <span>{errors.description}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Primary Silky Magnetic Submission Button */}
                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                  <Magnetic strength={0.38} tilt={true} tiltStrength={8} innerParallax={true}>
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="group relative overflow-hidden inline-flex items-center justify-between gap-4 sm:gap-6 px-7 sm:px-9 py-3.5 sm:py-4.5 rounded-full bg-[#0A0A0A] text-[#F9F8F6] dark:bg-[#F9F8F6] dark:text-[#0A0A0A] hover:opacity-95 active:scale-[0.98] transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
                      aria-label="Send Message"
                    >
                      {/* Delicate Light Shimmer Sweep */}
                      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/15 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                      <div className="relative z-10 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.18em] font-semibold">
                          {formStatus === 'sending' ? 'Transmitting Details...' : 'Send Inquiry · Start Dialogue'}
                        </span>
                      </div>

                      <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 dark:bg-black/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                        {formStatus === 'sending' ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </Magnetic>

                  <span className="text-xs font-mono uppercase tracking-[0.16em] text-black/50 dark:text-white/50 font-medium">
                    Direct to launchlayer.dev@gmail.com
                  </span>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
