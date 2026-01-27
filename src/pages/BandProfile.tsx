import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Music,
  Users,
  Calendar,
  Clock,
  ExternalLink,
  Play,
  ChevronLeft,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { RequestQuoteModal } from "@/components/bands/RequestQuoteModal";
import { getBandDetails } from "@/data/bandDetails";
import { format } from "date-fns";

export default function BandProfile() {
  const { id } = useParams<{ id: string }>();
  const band = getBandDetails(id || "");

  if (!band) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container px-4 text-center py-20">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Band Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The band you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/bands">Browse All Bands</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Cover Photo */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={band.coverUrl}
            alt={`${band.name} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Band Header */}
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative -mt-24 mb-8"
          >
            {/* Back Button */}
            <Link
              to="/bands"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Bands
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Band Image */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-background shadow-xl flex-shrink-0">
                <img
                  src={band.imageUrl}
                  alt={band.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Band Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Badge variant="secondary">{band.genre}</Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold text-foreground">
                      {band.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({band.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {band.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {band.tagline}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {band.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {band.memberCount} members
                  </div>
                  <div className="flex items-center gap-1">
                    <Music className="h-4 w-4" />
                    {band.yearsActive} years active
                  </div>
                </div>

                <RequestQuoteModal bandName={band.name}>
                  <Button size="lg" className="font-semibold">
                    Request a Quote
                  </Button>
                </RequestQuoteModal>
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      {band.bio.split("\n\n").map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-muted-foreground leading-relaxed mb-4 last:mb-0"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>

              {/* Video Gallery */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display">
                      Performance Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {band.videos.map((video) => (
                        <a
                          key={video.id}
                          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-video rounded-lg overflow-hidden"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                              <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-1" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-sm font-medium text-white">
                              {video.title}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>

              {/* Reviews Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-display">Reviews</CardTitle>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="text-lg font-semibold text-foreground">
                          {band.rating}
                        </span>
                        <span className="text-muted-foreground">
                          ({band.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {band.reviews.map((review, index) => (
                      <div key={review.id}>
                        {index > 0 && <Separator className="mb-6" />}
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.authorImage}
                              alt={review.author}
                            />
                            <AvatarFallback>
                              {review.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-semibold text-foreground">
                                {review.author}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {review.eventType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                      i < review.rating
                                        ? "fill-primary text-primary"
                                        : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(review.date), "MMM d, yyyy")}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {review.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rate Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display">Rate Card</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {band.rateCard.map((rate, index) => (
                      <div key={rate.eventType}>
                        {index > 0 && <Separator className="mb-4" />}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">
                              {rate.eventType}
                            </span>
                            <span className="text-primary font-bold">
                              From ${rate.startingRate.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {rate.description}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {rate.duration}
                          </div>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <RequestQuoteModal bandName={band.name}>
                      <Button className="w-full">Get Custom Quote</Button>
                    </RequestQuoteModal>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Events */}
              {band.upcomingEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display">
                        Upcoming Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {band.upcomingEvents.map((event, index) => (
                        <div key={event.id}>
                          {index > 0 && <Separator className="mb-4" />}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">
                              {event.title}
                            </h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                {event.venue}, {event.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                {format(new Date(event.date), "EEEE, MMM d, yyyy")}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5" />
                                {event.time}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                              asChild
                            >
                              <a
                                href={event.ticketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                Get Tickets
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
