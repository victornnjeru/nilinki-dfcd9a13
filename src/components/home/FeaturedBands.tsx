import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BandCard } from "@/components/cards/BandCard";
import { Button } from "@/components/ui/button";
import { mockBands } from "@/data/mockData";

export function FeaturedBands() {
  const featuredBands = mockBands.filter((band) => band.featured).slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Bands
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Discover top-rated bands handpicked for exceptional performances and reliability.
            </p>
          </div>
          <Button variant="ghost" asChild className="group self-start md:self-auto">
            <Link to="/bands">
              View All Bands
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Band Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBands.map((band) => (
            <BandCard key={band.id} band={band} />
          ))}
        </div>
      </div>
    </section>
  );
}
