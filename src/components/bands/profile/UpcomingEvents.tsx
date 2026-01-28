import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UpcomingEvent } from "@/data/bandProfiles";

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  if (events.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Upcoming Events
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="border-border/50 bg-card overflow-hidden hover:border-primary/50 transition-colors">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-40 h-32 sm:h-auto overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="flex-1 p-4">
                <h3 className="font-semibold text-foreground mb-2">{event.name}</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                  <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                    Get Tickets
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
