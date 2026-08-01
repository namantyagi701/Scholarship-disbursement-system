import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Users, CheckCircle, Activity } from 'lucide-react';

const Features = () => {
  const features = [
    {
      number: '01',
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with multi-factor authentication and encrypted data transmission',
    },
    {
      number: '02',
      icon: Users,
      title: 'Role-based Access',
      description: 'Granular permissions ensuring users only access relevant information and functions',
    },
    {
      number: '03',
      icon: CheckCircle,
      title: 'Transparent Verification',
      description: 'Complete audit trail and transparent workflow at every stage of the scholarship process',
    },
    {
      number: '04',
      icon: Activity,
      title: 'Real-time Tracking',
      description: 'Live updates and notifications for application status and approval progress',
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFEFB] border-t border-[#DCD6C8]">
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
            Platform
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-normal text-[#16213E] max-w-md">
            Built for excellence
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#DCD6C8]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#FFFEFB] p-8"
              >
                {/* Number */}
                <p className="font-mono-data text-xs tracking-[0.15em] text-[#16213E]/30 mb-5">
                  {feature.number}
                </p>

                {/* Icon */}
                <div className="mb-5">
                  <Icon className="w-6 h-6 text-[#B8860B]" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="font-serif-display text-lg font-normal text-[#16213E] mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#16213E]/55 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
