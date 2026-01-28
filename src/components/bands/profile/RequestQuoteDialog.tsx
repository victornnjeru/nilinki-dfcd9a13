import { useState } from "react";
import { Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventTypes } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface RequestQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bandName: string;
}

export function RequestQuoteDialog({ open, onOpenChange, bandName }: RequestQuoteDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    toast({
      title: "Quote Request Sent!",
      description: `Your inquiry has been sent to ${bandName}. They'll get back to you soon.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Request a Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below to send an inquiry to {bandName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Event Date</Label>
              <div className="relative">
                <Input id="date" type="date" required />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Event Location</Label>
              <Input id="location" placeholder="City, Country" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Event Details</Label>
            <Textarea
              id="details"
              placeholder="Tell us about your event, expected guests, special requests..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Inquiry
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
