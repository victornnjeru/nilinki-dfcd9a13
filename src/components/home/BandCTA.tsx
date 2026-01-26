import { Link } from "react-router-dom";
import { ArrowRight, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BandCTA() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/20">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary blur-3xl" />
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-accent blur-3xl" />
          </div>

          <div className="relative px-6 py-16 md:px-12 md:py-20">
            <div className="max-w-2xl">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6">
                <Music2 className="h-8 w-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Are You a Band Looking for Gigs?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Join Nilinki and connect with event planners worldwide. Showcase your talent, manage bookings, and grow your audience.
              </p>

              {/* Benefits */}
              <ul className="space-y-3 mb-8">
                {[
                  "Free to create your profile",
                  "Get discovered by thousands of event planners",
                  "Manage inquiries and bookings in one place",
                  "Showcase your videos and reviews",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-foreground">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button size="lg" asChild className="group">
                <Link to="/join">
                  Join as a Band
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
