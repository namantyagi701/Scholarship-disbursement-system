import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, UserCheck, ClipboardList, Banknote } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: ShieldCheck,
      title: 'Verify Identity with Aadhaar',
      description: 'Students begin by verifying their 12-digit Aadhaar number through the secure portal. Once verified, your identity is linked to your application — no duplicate submissions, no impersonation.',
    },
    {
      number: '02',
      icon: FileText,
      title: 'Fill Application & Upload Documents',
      description: 'Complete the scholarship form with your personal, academic, and bank details. Upload required documents — Aadhaar card, income certificate, marksheets, admission letter, and bank passbook. Aadhaar uploads are OCR-scanned to cross-check your name automatically.',
    },
    {
      number: '03',
      icon: UserCheck,
      title: 'SAG Reviews & Verifies',
      description: 'The Scholarship Administration Group reviews each application individually — verifying documents, checking eligibility, and cross-referencing details. Applications are either approved for disbursement or sent back with specific rejection reasons for correction.',
    },
    {
      number: '04',
      icon: ClipboardList,
      title: 'Finance Batches Payments',
      description: 'Approved applications are grouped into payment batches by the Finance Bureau. Each batch validates bank account details, IFSC codes, and account holder names before being sent to the bank for processing.',
    },
    {
      number: '05',
      icon: Banknote,
      title: 'Scholarship Disbursed',
      description: 'Funds are transferred directly to your verified bank account. Track your payment status in real time — from batch generation through bank processing to final disbursement — all from your student dashboard.',
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
