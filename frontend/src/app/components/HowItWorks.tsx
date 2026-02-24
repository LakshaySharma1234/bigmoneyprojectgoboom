import { UserPlus, Search, FileCheck, Briefcase } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up in minutes and build your professional catering profile with your experience and availability."
  },
  {
    icon: Search,
    title: "Browse Opportunities",
    description: "Search thousands of part-time catering jobs by location, pay rate, and schedule preferences."
  },
  {
    icon: FileCheck,
    title: "Apply with One Click",
    description: "Submit your application instantly. Employers can contact you directly through our platform."
  },
  {
    icon: Briefcase,
    title: "Start Working",
    description: "Get hired, show up to your shift, and start earning. It's that simple!"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Get started with your catering career in 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 border-2 border-orange-100">
                    <Icon className="w-10 h-10 text-orange-600" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-orange-100 -z-10"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
