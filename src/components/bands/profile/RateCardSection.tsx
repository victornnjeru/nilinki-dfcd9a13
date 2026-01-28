import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RateCard } from "@/data/bandProfiles";

interface RateCardSectionProps {
  rateCards: RateCard[];
}

export function RateCardSection({ rateCards }: RateCardSectionProps) {
  if (rateCards.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Rate Card
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rateCards.map((rate, index) => (
          <Card 
            key={index} 
            className="border-border/50 bg-card hover:border-primary/50 transition-colors"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-foreground">
                {rate.eventType}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">${rate.price.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">/ {rate.duration}</span>
              </div>
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {rate.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
