import { Clock, DollarSign, TrendingUp, Users, Shield, Calendar } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Choose shifts that fit your lifestyle. Work evenings, weekends, or full-time hours."
  },
  {
    icon: DollarSign,
    title: "Competitive Pay",
    description: "Earn competitive hourly rates plus tips. Many positions offer instant pay options."
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Develop valuable hospitality skills and advance to supervisory or management roles."
  },
  {
    icon: Users,
    title: "Great Team Environment",
    description: "Work with passionate professionals in dynamic, social settings across various events."
  },
  {
    icon: Shield,
    title: "Verified Employers",
    description: "All employers are carefully vetted to ensure safe and professional work environments."
  },
  {
    icon: Calendar,
    title: "Instant Booking",
    description: "Apply and get hired quickly. Some positions offer same-day start opportunities."
  }
];

export function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose CaterStaff?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We connect talented individuals with the best catering opportunities, 
            making it easy to find work that fits your schedule and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
