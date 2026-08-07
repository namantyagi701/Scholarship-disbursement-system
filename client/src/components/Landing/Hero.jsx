import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import ParticleBackground from '../ui/ParticleBackground';

const Hero = () => {
  const scrollToRoles = () => {
    document.getElementById('role-selection')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FFFEFB]">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-24">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono-data text-xs tracking-[0.2em] uppercase text-blue-600 font-semibold mb-6"
        >
          PMSSS · Scholarship Portal
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-serif-display text-[clamp(2.8rem,7vw,5.5rem)] font-normal leading-[1.05] text-[#16213E] max-w-[700px] mb-8"
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
          className="text-base sm:text-lg text-[#16213E]/70 max-w-[480px] leading-relaxed mb-12"
        >
          A transparent, fully digital platform for application, verification, and disbursement — from submission to payment, in one place.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          onClick={scrollToRoles}
          className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white text-blue-600 border border-blue-200 text-sm font-semibold rounded-full tracking-wide shadow-sm hover:bg-blue-50 transition-colors duration-300 cursor-pointer"
        >
          Get Started
          <ArrowDown className="w-4 h-4 text-blue-600 transition-colors duration-300" />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
