import { Star, MapPin, Music, Users, Calendar, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BandProfile } from "@/data/bandProfiles";

interface ProfileHeaderProps {
  band: BandProfile;
  onRequestQuote: () => void;
}

export function ProfileHeader({ band, onRequestQuote }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={band.coverUrl}
          alt={`${band.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Profile Info Overlay */}
      <div className="container relative -mt-32 pb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Band Image */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-background shadow-xl">
            <img
              src={band.imageUrl}
              alt={band.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Band Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {band.name}
              </h1>
              {band.featured && (
                <Badge className="bg-primary text-primary-foreground">Featured</Badge>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-4">{band.bio}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Music className="h-4 w-4 text-primary" />
                <span>{band.genre}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{band.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span>{band.members} members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{band.yearsActive} years active</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-semibold text-foreground text-lg">{band.rating}</span>
                <span className="text-muted-foreground">({band.reviewCount} reviews)</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div>
                <span className="text-muted-foreground">From </span>
                <span className="font-semibold text-foreground text-lg">${band.startingRate}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <Button size="lg" onClick={onRequestQuote} className="flex-1 md:flex-none">
              Request Quote
            </Button>
            <Button size="lg" variant="outline" className="px-4">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
