import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import HowItWorks from '../components/Landing/HowItWorks';
import RoleCards from '../components/Landing/RoleCard';
import Footer from '../components/Footer';
import Header from '../components/Header';

const LandingPage = () => {
  const scrollToRoles = () => {
    document.getElementById('role-selection')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <Header onLoginClick={scrollToRoles} onSignupClick={scrollToRoles} />
        <Hero />
        <RoleCards />
        <Features />
        <HowItWorks />
        <Footer />
      </motion.div>
    </div>
  );
};

export default LandingPage;
