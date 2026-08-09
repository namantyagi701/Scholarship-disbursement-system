import React, { useRef } from 'react';
import { FileText, UserCheck, Banknote, Zap, Shield, CheckCircle, Globe, Settings, LayoutGrid } from 'lucide-react';
import { motion, useScroll, useReducedMotion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Gold contour lines — same motif used on login/landing pages        */
/* ------------------------------------------------------------------ */
const ContourLines = () => (
  <motion.svg
    className="absolute bottom-0 left-0 w-full pointer-events-none"
    style={{ height: '38%' }}
    viewBox="0 0 1440 400"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, ease: 'easeOut' }}
  >
    <path d="M0 320 C120 280, 240 340, 360 300 S600 240, 720 280 S960 340, 1080 290 S1320 240, 1440 270" stroke="#ededf0ff" strokeWidth="0.8" opacity="0.13" />
    <path d="M0 340 C160 310, 280 370, 420 330 S640 270, 780 310 S1000 360, 1140 310 S1340 260, 1440 300" stroke="#ededf0ff" strokeWidth="0.8" opacity="0.10" />
    <path d="M0 360 C200 340, 320 380, 480 350 S680 300, 840 340 S1040 370, 1200 330 S1380 290, 1440 330" stroke="#ededf0ff" strokeWidth="0.8" opacity="0.08" />
    <path d="M0 380 C180 360, 360 400, 540 370 S720 320, 900 360 S1080 390, 1260 350 S1400 310, 1440 355" stroke="#ededf0ff" strokeWidth="0.6" opacity="0.06" />
    <path d="M0 395 C240 385, 400 400, 600 390 S800 370, 1000 390 S1200 400, 1440 390" stroke="#ededf0ff" strokeWidth="0.5" opacity="0.05" />
  </motion.svg>
);

/* ------------------------------------------------------------------ */
/*  Hero Seal Stamp Animation                                          */
/* ------------------------------------------------------------------ */
const SealStamp = () => {
  const shouldReduceMotion = useReducedMotion();

  const stampVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 1.4, y: shouldReduceMotion ? 0 : -15 },
    visible: { 
      opacity: 0.9, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200, delay: 0.3 }
    }
  };

  const bleedVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: [0, 0.15, 0],
      scale: [1, 1.25, 1.35],
      transition: { duration: 0.45, delay: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="absolute -right-4 -top-8 sm:-right-16 sm:-top-12 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none z-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stampVariants}
        className="relative w-full h-full"
      >
        {/* Ink Bleed Ring */}
        {!shouldReduceMotion && (
          <motion.div
            variants={bleedVariants}
            className="absolute inset-1 rounded-full bg-[#B8860B] blur-sm mix-blend-screen"
          />
        )}
        
        {/* Stamp SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-6 drop-shadow-sm">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#B8860B" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="39" fill="none" stroke="#B8860B" strokeWidth="0.8" strokeDasharray="3 2" />
          
          {/* Text along circle */}
          <path id="sealCurve" d="M 16, 50 A 34, 34 0 1, 1 84, 50 A 34, 34 0 1, 1 16, 50" fill="none" />
          <text fill="#B8860B" fontSize="10.5" fontWeight="600" letterSpacing="3.5" fontFamily="monospace">
            <textPath href="#sealCurve" startOffset="3%">
              PMSSS • VERIFIED • PMSSS •
            </textPath>
          </text>
          
          {/* Inner check icon */}
          <path d="M 38,51 L 46,59 L 64,39" fill="none" stroke="#B8860B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0F1729]">
    <ContourLines />
    <motion.div 
      className="relative z-10 w-full max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-16 py-24"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Eyebrow */}
      <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-6">
        PMSSS · Scholarship Disbursement System
      </p>

      {/* Headline */}
      <div className="relative inline-block max-w-[640px] mb-6">
        <h1 className="font-serif-display text-[clamp(2.4rem,6vw,4.5rem)] font-normal leading-[1.08] text-[#FFFEFB]">
          A smarter way to{' '}
          <br className="hidden sm:block" />
          manage scholarships.
        </h1>
        <SealStamp />
      </div>

      {/* Sub-copy */}
      <p className="text-base sm:text-lg text-[#FFFEFB]/40 max-w-[500px] leading-relaxed mb-10">
        From applications to verification and fund release — everything is automated, transparent, and trackable in one secure digital system.
      </p>

      {/* CTA */}
      <a
        href="#features"
        className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#16213E] text-white text-sm font-semibold rounded-sm tracking-wide border border-[#B8860B]/20 hover:bg-[#B8860B] transition-colors duration-300"
      >
        Explore System
      </a>
    </motion.div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Features                                                           */
