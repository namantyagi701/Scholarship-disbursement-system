import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Gold contour lines — same motif used on login pages                */
/* ------------------------------------------------------------------ */
const ContourLines = () => (
  <svg
    className="absolute bottom-0 left-0 w-full"
    style={{ height: '38%' }}
    viewBox="0 0 1440 400"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M0 320 C120 280, 240 340, 360 300 S600 240, 720 280 S960 340, 1080 290 S1320 240, 1440 270" stroke="#B8860B" strokeWidth="0.8" opacity="0.13" />
    <path d="M0 340 C160 310, 280 370, 420 330 S640 270, 780 310 S1000 360, 1140 310 S1340 260, 1440 300" stroke="#B8860B" strokeWidth="0.8" opacity="0.10" />
    <path d="M0 360 C200 340, 320 380, 480 350 S680 300, 840 340 S1040 370, 1200 330 S1380 290, 1440 330" stroke="#B8860B" strokeWidth="0.8" opacity="0.08" />
    <path d="M0 380 C180 360, 360 400, 540 370 S720 320, 900 360 S1080 390, 1260 350 S1400 310, 1440 355" stroke="#B8860B" strokeWidth="0.6" opacity="0.06" />
    <path d="M0 395 C240 385, 400 400, 600 390 S800 370, 1000 390 S1200 400, 1440 390" stroke="#B8860B" strokeWidth="0.5" opacity="0.05" />
  </svg>
);

const Hero = () => {
  const scrollToRoles = () => {
    document.getElementById('role-selection')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0F1729]">
      <ContourLines />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-24">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-6"
        >
          PMSSS · Scholarship Portal
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-serif-display text-[clamp(2.8rem,7vw,5.5rem)] font-normal leading-[1.05] text-[#FFFEFB] max-w-[700px] mb-8"
        >
          Your scholarship,{' '}
          <br className="hidden sm:block" />
          simplified.
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-base sm:text-lg text-[#FFFEFB]/45 max-w-[480px] leading-relaxed mb-12"
        >
          A transparent, fully digital platform for application, verification, and disbursement — from submission to payment, in one place.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          onClick={scrollToRoles}
          className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[#16213E] text-white text-sm font-semibold rounded-sm tracking-wide border border-[#B8860B]/20 hover:bg-[#B8860B] transition-colors duration-300 cursor-pointer"
        >
          Get Started
          <ArrowDown className="w-4 h-4 text-[#B8860B] group-hover:text-white transition-colors duration-300" />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
