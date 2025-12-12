import React, { useState } from 'react';

// --- Sub-Components (Encapsulated for single-file copy-paste) ---

// Icons using simple inline SVG paths (no external library needed)
const Icons = {
  Zap: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Layout: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1v-3.25M11.75 7L13 3l1 1h-8l1 1v3.25M12 12c1.38 0 2.5-1.12 2.5-2.5S13.38 7 12 7s-2.5 1.12-2.5 2.5S10.62 12 12 12z" /></svg>,
  Lock: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Settings: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.313.826 2.371 2.371a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.942 1.543-.826 3.313-2.371 2.371a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.313-.826-2.371-2.371a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.942-1.543.826-3.313 2.371-2.371a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Integration: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>,
  Globe: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.5l1 1h4l1-1H19a2 2 0 012 2v10a2 2 0 01-2 2h-3.5l-1-1h-4l-1 1H5a2 2 0 01-2-2V5z" /></svg>,
  Check: (props) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>,
  User: (props) => <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Mobile */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none p-2">
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
    </nav>
  );
};

// ---------------- HERO --------------------

const Hero = () => {
  return (
    <section className="relative lg:pb-40 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div className="text-center lg:text-left z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              A Smarter Way to Manage  
              <br className="hidden md:inline" />
              <span className="text-indigo-600">Scholarship Disbursement.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              From applications to verification and fund release — everything is automated, transparent, and trackable in one secure digital system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 text-lg font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl shadow-md hover:bg-gray-100 transition focus:ring-4 focus:ring-gray-100">
                Explore System
              </button>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative z-10 hidden lg:block">
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-3 hover:rotate-0 transition duration-500">

              {/* Header */}
              <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-3 w-40 bg-gray-300 rounded-full opacity-50"></div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-indigo-100 rounded-full text-indigo-600 font-bold text-sm flex items-center justify-center">PMSSS</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="h-28 bg-indigo-50 rounded-xl border border-indigo-100 p-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-200 mb-2"></div>
                    <div className="h-2 w-full bg-indigo-200 rounded mb-1"></div>
                    <div className="h-2 w-3/4 bg-indigo-200 rounded"></div>
                  </div>

                  <div className="h-28 bg-gray-100 rounded-xl border border-gray-200 p-4">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mb-2"></div>
                    <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
                    <div className="h-2 w-3/4 bg-gray-300 rounded"></div>
                  </div>

                  <div className="h-28 bg-gray-100 rounded-xl border border-gray-200 p-4">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mb-2"></div>
                    <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
                    <div className="h-2 w-3/4 bg-gray-300 rounded"></div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="h-3 w-full bg-gray-100 rounded"></div>
                  <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
                  <div className="h-3 w-4/6 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ---------------- FEATURES --------------------

const Features = () => {
  const featureList = [
    { title: "Instant Application Processing", desc: "Digital submission, automated verification, and reduced manual workload.", icon: Icons.Zap },
    { title: "Clean & Student-Friendly UI", desc: "Designed for easy usage by students, institutes, and government officials.", icon: Icons.Layout },
    { title: "Secure Document Handling", desc: "End-to-end encryption ensures safety of personal and financial data.", icon: Icons.Lock },
    { title: "Automated Fund Disbursement", desc: "Eliminate delays with AI-assisted approval and direct bank transfer tracking.", icon: Icons.Settings },
    { title: "Seamless Integration", desc: "Connects with Aadhaar, DigiLocker, MIS portals, and college databases.", icon: Icons.Integration },
    { title: "Accessible Everywhere", desc: "Fully responsive portal usable on mobile, laptop, and tablets.", icon: Icons.Globe },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-2">System Capabilities</h2>
          <h3 className="text-4xl font-extrabold text-gray-900">Built for Transparent Scholarship Management</h3>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            A secure, scalable, and intelligent platform that supports students and administrators throughout the entire scholarship lifecycle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featureList.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-xl border border-gray-100 hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------- HOW IT WORKS --------------------

const HowItWorks = () => {
  const steps = [
    { id: 1, title: "Student Registration & Upload", desc: "Students apply online, upload documents, and track real-time status.", icon: Icons.User },
    { id: 2, title: "Verification & Approval", desc: "Institutes and authorities verify details digitally using AI-based checks.", icon: Icons.Settings },
    { id: 3, title: "Fund Release & Tracking", desc: "Approved students receive payments directly into their bank accounts.", icon: Icons.Check },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-2">Workflow</h2>
          <h3 className="text-4xl font-extrabold text-gray-900">How Scholarship Disbursement Works</h3>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gray-200 mx-auto -translate-y-1/2"></div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white border-4 border-indigo-600 rounded-full flex items-center justify-center text-3xl font-extrabold text-indigo-600 mb-6 shadow-xl">
                  {step.id}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------- TESTIMONIALS --------------------

const Testimonials = () => {
  const testimonials = [
    { quote: "Our scholarship processing time dropped from 3 months to 2 weeks. Students are happier and staff workload is reduced.", name: "Dr. Meera S.", title: "Principal, Government Polytechnic" },
    { quote: "The automated verification system eliminated 80% of manual errors. Transparency has increased significantly.", name: "Rajesh Verma", title: "Scholarship Officer, State Education Board" },
    { quote: "Tracking fund disbursement for thousands of students used to be a nightmare. Now it’s effortless and instant.", name: "Anita Sharma", title: "Accounts Manager, Central Govt." },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-2">Feedback</h2>
          <h3 className="text-4xl font-extrabold text-gray-900">What Institutions Say</h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-100">
              <p className="text-xl italic text-gray-700 mb-6">"{t.quote}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-4">
                  <Icons.User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------- MAIN PAGE --------------------

const HomePage = () => {
  return (
    <div className="font-sans antialiased text-gray-900 bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
      </main>
    </div>
  );
};

export default HomePage;
