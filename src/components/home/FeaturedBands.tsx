import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Music } from "lucide-react";
import { BandCard } from "@/components/cards/BandCard";
import { Button } from "@/components/ui/button";
import { useBands } from "@/hooks/useBands";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedBands() {
  const { data: bands = [], isLoading, error } = useBands();
  
  // Filter featured bands, or show top 4 if none are featured
  const featuredBands = bands.filter((band) => band.featured).slice(0, 4);
  const displayBands = featuredBands.length > 0 ? featuredBands : bands.slice(0, 4);

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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
              <Music className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-muted-foreground">Unable to load featured bands</p>
          </div>
        ) : displayBands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayBands.map((band) => (
              <BandCard key={band.id} band={band} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
              <Music className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No bands available yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
