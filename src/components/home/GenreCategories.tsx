import { Link } from "react-router-dom";
import { genres } from "@/data/mockData";

export function GenreCategories() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Browse by Genre
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find the perfect musical style for your event.
          </p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              to={`/bands?genre=${genre.id}`}
              className="group flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {genre.icon}
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
