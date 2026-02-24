import { ChefHat, Wine, UtensilsCrossed, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const categories = [
  {
    icon: UtensilsCrossed,
    title: "Servers & Waitstaff",
    count: "850+ positions",
    image: "https://images.unsplash.com/photo-1716187677911-298b8e551456?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3YWl0ZXJzJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzE5MzM5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Front-of-house positions at weddings, corporate events, and private parties"
  },
  {
    icon: Wine,
    title: "Bartenders",
    count: "320+ positions",
    image: "https://images.unsplash.com/photo-1593060190480-7823e800e645?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJ0ZW5kZXIlMjBtaXhpbmclMjBkcmlua3N8ZW58MXx8fHwxNzcxODQ0ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Mix drinks and serve beverages at upscale events and venues"
  },
  {
    icon: ChefHat,
    title: "Kitchen Staff",
    count: "480+ positions",
    image: "https://images.unsplash.com/photo-1578366941741-9e517759c620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMGNhdGVyaW5nJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzcxOTMzOTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Food prep, line cook, and kitchen assistant roles"
  },
  {
    icon: Sparkles,
    title: "Event Support",
    count: "420+ positions",
    image: "https://images.unsplash.com/photo-1761416376088-d6456fcd76fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMHN0YWZmJTIwc2VydmluZyUyMGZvb2R8ZW58MXx8fHwxNzcxOTMzOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Setup, breakdown, and general event assistance"
  }
];

export function JobCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Job Categories
          </h2>
          <p className="text-xl text-gray-600">
            Find the perfect role that matches your skills and experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl h-80 cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 transition-opacity group-hover:from-black/95 group-hover:via-black/60"></div>
                
                {/* Content */}
                <div className="relative h-full p-8 flex flex-col justify-end">
                  <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-orange-400 font-medium mb-3">
                    {category.count}
                  </p>
                  <p className="text-gray-200 mb-4">
                    {category.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-black w-fit group-hover:border-orange-500 group-hover:text-orange-500"
                  >
                    View Jobs
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
