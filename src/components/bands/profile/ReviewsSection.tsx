import { useState } from "react";
import { Star, PenLine } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LeaveReviewDialog } from "./LeaveReviewDialog";
import { useCanReview } from "@/hooks/useClientReviews";
import type { Review } from "@/data/bandProfiles";

interface ReviewsSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
  bandId: string;
  bandName: string;
}

export function ReviewsSection({ reviews, rating, reviewCount, bandId, bandName }: ReviewsSectionProps) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const { data: reviewStatus } = useCanReview(bandId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderReviewButton = () => {
    if (!reviewStatus) return null;

    if (reviewStatus.hasReviewed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button variant="outline" size="sm" disabled>
                  <PenLine className="h-4 w-4 mr-2" />
                  Already Reviewed
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>You've already reviewed this band</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (reviewStatus.canReview) {
      return (
        <Button variant="outline" size="sm" onClick={() => setReviewDialogOpen(true)}>
          <PenLine className="h-4 w-4 mr-2" />
          Leave a Review
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Reviews
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(rating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>
            {renderReviewButton()}
          </div>
        </div>

        {reviews.length === 0 ? (
          <Card className="border-border/50 bg-card">
            <CardContent className="py-8 text-center text-muted-foreground">
              No reviews yet. Be the first to review this band!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.authorImage} alt={review.author} />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground">{review.author}</span>
                        <Badge variant="secondary" className="text-xs">
                          {review.eventType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-primary text-primary"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <LeaveReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bandId={bandId}
        bandName={bandName}
      />
    </>
  );
}
