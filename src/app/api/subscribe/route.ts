import { NextResponse } from "next/server";
import {
  CONSENT_TEXT,
  isConfigured,
  isValidEmail,
  makeToken,
  sendEmail,
} from "@/lib/newsletter";

export const runtime = "nodejs";

function confirmEmailHtml(confirmUrl: string, lang: string) {
  const it = lang !== "en";
  const title = it ? "Conferma la tua iscrizione" : "Confirm your subscription";
  const body = it
    ? "Un ultimo passo: conferma il tuo indirizzo per ricevere le analisi Nucleo e la guida alle molecole longevity."
    : "One last step: confirm your address to receive Nucleo analyses and the longevity molecules guide.";
  const cta = it ? "Conferma e scarica la guida" : "Confirm & get the guide";
  const ignore = it
    ? "Se non hai richiesto tu questa iscrizione, ignora pure questa email."
    : "If you didn't request this, just ignore this email.";
  return `<!doctype html><html><body style="margin:0;background:#EEF1F1;font-family:Helvetica,Arial,sans-serif;color:#15191B">
  <div style="max-width:520px;margin:0 auto;padding:40px 28px">
    <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#11605F;font-weight:600;margin-bottom:28px">NUCLEO · LONGEVITY</div>
    <h1 style="font-size:26px;line-height:1.2;margin:0 0 14px">${title}</h1>
    <p style="font-size:15px;line-height:1.6;color:#5C6669;margin:0 0 28px">${body}</p>
    <a href="${confirmUrl}" style="display:inline-block;background:#11605F;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 26px;border-radius:6px">${cta}</a>
    <p style="font-size:12px;line-height:1.6;color:#8A9295;margin:32px 0 0">${ignore}</p>
  </div></body></html>`;
}

export async function POST(req: Request) {
  let email = "";
  let lang = "it";
  let consent = false;
  try {
    const data = await req.json();
    email = String(data.email || "").trim().toLowerCase();
    lang = data.lang === "en" ? "en" : "it";
    consent = data.consent === true;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  }
  // GDPR: explicit consent is mandatory.
  if (!consent) {
    return NextResponse.json({ error: "consent_required" }, { status: 422 });
  }
  // Consent log (timestamp + accepted text). Server log = auditable record;
  // the signed token also carries the request timestamp through to confirm.
  console.info(
    "[consent]",
    JSON.stringify({
      email,
      lang,
      consentText: CONSENT_TEXT[lang as "it" | "en"],
      at: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || "n/a",
    })
  );

  if (!isConfigured()) {
    // Fail loudly in logs so the operator knows to set env vars, but don't
    // leak details to the client.
    console.error("[newsletter] Resend env vars not configured");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const origin = new URL(req.url).origin;
    const token = makeToken(email, lang);
    const confirmUrl = `${origin}/api/confirm?token=${encodeURIComponent(token)}`;
    await sendEmail(
      email,
      lang === "en"
        ? "Confirm your Nucleo subscription"
        : "Conferma la tua iscrizione a Nucleo",
      confirmEmailHtml(confirmUrl, lang)
    );
    return NextResponse.json({ ok: true, pending: true });
  } catch (err) {
    console.error("[newsletter] subscribe failed", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
