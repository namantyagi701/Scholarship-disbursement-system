import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Shield, Building2, ArrowRight } from 'lucide-react';

const RoleCards = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student Portal',
      description: 'Apply and track your scholarship application',
      icon: UserCircle,
      color: 'from-blue-500 to-indigo-500',
      route: '/login/student',
      delay: 0.2
    },
    {
      id: 'sag',
      title: 'SAG Portal',
      description: 'Verify applications and manage approvals',
      icon: Shield,
      color: 'from-orange-500 to-amber-500',
      route: '/login/sag',
      delay: 0.4
    },
    {
      id: 'finance',
      title: 'Finance Bureau Portal',
      description: 'Verify bank details and process disbursement',
      icon: Building2,
      color: 'from-emerald-500 to-teal-500',
      route: '/login/finance',
      delay: 0.6
    }
  ];

  return (
    <section id="role-selection" className="py-24 px-4 sm:px-6 lg:px-8 relative">
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
            Choose Your Portal
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select your role to access the scholarship management system
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: role.delay }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-linear-to-r ${role.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                ></div>

                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 bg-linear-to-br ${role.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {role.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => navigate(role.route)}
                    className={`w-full bg-linear-to-r ${role.color} text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-between shadow-md hover:shadow-lg`}
                  >
                    <span>
                      Login as {role.id === 'sag' ? 'SAG' : role.id === 'student' ? 'Student' : 'Finance'}
                    </span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleCards;
