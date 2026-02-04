import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InquiryList } from "@/components/dashboard/InquiryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingInquiries, useUpdateInquiryStatus } from "@/hooks/useBookingInquiries";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function BandDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const { data: inquiries = [], isLoading, error } = useBookingInquiries();
  const updateStatus = useUpdateInquiryStatus();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      
      // Check if user has band role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roles?.role !== "band") {
        toast({
          title: "Access denied",
          description: "This dashboard is only for band owners.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAuthenticated(true);
    };

    checkAuth();
  }, [navigate, toast]);

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast({
            title: "Status updated",
            description: `Inquiry has been ${status}.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Update failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  // Filter inquiries by status
  const filteredInquiries = activeTab === "all"
    ? inquiries
    : inquiries.filter((inq) => inq.status === activeTab);

  // Stats
  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === "pending").length,
    accepted: inquiries.filter((i) => i.status === "accepted").length,
    declined: inquiries.filter((i) => i.status === "declined").length,
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Booking Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your booking inquiries and requests from clients.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.accepted}</p>
                    <p className="text-sm text-muted-foreground">Accepted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.declined}</p>
                    <p className="text-sm text-muted-foreground">Declined</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inquiries List with Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
              <TabsTrigger value="declined">Declined ({stats.declined})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <InquiryList
                inquiries={filteredInquiries}
                isLoading={isLoading}
                error={error}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updateStatus.isPending}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
