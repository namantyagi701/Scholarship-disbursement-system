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
    },
    {
      number: '02',
      icon: UserCheck,
      title: 'SAG Verifies',
      description: 'State Admin Group reviews, verifies documents, and approves eligible applications ensuring transparency',
    },
    {
      number: '03',
      icon: Banknote,
      title: 'Finance Disburses',
      description: 'Finance Bureau validates bank details, processes payments, and completes scholarship disbursement',
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3] border-t border-[#DCD6C8]">
      <div className="max-w-[900px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-4">
            Process
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#16213E] max-w-md">
            How it works
          </h2>
        </motion.div>

        {/* Steps — vertical numbered docket stepper */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#DCD6C8]" aria-hidden="true" />

          <div className="space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className={`flex gap-8 ${!isLast ? 'pb-12' : ''}`}>
                    {/* Number marker */}
                    <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-[#FFFEFB] border border-[#DCD6C8] flex items-center justify-center">
                      <span className="font-mono-data text-xs font-semibold text-[#16213E]">
                        {step.number}
                      </span>
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-7 ${!isLast ? '' : ''}`}>
                      <div className="flex items-start gap-4">
                        <Icon className="w-5 h-5 text-[#B8860B] mt-0.5 shrink-0" strokeWidth={1.5} />
                        <div>
                          <h3 className="font-serif-display text-xl font-normal text-[#16213E] mb-2">
                            {step.title}
                          </h3>
                          <p className="text-sm text-[#16213E]/55 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-14 pl-[72px]"
        >
          <div className="inline-flex items-center gap-2.5 border border-[#DCD6C8] rounded-sm px-5 py-2.5 bg-[#FFFEFB]">
            <div className="w-1.5 h-1.5 bg-[#2F6F4F] rounded-full" />
            <span className="font-mono-data text-xs tracking-wide text-[#16213E]/60 uppercase">
              Fully Digital & Paperless
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default HowItWorks;
