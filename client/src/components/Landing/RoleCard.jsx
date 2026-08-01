import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const RoleCards = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      number: '01',
      label: 'Student',
      title: 'Apply & Track',
      description: 'Apply and track your scholarship application',
      route: '/login/student',
      delay: 0.2
    },
    {
      id: 'sag',
      number: '02',
      label: 'SAG',
      title: 'Verify & Approve',
      description: 'Verify applications and manage approvals',
      route: '/login/sag',
      delay: 0.4
    },
    {
      id: 'finance',
      number: '03',
      label: 'Finance',
      title: 'Disburse & Settle',
      description: 'Verify bank details and process disbursement',
      route: '/login/finance',
      delay: 0.6
    }
  ];

  return (
    <section id="role-selection" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3]">
      <div className="max-w-[1100px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-4">
            Portals
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#16213E] max-w-md">
            Choose your role
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: role.delay }}
              className="group"
            >
              <div className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-8 h-full flex flex-col transition-colors duration-300 hover:border-[#B8860B]">
                {/* Number + Label */}
                <p className="font-mono-data text-xs tracking-[0.15em] uppercase text-[#16213E]/40 mb-5">
                  {role.number} · {role.label}
                </p>

                {/* Title */}
                <h3 className="font-serif-display text-2xl font-normal text-[#16213E] mb-3">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#16213E]/60 leading-relaxed mb-8 flex-1">
                  {role.description}
                </p>

                {/* Action Row */}
                <div className="border-t border-[#DCD6C8] pt-5">
                  <button
                    onClick={() => navigate(role.route)}
                    className="group/btn flex items-center gap-2 text-sm font-medium text-[#16213E] cursor-pointer bg-transparent border-none p-0 hover:text-[#B8860B] transition-colors duration-200"
                  >
                    <span>Sign in as {role.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#DCD6C8] group-hover/btn:text-[#B8860B] group-hover/btn:translate-x-1 transition-all duration-200" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;
