import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Internal secret for service-to-service calls only
const INTERNAL_API_SECRET = Deno.env.get("INTERNAL_FUNCTION_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-internal-secret",
};

interface NotificationRequest {
  bandEmail: string;
  bandName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  message: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate internal secret - this function should only be called by other edge functions
    const internalSecret = req.headers.get("x-internal-secret");
    if (!INTERNAL_API_SECRET || internalSecret !== INTERNAL_API_SECRET) {
      console.error("Unauthorized: Invalid or missing internal secret");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data: NotificationRequest = await req.json();

    const formattedDate = new Date(data.eventDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailResponse = await resend.emails.send({
      from: "Nilinki <noreply@nilinki.com>",
      to: [data.bandEmail],
      subject: `New Booking Inquiry: ${data.eventType} on ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: 600; color: #6b7280; min-width: 120px; }
            .detail-value { color: #111827; }
            .message-box { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #667eea; }
            .cta { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🎵 New Booking Inquiry!</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">Hey ${data.bandName}, you've received a new booking request.</p>
            </div>
            <div class="content">
              <h2 style="margin-top: 0; color: #111827;">Event Details</h2>
              
              <div class="detail-row">
                <span class="detail-label">Event Type</span>
                <span class="detail-value">${data.eventType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location</span>
                <span class="detail-value">${data.eventLocation}</span>
              </div>
              
              <h2 style="color: #111827; margin-top: 30px;">Client Information</h2>
              
              <div class="detail-row">
                <span class="detail-label">Name</span>
                <span class="detail-value">${data.clientName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email</span>
                <span class="detail-value"><a href="mailto:${data.clientEmail}">${data.clientEmail}</a></span>
              </div>
              ${data.clientPhone ? `
              <div class="detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">${data.clientPhone}</span>
              </div>
              ` : ""}
              
              <div class="message-box">
                <h3 style="margin-top: 0; color: #374151;">Message from Client</h3>
                <p style="margin-bottom: 0; white-space: pre-wrap;">${data.message}</p>
              </div>
              
              <a href="https://nilinki.lovable.app/dashboard" class="cta">View in Dashboard →</a>
            </div>
            <div class="footer">
              <p>This email was sent by Nilinki. You're receiving this because someone submitted a booking inquiry for your band.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Booking notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending booking notification:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
