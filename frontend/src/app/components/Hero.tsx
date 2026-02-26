import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1761416376088-d6456fcd76fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMHN0YWZmJTIwc2VydmluZyUyMGZvb2R8ZW58MXx8fHwxNzcxOTMzOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Catering staff serving food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full mb-6">
            <span className="text-orange-400 text-sm font-medium">
              Now Hiring for Flexible Positions
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-orange-500">Part-Time Catering Job</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Connect with top restaurants, event venues, and catering companies. 
            Flexible hours, competitive pay, and opportunities to grow your career in hospitality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg group"
            >
              Apply Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-black text-black px-8 py-6 text-lg"
              >
              Browse Jobs
          </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold text-white mb-1">2,500+</div>
              <div className="text-sm text-gray-300">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">850+</div>
              <div className="text-sm text-gray-300">Employers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">15,000+</div>
              <div className="text-sm text-gray-300">Jobs Filled</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
