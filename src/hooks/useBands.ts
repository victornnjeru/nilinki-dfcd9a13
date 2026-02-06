import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Band } from "@/components/cards/BandCard";
import { mapOperationError } from "@/lib/errorUtils";

interface BandWithStats {
  id: string;
  name: string;
  genre: string;
  location: string;
  image_url: string | null;
  featured: boolean | null;
  bio: string | null;
  long_bio: string | null;
  cover_url: string | null;
  years_active: number | null;
  members: number | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  spotify: string | null;
}

async function fetchBands(): Promise<Band[]> {
  // Fetch bands
  const { data: bands, error: bandsError } = await supabase
    .from("bands")
    .select("*")
    .order("featured", { ascending: false })
    .order("name");

  if (bandsError) {
    throw new Error(mapOperationError(bandsError, "fetch", "bands"));
  }

  if (!bands || bands.length === 0) {
    return [];
  }

  // Fetch reviews for rating calculations
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("band_id, rating");

  if (reviewsError) {
    // Log in dev only, don't expose to user - reviews are supplementary data
    if (import.meta.env.DEV) {
      console.error("Failed to fetch reviews:", reviewsError);
    }
  }

  // Fetch rate cards for starting rates
  const { data: rateCards, error: rateCardsError } = await supabase
    .from("band_rate_cards")
    .select("band_id, price");

  if (rateCardsError) {
    // Log in dev only, don't expose to user - rate cards are supplementary data
    if (import.meta.env.DEV) {
      console.error("Failed to fetch rate cards:", rateCardsError);
    }
  }

  // Calculate stats per band
  const reviewStats = new Map<string, { totalRating: number; count: number }>();
  reviews?.forEach((review) => {
    const current = reviewStats.get(review.band_id) || { totalRating: 0, count: 0 };
    reviewStats.set(review.band_id, {
      totalRating: current.totalRating + review.rating,
      count: current.count + 1,
    });
  });

  const minRates = new Map<string, number>();
  rateCards?.forEach((card) => {
    const current = minRates.get(card.band_id);
    if (current === undefined || card.price < current) {
      minRates.set(card.band_id, card.price);
    }
  });

  // Map to Band interface
  return bands.map((band: BandWithStats): Band => {
    const stats = reviewStats.get(band.id);
    const avgRating = stats ? Math.round((stats.totalRating / stats.count) * 10) / 10 : 0;
    const reviewCount = stats?.count || 0;
    const startingRate = minRates.get(band.id) || 0;

    return {
      id: band.id,
      name: band.name,
      genre: band.genre,
      location: band.location,
      rating: avgRating,
      reviewCount,
      startingRate,
      imageUrl: band.image_url || "/placeholder.svg",
      featured: band.featured || false,
    };
  });
}

export function useBands() {
  return useQuery({
    queryKey: ["bands"],
    queryFn: fetchBands,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
