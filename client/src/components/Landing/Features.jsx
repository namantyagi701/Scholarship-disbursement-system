import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Users, CheckCircle, Activity } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with multi-factor authentication and encrypted data transmission',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Role-based Access Control',
      description: 'Granular permissions ensuring users only access relevant information and functions',
      color: 'bg-purple-500'
    },
    {
      icon: CheckCircle,
      title: 'Transparent Verification',
      description: 'Complete audit trail and transparent workflow at every stage of the scholarship process',
      color: 'bg-emerald-500'
    },
    {
      icon: Activity,
      title: 'Real-time Tracking',
      description: 'Live updates and notifications for application status and approval progress',
      color: 'bg-orange-500'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Built for Excellence
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive features designed to streamline scholarship management
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 h-full shadow-sm hover:shadow-md">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
