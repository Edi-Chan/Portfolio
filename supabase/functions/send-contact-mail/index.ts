import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      name,
      email,
      phone,
      contactPreference,
      projectType,
      goal,
      timeline,
      message,
    } = await req.json();

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kontaktformular <kontakt@dragoidesign.com>",
        to: ["edi_dragoi@ik.me"],
        subject: "Neue Kontaktanfrage",
        html: `
          <h3>Neue Kontaktanfrage</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>E-Mail:</b> ${email}</p>
          <p><b>Telefon:</b> ${phone || "-"}</p>
          <p><b>Bevorzugter Kontakt:</b> ${contactPreference || "-"}</p>
          <p><b>Projektart:</b> ${projectType}</p>
          <p><b>Ziel:</b> ${goal}</p>
          <p><b>Zeitraum:</b> ${timeline || "-"}</p>
          <hr>
          <p><b>Nachricht:</b><br>${message}</p>
        `,
      }),
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
