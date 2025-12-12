import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  // CORS Preflight abfangen
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  }

  try {
    const bodyText = await req.text();
    if (!bodyText) {
      return new Response("No body", { status: 400 });
    }

    const { name, email, message } = JSON.parse(bodyText);

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response("Missing RESEND_API_KEY", { status: 500 });
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
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Nachricht:</b><br>${message}</p>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response("Server error", {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});
