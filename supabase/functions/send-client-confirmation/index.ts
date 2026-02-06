import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Internal secret for service-to-service calls only
const INTERNAL_API_SECRET = Deno.env.get("INTERNAL_FUNCTION_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

interface ClientConfirmationRequest {
  clientName: string;
  clientEmail: string;
  bandName: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
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

    const {
      clientName,
      clientEmail,
      bandName,
      eventType,
      eventDate,
      eventLocation,
    }: ClientConfirmationRequest = await req.json();

    // Validate required fields
    if (!clientEmail || !clientName || !bandName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the date nicely
    const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailResponse = await resend.emails.send({
      from: "Nilinki <noreply@nilinki.com>",
      to: [clientEmail],
      subject: `Your Booking Inquiry for ${bandName} Has Been Sent`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Booking Inquiry Sent!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; margin-top: 0;">Hi ${clientName},</p>
            
            <p style="font-size: 16px;">Thank you for your interest in booking <strong>${bandName}</strong>! Your inquiry has been successfully sent to the band.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0; color: #6366f1;">Inquiry Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; width: 120px;">Band</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 500;">${bandName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Event Type</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 500;">${eventType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Date</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 500;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Location</td>
                  <td style="padding: 8px 0; font-weight: 500;">${eventLocation}</td>
                </tr>
              </table>
            </div>
            
            <h3 style="color: #374151;">What happens next?</h3>
            <ol style="padding-left: 20px; color: #4b5563;">
              <li style="margin-bottom: 8px;"><strong>${bandName}</strong> will review your inquiry</li>
              <li style="margin-bottom: 8px;">They will reach out to you directly at <strong>${clientEmail}</strong></li>
              <li style="margin-bottom: 8px;">You can discuss details and finalize your booking</li>
            </ol>
            
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">If you have any questions, feel free to reply to this email.</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Nilinki. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Client confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending client confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
