import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BookingInquiry {
  id: string;
  band_id: string;
  client_id: string;
  event_date: string;
  event_type: string;
  event_location: string | null;
  guest_count: number | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_email?: string;
}

async function fetchBookingInquiries(): Promise<BookingInquiry[]> {
  // First get the current user's band
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }

  // Fetch inquiries for the user's band (RLS handles filtering)
  const { data, error } = await supabase
    .from("booking_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch inquiries: ${error.message}`);
  }

  return data || [];
}

async function updateInquiryStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("booking_inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update inquiry: ${error.message}`);
  }
}

export function useBookingInquiries() {
  return useQuery({
    queryKey: ["booking-inquiries"],
    queryFn: fetchBookingInquiries,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-inquiries"] });
    },
  });
}
