import React from 'react';
import { 
  BookOpen, 
  Target, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Award 
} from 'lucide-react';

const AboutPage = () => {
  // Distribution process steps
  const distributionSteps = [
    {
      number: '01',
      title: "Application Review",
      description: "All applications are reviewed based on academic performance, financial need, and other relevant criteria.",
      icon: CheckCircle,
    },
    {
      number: '02',
      title: "Eligibility Verification",
      description: "Applicants are verified for eligibility according to the scholarship guidelines.",
      icon: Users,
    },
    {
      number: '03',
      title: "Award Notification",
      description: "Successful candidates are notified of their scholarship award.",
      icon: Award,
    },
    {
      number: '04',
      title: "Fund Disbursement",
      description: "Scholarships are disbursed directly to educational institutions or students.",
      icon: DollarSign,
    }
  ];

  return (
    <div className="bg-[#FAF8F3] min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6 py-16">
        {/* Header Section */}
        <header className="mb-16">
          <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-4">
            About
          </p>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#16213E] mb-4 max-w-lg">
            Prime Minister's Special Scholarship Scheme
          </h1>
          <p className="text-base text-[#16213E]/50 max-w-md leading-relaxed">
            Empowering students, transforming futures.
          </p>
        </header>

        {/* Welcome Section */}
        <section className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-8 mb-10">
          <div className="flex items-center gap-4 mb-5">
            <BookOpen className="w-5 h-5 text-[#B8860B] shrink-0" strokeWidth={1.5} />
            <h2 className="font-serif-display text-2xl font-normal text-[#16213E]">Welcome to PMSSS</h2>
          </div>
          <p className="text-sm text-[#16213E]/60 leading-relaxed">
            The Prime Minister's Special Scholarship Scheme (PMSSS) Portal is dedicated to empowering deserving students 
            across the country by providing financial assistance for higher education. We are committed to breaking 
            down financial barriers and enabling talented students to pursue their academic dreams.
          </p>
        </section>

        {/* Vision and Mission */}
        <div className="grid md:grid-cols-2 gap-px bg-[#DCD6C8] mb-10">
          <div className="bg-[#FFFEFB] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-[#B8860B] shrink-0" strokeWidth={1.5} />
              <h3 className="font-serif-display text-xl font-normal text-[#16213E]">Our Vision</h3>
            </div>
            <p className="text-sm text-[#16213E]/60 leading-relaxed">
              To be a leading initiative in providing accessible, transparent, and impactful scholarship 
              opportunities, helping students from diverse backgrounds achieve their academic goals and 
              contribute to national development.
            </p>
          </div>

          <div className="bg-[#FFFEFB] p-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-[#B8860B] shrink-0" strokeWidth={1.5} />
              <h3 className="font-serif-display text-xl font-normal text-[#16213E]">Our Mission</h3>
            </div>
            <p className="text-sm text-[#16213E]/60 leading-relaxed">
              To identify, support, and nurture talented students through scholarships, helping them 
              gain access to quality education and empowering them to become future leaders and 
              professionals in various fields.
            </p>
          </div>
        </div>

        {/* Why Choose PMSSS */}
        <section className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-8 mb-10">
          <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-4">
            Why PMSSS
          </p>
          <h2 className="font-serif-display text-2xl font-normal text-[#16213E] mb-8">
            Why choose this scheme?
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-[#DCD6C8]">
            <div className="bg-[#FFFEFB] p-6">
              <DollarSign className="w-5 h-5 text-[#B8860B] mb-3" strokeWidth={1.5} />
              <h3 className="font-serif-display text-base font-normal text-[#16213E] mb-2">Financial Assistance</h3>
              <p className="text-sm text-[#16213E]/55 leading-relaxed">
                Scholarships cover tuition, living expenses, and other necessary educational costs.
              </p>
            </div>
            <div className="bg-[#FFFEFB] p-6">
              <CheckCircle className="w-5 h-5 text-[#B8860B] mb-3" strokeWidth={1.5} />
              <h3 className="font-serif-display text-base font-normal text-[#16213E] mb-2">Transparency</h3>
              <p className="text-sm text-[#16213E]/55 leading-relaxed">
                A clear and easy-to-follow process for applying and receiving scholarships.
              </p>
            </div>
            <div className="bg-[#FFFEFB] p-6">
              <Users className="w-5 h-5 text-[#B8860B] mb-3" strokeWidth={1.5} />
              <h3 className="font-serif-display text-base font-normal text-[#16213E] mb-2">Diversity</h3>
              <p className="text-sm text-[#16213E]/55 leading-relaxed">
                Scholarships available for a wide range of students from various backgrounds and disciplines.
              </p>
            </div>
            <div className="bg-[#FFFEFB] p-6">
              <Award className="w-5 h-5 text-[#B8860B] mb-3" strokeWidth={1.5} />
              <h3 className="font-serif-display text-base font-normal text-[#16213E] mb-2">Supportive Community</h3>
              <p className="text-sm text-[#16213E]/55 leading-relaxed">
                A network of students, educators, and professionals committed to your academic success.
              </p>
            </div>
          </div>
        </section>

        {/* Distribution Process — numbered docket stepper */}
        <section className="border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-8">
          <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-4">
            Process
          </p>
          <h2 className="font-serif-display text-2xl font-normal text-[#16213E] mb-10">
            Funds distribution process
          </h2>

          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-[#DCD6C8]" aria-hidden="true" />

            <div className="space-y-0">
              {distributionSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === distributionSteps.length - 1;
                return (
                  <div key={index} className="relative">
                    <div className={`flex gap-6 ${!isLast ? 'pb-8' : ''}`}>
                      {/* Number marker */}
                      <div className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-[#FFFEFB] border border-[#DCD6C8] flex items-center justify-center">
                        <span className="font-mono-data text-[10px] font-semibold text-[#16213E]">
                          {step.number}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-start gap-3">
                          <Icon className="w-4 h-4 text-[#B8860B] mt-1 shrink-0" strokeWidth={1.5} />
                          <div>
                            <h3 className="font-serif-display text-lg font-normal text-[#16213E] mb-1">
                              {step.title}
                            </h3>
                            <p className="text-sm text-[#16213E]/55 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        {!isLast && <div className="border-b border-[#DCD6C8] mt-6" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;