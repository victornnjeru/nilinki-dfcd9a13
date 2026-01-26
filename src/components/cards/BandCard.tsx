import { Link } from "react-router-dom";
import { Star, MapPin, Music } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Band {
  id: string;
  name: string;
  genre: string;
  location: string;
  rating: number;
  reviewCount: number;
  startingRate: number;
  imageUrl: string;
  featured?: boolean;
}

interface BandCardProps {
  band: Band;
}

export function BandCard({ band }: BandCardProps) {
  return (
    <Link to={`/bands/${band.id}`}>
      <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={band.imageUrl}
            alt={band.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {band.featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>
        <CardContent className="relative -mt-12 p-4">
          <div className="mb-2">
            <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {band.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Music className="h-3.5 w-3.5" />
              <span>{band.genre}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{band.location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold text-foreground">{band.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({band.reviewCount})
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">From</span>
              <span className="ml-1 font-semibold text-foreground">
                ${band.startingRate}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
