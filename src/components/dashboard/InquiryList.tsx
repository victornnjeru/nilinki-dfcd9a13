import { Inbox, Loader2 } from "lucide-react";
import { InquiryCard } from "./InquiryCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookingInquiry } from "@/hooks/useBookingInquiries";

interface InquiryListProps {
  inquiries: BookingInquiry[];
  isLoading: boolean;
  error: Error | null;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating: boolean;
}

export function InquiryList({
  inquiries,
  isLoading,
  error,
  onUpdateStatus,
  isUpdating,
}: InquiryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
          <Inbox className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-muted-foreground">Failed to load inquiries</p>
        <p className="text-sm text-muted-foreground/70 mt-1">{error.message}</p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No inquiries yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          When clients send you booking requests, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <InquiryCard
          key={inquiry.id}
          inquiry={inquiry}
          onUpdateStatus={onUpdateStatus}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
}
