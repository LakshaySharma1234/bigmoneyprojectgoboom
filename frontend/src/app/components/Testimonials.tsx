import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Part-Time Server",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content: "I found the perfect weekend job through CaterStaff. The flexible hours work perfectly with my college schedule, and the pay is great!",
    rating: 5
  },
  {
    name: "James Rodriguez",
    role: "Bartender",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content: "The platform made it so easy to find quality catering gigs. I've worked some amazing events and met great people along the way.",
    rating: 5
  },
  {
    name: "Emily Chen",
    role: "Kitchen Staff",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    content: "Within a week of signing up, I had three job offers. The employers are professional and the work environment is always respectful.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            What Our Staff Says
          </h2>
          <p className="text-xl text-gray-400">
            Join thousands of satisfied catering professionals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-2xl p-8 relative hover:bg-gray-750 transition-colors"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-orange-500/20" />
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
