import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Internal secret for calling other edge functions securely
const INTERNAL_API_SECRET = Deno.env.get("INTERNAL_FUNCTION_SECRET");

// Server-side validation schema matching client-side
interface QuoteRequestBody {
  bandId: string;
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  date: string;
  location: string;
  details: string;
}

interface ValidationError {
  field: string;
  message: string;
}

function validateQuoteRequest(body: unknown): { data?: QuoteRequestBody; errors?: ValidationError[] } {
  const errors: ValidationError[] = [];
  
  if (!body || typeof body !== "object") {
    return { errors: [{ field: "body", message: "Invalid request body" }] };
  }
  
  const data = body as Record<string, unknown>;
  
  // Validate bandId
  if (!data.bandId || typeof data.bandId !== "string" || data.bandId.length === 0) {
    errors.push({ field: "bandId", message: "Band ID is required" });
  }
  
  // Validate name
  if (!data.name || typeof data.name !== "string") {
    errors.push({ field: "name", message: "Name is required" });
  } else {
    const name = data.name.trim();
    if (name.length === 0) {
      errors.push({ field: "name", message: "Name is required" });
    } else if (name.length > 100) {
      errors.push({ field: "name", message: "Name must be less than 100 characters" });
    }
  }
  
  // Validate email
  if (!data.email || typeof data.email !== "string") {
    errors.push({ field: "email", message: "Email is required" });
  } else {
    const email = data.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: "email", message: "Invalid email address" });
    } else if (email.length > 255) {
      errors.push({ field: "email", message: "Email must be less than 255 characters" });
    }
  }
  
  // Validate phone (optional)
  if (data.phone !== undefined && data.phone !== null && data.phone !== "") {
    if (typeof data.phone !== "string" || data.phone.trim().length > 20) {
      errors.push({ field: "phone", message: "Phone must be less than 20 characters" });
    }
  }
  
  // Validate eventType
  if (!data.eventType || typeof data.eventType !== "string" || data.eventType.length === 0) {
    errors.push({ field: "eventType", message: "Event type is required" });
  }
  
  // Validate date
  if (!data.date || typeof data.date !== "string" || data.date.length === 0) {
    errors.push({ field: "date", message: "Event date is required" });
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.push({ field: "date", message: "Invalid date format" });
    }
  }
  
  // Validate location
  if (!data.location || typeof data.location !== "string") {
    errors.push({ field: "location", message: "Location is required" });
  } else {
    const location = data.location.trim();
    if (location.length === 0) {
      errors.push({ field: "location", message: "Location is required" });
    } else if (location.length > 200) {
      errors.push({ field: "location", message: "Location must be less than 200 characters" });
    }
  }
  
  // Validate details
  if (!data.details || typeof data.details !== "string") {
    errors.push({ field: "details", message: "Event details are required" });
  } else {
    const details = data.details.trim();
    if (details.length < 10) {
      errors.push({ field: "details", message: "Please provide at least 10 characters of detail" });
    } else if (details.length > 2000) {
      errors.push({ field: "details", message: "Details must be less than 2000 characters" });
    }
  }
  
  if (errors.length > 0) {
    return { errors };
  }
  
  return {
    data: {
      bandId: (data.bandId as string).trim(),
      name: (data.name as string).trim(),
      email: (data.email as string).trim(),
      phone: data.phone ? (data.phone as string).trim() : undefined,
      eventType: (data.eventType as string).trim(),
      date: (data.date as string).trim(),
      location: (data.location as string).trim(),
      details: (data.details as string).trim(),
    },
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input
    const validation = validateQuoteRequest(body);
    if (validation.errors) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = validation.data!;

    // Get auth token from header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's token
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify band exists
    const { data: band, error: bandError } = await supabase
      .from("bands")
      .select("id, name")
      .eq("id", data.bandId)
      .single();

    if (bandError || !band) {
      return new Response(
        JSON.stringify({ error: "Band not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert booking inquiry (RLS policies will be enforced)
    const { error: insertError } = await supabase
      .from("booking_inquiries")
      .insert({
        band_id: data.bandId,
        client_id: user.id,
        event_type: data.eventType,
        event_date: data.date,
        event_location: data.location,
        message: `From: ${data.name} (${data.email})${data.phone ? `, Phone: ${data.phone}` : ""}\n\n${data.details}`,
      });

    if (insertError) {
      // Don't expose internal error details
      return new Response(
        JSON.stringify({ error: "Failed to submit quote request. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get band owner's user_id and contact email from bands table
    const { data: bandDetails } = await supabase
      .from("bands")
      .select("user_id")
      .eq("id", data.bandId)
      .single();

    // Get the band owner's email from their profile (or use a contact email if stored)
    // Note: For proper email notification, band owners should have a contact_email field
    // For now, we'll log a warning that email notification requires manual setup
    const bandOwnerUserId = bandDetails?.user_id;
    
    // Since we can't access auth.users directly without admin API, band notification 
    // emails require the band to have a contact email stored in their profile or bands table
    // This is a security improvement - no admin API usage
    
    console.log("Quote request submitted successfully. Band owner notification would be sent if contact email is configured.", {
      bandId: data.bandId,
      bandOwnerUserId,
    });

    // Send confirmation email to client using internal secret (fire and forget - don't block on this)
    if (INTERNAL_API_SECRET) {
      fetch(`${supabaseUrl}/functions/v1/send-client-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": INTERNAL_API_SECRET,
        },
        body: JSON.stringify({
          clientName: data.name,
          clientEmail: data.email,
          bandName: band.name,
          eventType: data.eventType,
          eventDate: data.date,
          eventLocation: data.location,
        }),
      }).catch(err => console.error("Failed to send client confirmation email:", err));
    }

    return new Response(
      JSON.stringify({ success: true, message: `Quote request sent to ${band.name}` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch {
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});