import { Search, Music, Calendar, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse hundreds of talented bands by genre, location, or event type.",
  },
  {
    icon: Music,
    title: "Preview Performances",
    description: "Watch videos, listen to demos, and read reviews from past clients.",
  },
  {
    icon: Calendar,
    title: "Request a Quote",
    description: "Send your event details and get personalized pricing from bands.",
  },
  {
    icon: Star,
    title: "Book & Celebrate",
    description: "Confirm your booking and enjoy an unforgettable live performance.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Book your perfect band in four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-primary/50 to-border" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center z-10">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