/* ------------------------------------------------------------------ */
const Features = () => {
  const featureList = [
    { number: '01', title: 'Instant Processing', desc: 'Digital submission, automated verification, and reduced manual workload.', icon: Zap },
    { number: '02', title: 'Student-Friendly UI', desc: 'Designed for easy usage by students, institutes, and government officials.', icon: LayoutGrid },
    { number: '03', title: 'Secure Documents', desc: 'End-to-end encryption ensures safety of personal and financial data.', icon: Shield },
    { number: '04', title: 'Automated Disbursement', desc: 'Eliminate delays with streamlined approval and direct bank transfer tracking.', icon: Settings },
    { number: '05', title: 'Seamless Integration', desc: 'OCR integrated', icon: Globe },
    { number: '06', title: 'Accessible Everywhere', desc: 'Fully responsive portal usable on mobile, laptop, and tablets.', icon: CheckCircle },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFEFB] border-t border-[#DCD6C8]">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-4">
            Capabilities
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#16213E] max-w-md">
            Built for transparent management
          </h2>
          <p className="mt-4 text-sm text-[#16213E]/50 max-w-lg leading-relaxed">
            A secure, scalable platform that supports students and administrators throughout the entire scholarship lifecycle.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#DCD6C8]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {featureList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={idx} 
                className="bg-[#FFFEFB] p-8"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
              >
                <p className="font-mono-data text-xs tracking-[0.15em] text-[#16213E]/30 mb-5">
                  {feature.number}
                </p>
                <Icon className="w-5 h-5 text-[#B8860B] mb-4" strokeWidth={1.5} />
                <h3 className="font-serif-display text-lg font-normal text-[#16213E] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#16213E]/55 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  How It Works — numbered docket stepper                             */
/* ------------------------------------------------------------------ */
const HowItWorks = () => {
  const steps = [
    { number: '01', icon: FileText, title: 'Student Registration & Upload', desc: 'Students apply online, upload documents, and track real-time status.' },
    { number: '02', icon: UserCheck, title: 'Verification & Approval', desc: 'Institutes and authorities verify details digitally through the SAG portal.' },
    { number: '03', icon: Banknote, title: 'Fund Release & Tracking', desc: 'Approved students receive payments directly into their bank accounts.' },
  ];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3] border-t border-[#DCD6C8]">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-4">
            Workflow
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#16213E] max-w-md">
            How disbursement works
          </h2>
        </motion.div>

        {/* Steps — vertical numbered docket stepper */}
        <div className="relative" ref={containerRef}>
          {/* Vertical connector line */}
          <div className="absolute left-[19px] top-4 bottom-12 w-px bg-[#DCD6C8]" aria-hidden="true" />
          
          {/* Animated scroll-drawn thread */}
          <svg className="absolute left-[19px] top-4 bottom-12 w-2 h-[calc(100%-4rem)] -ml-[0.5px] pointer-events-none" aria-hidden="true">
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="#B8860B"
              strokeWidth="1.5"
              strokeOpacity="0.5"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          <motion.div 
            className="space-y-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              return (
                <motion.div 
                  key={index} 
                  className="relative"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                  }}
                >
                  <div className={`flex gap-8 ${!isLast ? 'pb-12' : ''}`}>
                    {/* Number marker */}
                    <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-[#FFFEFB] border border-[#DCD6C8] flex items-center justify-center">
                      <span className="font-mono-data text-xs font-semibold text-[#16213E]">
                        {step.number}
                      </span>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-7">
                      <div className="flex items-start gap-4">
                        <Icon className="w-5 h-5 text-[#B8860B] mt-0.5 shrink-0" strokeWidth={1.5} />
                        <div>
                          <h3 className="font-serif-display text-xl font-normal text-[#16213E] mb-2">
                            {step.title}
                          </h3>
                          <p className="text-sm text-[#16213E]/55 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
const HomePage = () => {
  return (
    <div className="bg-[#FAF8F3] -mt-6">
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
    </div>
  );
};

export default HomePage;
