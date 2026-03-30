/* ================================================
   Server-Side Processing: Contact Form Handler
   Technology: Deno / Supabase Edge Functions
   Purpose: Process & validate form submissions
   ================================================ */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

var corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type, apikey"
};

serve(async function(request) {
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Parse the form data from the request body
        var body = await request.json();

        // Server-side validation
        if (!body.name || body.name.trim().length < 2) {
            return new Response(JSON.stringify({
                error: "Name must be at least 2 characters"
            }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        if (!body.email || !body.email.includes("@")) {
            return new Response(JSON.stringify({
                error: "Please provide a valid email address"
            }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        if (!body.message || body.message.trim().length < 10) {
            return new Response(JSON.stringify({
                error: "Message must be at least 10 characters"
            }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // Sanitize input (remove HTML tags to prevent XSS)
        var sanitizedName = body.name.replace(/<[^>]*>/g, "");
        var sanitizedMessage = body.message.replace(/<[^>]*>/g, "");

        // Create a ticket object with server timestamp
        var ticket = {
            id: "TKT-" + Date.now(),
            name: sanitizedName,
            email: body.email,
            subject: body.subject || "General Inquiry",
            message: sanitizedMessage,
            status: "open",
            createdAt: new Date().toISOString(),
            priority: determinePriority(sanitizedMessage)
        };

        // In a real application, this would save to a database
        // For demo: we just return the processed ticket
        console.log("New support ticket created:", ticket.id);

        return new Response(JSON.stringify({
            success: true,
            ticketId: ticket.id,
            message: "Your message has been received. We will respond within 2 hours.",
            estimatedResponse: "2 hours"
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});

// Server-side logic: determine ticket priority based on keywords
function determinePriority(message) {
    var urgentKeywords = ["urgent", "emergency", "critical", "broken", "not working"];
    var lowerMessage = message.toLowerCase();

    for (var i = 0; i < urgentKeywords.length; i++) {
        if (lowerMessage.indexOf(urgentKeywords[i]) !== -1) {
            return "high";
        }
    }
    return "normal";
}
