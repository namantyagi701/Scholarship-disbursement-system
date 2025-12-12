import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    // --- Custom CSS for Animation (Tailwind utility classes are great, but for custom keyframes, we use style) ---
    // In a real project, this would be in your main CSS file (e.g., index.css).
    const customAnimations = (
        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.4, 1);
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
    );

    // --- Sub-components are defined here for a single-file copy-paste experience ---

    const Navbar = () => {
        const [isOpen, setIsOpen] = useState(false);
        const navigate = useNavigate()
        return (
            <nav className= "bg-linear-to-r from-indigo-300 to-indigo-700 shadow-lg fixed w-full z-50 top-0 left-0 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo Area: **ENHANCED Gradient Text** */}
                            <div className="shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                                <img
                                    src={assets.logo}
                                    alt="logo"
                                    className="w-12 h-12 object-contain transition-transform hover:scale-110 duration-300"
                                />

                                <span className="ml-1 text-2xl font-extrabold bg-clip-text text-transparent bg-black tracking-wide drop-shadow-sm hover:tracking-widest transition-all duration-300">SSP</span>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#how-it-works" className="text-gray-900 hover:text-white font-medium transition duration-200">How it Works</a>
                            <a href="#features" className="text-gray-900 hover:text-white font-medium transition duration-200">Features</a>
                            <a href="#benefits" className="text-gray-900 hover:text-white font-medium transition duration-200">Benefits</a>

                            {/* --- ACTION BUTTONS --- */}
                            <button onClick={() => navigate('/login')} className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-semibold transition duration-300 shadow-xl hover:shadow-blue-500/50 transform hover:-translate-y-0.5">
                                Get Started
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 transition duration-200">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full transition-all duration-300">
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            <a href="#how-it-works" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition">How it Works</a>
                            <a href="#features" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition">Features</a>
                            <a href="#benefits" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition">Benefits</a>
                            <div className="mt-6 flex flex-col gap-3 px-3">
                                <button className="w-full text-center bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg">Get Started</button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    };

    const Hero = () => {
        return (
            <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-36 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Text Content */}
                        <div className="text-center lg:text-left z-10">
                            {/* **ENHANCED Heading** */}
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                                Scholarships Made <br className="hidden md:inline"/>
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-cyan-500 hover:opacity-90 transition-opacity">Digital & Seamless</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                This Digital Portal enables students to submit documents online. SAG Bureau verifies them digitally, and Finance Bureau releases payments directly.
                            </p>

                            {/* --- ACTION BUTTONS --- */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {/* **ENHANCED Button Style** */}
                                <button className="px-10 py-4 text-lg font-extrabold text-white bg-blue-700 rounded-xl shadow-2xl shadow-blue-500/50 hover:bg-blue-800 transition transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-300">
                                    Apply Now
                                </button>
                            </div>

                            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-6 text-sm font-semibold text-gray-700">
                                <div className="flex items-center gap-2 hover:text-green-700 transition">
                                    <div className="p-1 bg-green-100 rounded-full"><svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg></div>
                                    Secure & Encrypted
                                </div>
                                <div className="flex items-center gap-2 hover:text-green-700 transition">
                                    <div className="p-1 bg-green-100 rounded-full"><svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg></div>
                                    100% Paperless
                                </div>
                            </div>
                        </div>

                        {/* Right Side UI Mockup **(Enhanced Shadows/Rotation)** */}
                        <div className="relative z-10 hidden lg:block perspective-1000">
                            {/* Decorative blobs (requires customAnimations style block) */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
                            <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

                            <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-300/60 border border-gray-200 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                                {/* Mockup Header */}
                                <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="h-2 w-32 bg-gray-300 rounded-full opacity-50"></div>
                                </div>
                                {/* Mockup Body */}
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-6 w-48 bg-gray-800 rounded"></div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-md">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                    </div>

                                    {/* Status Steps - **Refined Colors/Shadows** */}
                                    <div className="space-y-4">
                                        <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm">
                                            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center mr-4 font-bold text-base shadow-lg">✓</div>
                                            <div>
                                                <div className="text-base font-bold text-gray-800">Document Uploaded</div>
                                                <div className="text-sm text-green-700">Successfully submitted by Student</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                                            <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center mr-4 animate-pulse shadow-lg">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                            </div>
                                            <div>
                                                <div className="text-base font-bold text-gray-800">SAG Verification</div>
                                                <div className="text-sm text-blue-700">In Progress - Bureau Checking</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-4 bg-gray-100 rounded-xl border border-gray-200 opacity-80">
                                            <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center mr-4 font-bold text-base">3</div>
                                            <div>
                                                <div className="text-base font-bold text-gray-800">Payment Release</div>
                                                <div className="text-sm text-gray-600">Pending Approval</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        );
    };

    const HowItWorks = () => {
        const steps = [
            {
                id: 1,
                title: "Student Uploads",
                desc: "Students log in to the portal and securely upload their required scholarship documents.",
                icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                )
            },
            {
                id: 2,
                title: "SAG Verification",
                desc: "The SAG Bureau reviews the digital documents. Automated checks ensure validity.",
                icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                )
            },
            {
                id: 3,
                title: "Finance Release",
                desc: "Once approved, the Finance Bureau processes the scholarship and releases funds directly.",
                icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                )
            }
        ];

        return (
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-blue-700 font-bold tracking-widest uppercase text-sm mb-2">WORKFLOW</h2>
                        <h3 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">How the System Works</h3>
                        <p className="mt-4 text-gray-500 max-w-3xl mx-auto text-xl">
                            A seamless three-step digital process designed to eliminate paperwork and delays.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop Only) **Refined Positioning** */}
                        <div className="hidden md:block absolute top-10 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-gray-200 z-0"></div>

                        {steps.map((step) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
                                {/* Icon Container **Enhanced 3D effect and shadow** */}
                                <div className="w-20 h-20 bg-blue-700 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-6 transition duration-500 transform rotate-3 group-hover:rotate-0 group-hover:scale-105">
                                    <div className="transition duration-500 transform group-hover:-translate-y-0.5">
                                        {step.icon}
                                    </div>
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h4>
                                <p className="text-gray-600 leading-relaxed px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const Features = () => {
        const featureList = [
            { title: "Digital Upload", desc: "Upload scanned copies of marksheets and certificates securely.", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
            { title: "Secure Authentication", desc: "Multi-factor authentication ensures only authorized access.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            { title: "Automated Workflow", desc: "Documents move automatically from Student to SAG to Finance.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
            { title: "Real-time Tracking", desc: "Students can check the exact status of their application instantly.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
            { title: "Eco-Friendly", desc: "100% paperless process reducing carbon footprint and waste.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Data Privacy", desc: "End-to-end encryption to protect sensitive student data.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
        ];

        return (
            <section id="features" className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-blue-700 font-bold tracking-widest uppercase text-sm mb-2">KEY FEATURES</h2>
                        <h3 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Built for Efficiency & Trust</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featureList.map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition duration-300 group">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-700 group-hover:bg-blue-100 transition duration-300">
                                    <svg className="w-7 h-7 group-hover:scale-110 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon}></path>
                                    </svg>
                                </div>
                                <h4 className="text-xl font-extrabold text-gray-900 mb-3">{feature.title}</h4>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const Benefits = () => {
        const benefits = [
            "Faster processing times for scholarships",
            "No risk of lost physical documents",
            "Transparent approval status",
            "24/7 Portal accessibility",
            "Zero paperwork or courier costs"
        ];

        return (
            <section id="benefits" className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">

                        <div className="mb-10 lg:mb-0">
                            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
                                Why switch to the <br />
                                <span className="text-blue-700">Digital System?</span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                This Digital System modernizes the scholarship landscape, ensuring that deserving students receive their funds without bureaucratic hurdles.
                            </p>

                            <ul className="space-y-5">
                                {benefits.map((item, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <div className="shrink-0 w-8 h-8 mt-1 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span className="text-lg font-medium text-gray-700 pt-1">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-12">
                                <button className="text-blue-700 font-bold flex items-center text-lg hover:text-blue-800 transition">
                                    Read our full impact report
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* Stats Card **Enhanced Dark Mode/Shadows** */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-600 transform skew-y-3 rounded-3xl -z-10 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl opacity-15 shadow-xl"></div>
                            <div className="relative bg-gray-900 rounded-3xl p-10 shadow-2xl shadow-gray-900/50 text-white border border-gray-800">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <p className="text-gray-400 text-sm uppercase tracking-wider">Total Disbursement</p>
                                        <p className="text-4xl font-extrabold mt-1 text-cyan-300">₹ 45.2 Cr</p>
                                    </div>
                                    <div className="h-14 w-14 bg-blue-500 rounded-full flex items-center justify-center bg-opacity-30 backdrop-filter backdrop-blur-sm shadow-xl">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                                        <span className="text-gray-300 text-lg">Applications Processed</span>
                                        <span className="font-extrabold text-xl text-white">12,450</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                                        <span className="text-gray-300 text-lg">Success Rate</span>
                                        <span className="font-extrabold text-green-400 text-xl">98.5%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 text-lg">Avg. Processing Time</span>
                                        <span className="font-extrabold text-blue-400 text-xl">3 Days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const Footer = () => {
        return (
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-12">

                        <div className="col-span-2 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                {/* Logo placeholder **Refined styling** */}
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                </div>
                                <span className="font-extrabold text-2xl tracking-tight text-white">Digital</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                                Streamlining the future of education through transparent and digital financial aid distribution.
                            </p>
                            <div className="flex space-x-4 mt-6 text-gray-500">
                                {/* Dummy Social Icons **Subtle hover effect** */}
                                <a href="#" className="hover:text-blue-500 transition duration-200">F</a>
                                <a href="#" className="hover:text-blue-500 transition duration-200">X</a>
                                <a href="#" className="hover:text-blue-500 transition duration-200">in</a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4 text-gray-100">Quick Links</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Home</a></li>
                                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Notifications</a></li>
                                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Grievance Redressal</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4 text-gray-100">Legal</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Disclaimer</a></li>
                                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Accessibility</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4 text-gray-100">Contact Helpdesk</h4>
                            <p className="text-gray-400 text-sm mb-2">Technical Issues?</p>
                            <p className="text-white font-extrabold text-lg mb-4 hover:text-blue-400 transition">+91-11-2345-6789</p>
                            <p className="text-gray-400 text-sm mb-2">Email Support</p>
                            <p className="text-white font-extrabold hover:text-blue-400 transition">helpdesk@pmsss.gov.in</p>
                        </div>

                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>&copy; 2024 PMSSS Digital Scholarship System. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <span className="hover:text-white cursor-pointer transition">Government of India</span>
                            <span>|</span>
                            <span className="hover:text-white cursor-pointer transition">Education Ministry</span>
                        </div>
                    </div>
                </div>
            </footer>
        );
    };

    // --- Main Render ---
    return (
        <div className="font-sans antialiased text-gray-900 bg-white">
            {customAnimations} {/* Inject the custom styles */}
            <Navbar />
            <main>
                <Hero />
                <HowItWorks />
                <Features />
                <Benefits />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;