import { format } from "date-fns";
import { Calendar, MapPin, Users, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BookingInquiry } from "@/hooks/useBookingInquiries";

interface InquiryCardProps {
  inquiry: BookingInquiry;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  accepted: "bg-green-500/10 text-green-600 border-green-500/20",
  declined: "bg-red-500/10 text-red-600 border-red-500/20",
  completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export function InquiryCard({ inquiry, onUpdateStatus, isUpdating }: InquiryCardProps) {
  const statusColor = statusColors[inquiry.status] || statusColors.pending;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {inquiry.event_type}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3.5 w-3.5" />
              Received {format(new Date(inquiry.created_at), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <Badge variant="outline" className={statusColor}>
            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(new Date(inquiry.event_date), "MMMM d, yyyy")}</span>
          </div>
          {inquiry.event_location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{inquiry.event_location}</span>
            </div>
          )}
          {inquiry.guest_count && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>{inquiry.guest_count} guests</span>
            </div>
          )}
        </div>

        {/* Message */}
        {inquiry.message && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{inquiry.message}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        {inquiry.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onUpdateStatus(inquiry.id, "accepted")}
              disabled={isUpdating}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(inquiry.id, "declined")}
              disabled={isUpdating}
            >
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
