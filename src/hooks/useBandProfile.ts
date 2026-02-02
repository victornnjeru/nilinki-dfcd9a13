import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BandProfile, Video, RateCard, Review, UpcomingEvent } from "@/data/bandProfiles";

async function fetchBandProfile(bandId: string): Promise<BandProfile | null> {
  // Fetch band details
  const { data: band, error: bandError } = await supabase
    .from("bands")
    .select("*")
    .eq("id", bandId)
    .maybeSingle();

  if (bandError) {
    throw new Error(`Failed to fetch band: ${bandError.message}`);
  }

  if (!band) {
    return null;
  }

  // Fetch related data in parallel
  const [videosResult, rateCardsResult, reviewsResult, eventsResult] = await Promise.all([
    supabase.from("band_videos").select("*").eq("band_id", bandId),
    supabase.from("band_rate_cards").select("*").eq("band_id", bandId),
    supabase.from("reviews").select("*").eq("band_id", bandId).order("created_at", { ascending: false }),
    supabase.from("band_events").select("*").eq("band_id", bandId).eq("is_visible", true).order("event_date", { ascending: true }),
  ]);

  // Map videos
  const videos: Video[] = (videosResult.data || []).map((v) => ({
    id: v.id,
    title: v.title,
    thumbnailUrl: v.thumbnail_url || "",
    videoUrl: v.video_url,
    platform: v.platform as "youtube" | "vimeo",
  }));

  // Map rate cards
  const rateCards: RateCard[] = (rateCardsResult.data || []).map((r) => ({
    eventType: r.event_type,
    price: Number(r.price),
    duration: r.duration || "",
    description: r.description || "",
  }));

  // Map reviews
  const reviews: Review[] = (reviewsResult.data || []).map((r) => ({
    id: r.id,
    author: "Anonymous", // We'd need to join profiles for real names
    authorImage: "/placeholder.svg",
    rating: r.rating,
    date: r.created_at.split("T")[0],
    eventType: r.event_type || "",
    content: r.content || "",
  }));

  // Map events
  const upcomingEvents: UpcomingEvent[] = (eventsResult.data || []).map((e) => ({
    id: e.id,
    name: e.name,
    venue: e.venue,
    date: e.event_date,
    time: e.event_time,
    ticketUrl: e.ticket_url || "",
    imageUrl: e.image_url || "/placeholder.svg",
  }));

  // Calculate rating stats
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length > 0 ? Math.round((totalRating / reviews.length) * 10) / 10 : 0;

  // Find starting rate
  const startingRate = rateCards.length > 0 
    ? Math.min(...rateCards.map(r => r.price))
    : 0;

  return {
    id: band.id,
    name: band.name,
    genre: band.genre,
    location: band.location,
    rating: avgRating,
    reviewCount: reviews.length,
    startingRate,
    imageUrl: band.image_url || "/placeholder.svg",
    featured: band.featured || false,
    coverUrl: band.cover_url || band.image_url || "/placeholder.svg",
    bio: band.bio || `Professional ${band.genre.toLowerCase()} band based in ${band.location}.`,
    longBio: band.long_bio || `We are a passionate ${band.genre.toLowerCase()} band dedicated to delivering unforgettable live performances.`,
    yearsActive: band.years_active || 1,
    members: band.members || 1,
    videos,
    rateCards,
    reviews,
    upcomingEvents,
    socialLinks: {
      instagram: band.instagram || undefined,
      facebook: band.facebook || undefined,
      youtube: band.youtube || undefined,
      spotify: band.spotify || undefined,
    },
  };
}

export function useBandProfile(bandId: string | undefined) {
  return useQuery({
    queryKey: ["band-profile", bandId],
    queryFn: () => fetchBandProfile(bandId!),
    enabled: !!bandId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
