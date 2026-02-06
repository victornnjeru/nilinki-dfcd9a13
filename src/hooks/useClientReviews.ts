import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapOperationError } from "@/lib/errorUtils";

interface ReviewInput {
  bandId: string;
  rating: number;
  content: string;
  eventType: string;
}

async function checkCanReview(bandId: string): Promise<{ canReview: boolean; hasReviewed: boolean; completedBooking: boolean }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { canReview: false, hasReviewed: false, completedBooking: false };
  }

  // Check if user has a completed booking with this band
  const { data: bookings } = await supabase
    .from("booking_inquiries")
    .select("id")
    .eq("band_id", bandId)
    .eq("client_id", user.id)
    .eq("status", "completed")
    .limit(1);

  const hasCompletedBooking = (bookings?.length || 0) > 0;

  // Check if user has already reviewed this band
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id")
    .eq("band_id", bandId)
    .eq("author_id", user.id)
    .limit(1);

  const hasReviewed = (reviews?.length || 0) > 0;

  return {
    canReview: hasCompletedBooking && !hasReviewed,
    hasReviewed,
    completedBooking: hasCompletedBooking,
  };
}

async function submitReview(input: ReviewInput): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Please sign in to submit a review");
  }

  const { error } = await supabase
    .from("reviews")
    .insert({
      band_id: input.bandId,
      author_id: user.id,
      rating: input.rating,
      content: input.content,
      event_type: input.eventType,
    });

  if (error) {
    throw new Error(mapOperationError(error, "create", "review"));
  }
}

export function useCanReview(bandId: string | undefined) {
  return useQuery({
    queryKey: ["can-review", bandId],
    queryFn: () => checkCanReview(bandId!),
    enabled: !!bandId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: (_, variables) => {
      // Invalidate both the can-review check and band profile (to refresh reviews)
      queryClient.invalidateQueries({ queryKey: ["can-review", variables.bandId] });
      queryClient.invalidateQueries({ queryKey: ["band-profile", variables.bandId] });
    },
  });
}
