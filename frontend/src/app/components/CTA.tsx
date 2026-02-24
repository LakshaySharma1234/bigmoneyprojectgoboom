import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

const benefits = [
  "No application fees - completely free",
  "Start earning within days",
  "Work with top-rated employers",
  "24/7 support team"
];

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Catering Career?
            </h2>
            <p className="text-xl text-orange-50 mb-8">
              Join thousands of professionals who have found flexible, rewarding work through our platform.
            </p>
            
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                  <span className="text-lg text-orange-50">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg group"
              >
                Create Free Account
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Contact Us
              </Button>
            </div>
          </div>

          <div className="flex-1 lg:flex-none">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Sign Up
              </h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg"
                >
                  Get Started
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
