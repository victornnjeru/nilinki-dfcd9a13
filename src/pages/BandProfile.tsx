import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileHeader } from "@/components/bands/profile/ProfileHeader";
import { VideoGallery } from "@/components/bands/profile/VideoGallery";
import { RateCardSection } from "@/components/bands/profile/RateCardSection";
import { ReviewsSection } from "@/components/bands/profile/ReviewsSection";
import { UpcomingEvents } from "@/components/bands/profile/UpcomingEvents";
import { RequestQuoteDialog } from "@/components/bands/profile/RequestQuoteDialog";
import { useBandProfile } from "@/hooks/useBandProfile";

export default function BandProfile() {
  const { id } = useParams<{ id: string }>();
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  
  const { data: band, isLoading, error } = useBandProfile(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading band profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !band) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Band Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The band you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/bands">Browse All Bands</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Back Button */}
      <div className="container pt-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/bands">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bands
          </Link>
        </Button>
      </div>

      {/* Profile Header */}
      <ProfileHeader band={band} onRequestQuote={() => setQuoteDialogOpen(true)} />

      {/* Content Tabs */}
      <div className="container py-8">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                About {band.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {band.longBio}
              </p>
            </section>

            {band.videos.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  Featured Performances
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {band.videos.slice(0, 3).map((video) => (
                    <div key={video.id} className="aspect-video rounded-lg overflow-hidden border border-border">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <RateCardSection rateCards={band.rateCards} />
          </TabsContent>

          <TabsContent value="videos">
            <VideoGallery videos={band.videos} />
          </TabsContent>

          <TabsContent value="rates">
            <RateCardSection rateCards={band.rateCards} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsSection
              reviews={band.reviews}
              rating={band.rating}
              reviewCount={band.reviewCount}
              bandId={band.id}
              bandName={band.name}
            />
          </TabsContent>

          <TabsContent value="events">
            <UpcomingEvents events={band.upcomingEvents} />
            {band.upcomingEvents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No upcoming public events scheduled.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Quote Dialog */}
      <RequestQuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        bandName={band.name}
        bandId={band.id}
      />

      <Footer />
    </div>
  );
}
