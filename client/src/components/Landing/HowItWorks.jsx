import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UserCheck, Banknote } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: FileText,
      title: 'Student Applies',
      description: 'Students submit scholarship applications with required documents and academic records through the secure portal',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      number: '02',
      icon: UserCheck,
      title: 'SAG Verifies',
      description: 'State Admin Group reviews, verifies documents, and approves eligible applications ensuring transparency',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      number: '03',
      icon: Banknote,
      title: 'Finance Disburses',
      description: 'Finance Bureau validates bank details, processes payments, and completes scholarship disbursement',
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(203_213_225/0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgb(203_213_225/0.1)_1px,transparent_1px)] [background-size:64px_64px]"></div>
      
      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A streamlined three-step process from application to disbursement
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Number Badge */}
                  <div className="shrink-0">
                    <div className={`w-20 h-20 ${step.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className={`text-3xl font-bold ${step.color} text-white`}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 bg-white rounded-2xl p-8 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`shrink-0 w-12 h-12 ${step.color} rounded-xl flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                      </div>

                      {/* Text Content */}
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-10 top-full h-12 w-0.5 bg-gray-300 transform translate-y-4"></div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-100 rounded-full border border-orange-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-slate-700 font-medium">Fully Digital & Paperless Process</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default HowItWorks;
