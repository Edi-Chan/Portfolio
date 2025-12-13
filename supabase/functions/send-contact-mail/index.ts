// Importiert die serve-Funktion aus dem Deno Standardmodul.
// Sie startet einen HTTP-Server und verarbeitet eingehende Requests.
import { serve } from "https://deno.land/std/http/server.ts";

// Definiert die CORS-Header.
// Erlaubt Zugriffe von überall und legt erlaubte Header fest.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};

// Startet den HTTP-Server.
// Die anonyme async-Funktion wird für jeden Request ausgeführt.
serve(async (req) => {

  // Behandelt CORS-Preflight-Requests (OPTIONS).
  // Browser schicken diese vor eigentlichen Requests.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // -------- FORM DATA --------
    // Liest alle übermittelten Formulardaten (Textfelder + Dateien).
    const formData = await req.formData();

    // -------- HONEYPOT (MUSS ZUERST) --------
    // Anti-Bot-Feld: echte Nutzer lassen es leer.
    // Bots füllen es aus → Anfrage wird still ignoriert.
    const honeypot = formData.get("website")?.toString();
    if (honeypot) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: corsHeaders }
      );
    }

    // -------- FORM FIELDS --------
    // Holt alle Formularfelder als Strings.
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString();
    const contactPreference = formData.get("contactPreference")?.toString();
    const projectType = formData.get("projectType")?.toString();
    const goal = formData.get("goal")?.toString();
    const timeline = formData.get("timeline")?.toString();
    const message = formData.get("message")?.toString();

    // Validiert Pflichtfelder.
    // Wenn eines fehlt oder leer ist → Fehler.
    if (
      !name?.trim() ||
      !email?.trim() ||
      !message?.trim() ||
      !projectType?.trim() ||
      !goal?.trim()
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // -------- FILES --------
    // Holt alle hochgeladenen Dateien mit dem Feldnamen "files[]".
    // Filtert leere Dateien raus.
    const files = (formData.getAll("files[]") as File[]).filter(
      file => file.size > 0
    );

    // Maximale Anzahl an Dateien.
    const MAX_FILES = 5;

    // Maximale Dateigröße: 5 MB.
    const MAX_SIZE = 5 * 1024 * 1024;

    // Erlaubte MIME-Typen.
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    // Prüft die maximale Anzahl an Dateien.
    if (files.length > MAX_FILES) {
      return new Response(
        JSON.stringify({ error: "Too many files" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Array für E-Mail-Anhänge.
    let attachments: any[] = [];

    // Verarbeitet jede hochgeladene Datei einzeln.
    for (const file of files) {

      // Prüft den Dateityp.
      if (!ALLOWED_TYPES.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: "Invalid file type" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Prüft die Dateigröße.
      if (file.size > MAX_SIZE) {
        return new Response(
          JSON.stringify({ error: "File too large" }),
          { status: 400, headers: corsHeaders }
        );
      }

      // Wandelt die Datei in einen Base64-String um.
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(buffer))
      );

      // Fügt die Datei als E-Mail-Anhang hinzu.
      attachments.push({
        filename: file.name,
        content: base64,
        content_type: file.type,
      });
    }

    // -------- RESEND --------
    // Holt den API-Key aus den Environment-Variablen.
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Sendet die Haupt-E-Mail an dich.
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
        attachments,
      }),
    });

    // -------- AUTO-REPLY --------
    // Sendet eine automatische Bestätigungs-E-Mail an den Absender.
    const autoReplyRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Dragoi Design <kontakt@dragoidesign.com>",
        reply_to: "kontakt@dragoidesign.com",
        to: [email],
        subject: "Anfrage erhalten – Dragoi Design",
        text: `
Hallo ${name},

danke für deine Nachricht. Deine Anfrage ist bei mir angekommen.

Ich melde mich so bald wie möglich persönlich bei dir zurück.

Liebe Grüße
Eduard Dragoi

Dragoi Design
        `.trim(),
      }),
    });

    // Loggt die Antwort von Resend zur Fehlersuche.
    const autoReplyText = await autoReplyRes.text();
    console.log("AUTO-REPLY STATUS:", autoReplyRes.status);
    console.log("AUTO-REPLY RESPONSE:", autoReplyText);

    // Erfolgreiche Antwort an den Client.
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
    // Fängt alle unerwarteten Fehler ab und loggt sie.
    console.error("FUNCTION ERROR:", err);

    return new Response(
      JSON.stringify({
        error: "Server error",
        details: String(err),
      }),
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
