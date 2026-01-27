import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BandCard } from "@/components/cards/BandCard";
import { BandFilters, type FilterState } from "@/components/bands/BandFilters";
import { mockBands } from "@/data/mockData";

export default function Bands() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    genre: "",
    location: "",
    priceRange: [0, 5000],
  });

  const filteredBands = useMemo(() => {
    return mockBands.filter((band) => {
      // Search filter
      if (
        filters.search &&
        !band.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Genre filter
      if (filters.genre && filters.genre !== "all" && band.genre !== filters.genre) {
        return false;
      }

      // Location filter
      if (
        filters.location &&
        filters.location !== "all" &&
        band.location !== filters.location
      ) {
        return false;
      }

      // Price range filter
      if (
        band.startingRate < filters.priceRange[0] ||
        band.startingRate > filters.priceRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="container px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Discover Bands
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse our curated collection of talented bands from around the world.
              Find the perfect sound for your next event.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <BandFilters filters={filters} onFiltersChange={setFilters} />
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredBands.length}
              </span>{" "}
              {filteredBands.length === 1 ? "band" : "bands"}
            </p>
          </motion.div>

          {/* Band Grid */}
          {filteredBands.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredBands.map((band, index) => (
                <motion.div
                  key={band.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * Math.min(index, 8) }}
                >
                  <BandCard band={band} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Music className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No bands found
              </h3>
              <p className="text-muted-foreground max-w-md">
                Try adjusting your filters or search terms to find what you're
                looking for.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
