import { NextResponse } from "next/server";
import { isValidEmail, sendEmail } from "@/lib/newsletter";

export const runtime = "nodejs";

const VARIANTS = new Set(["brand", "rep"]);

export async function POST(req: Request) {
  let data: Record<string, string> = {};
  let variant = "";
  let email = "";
  let consent = false;
  try {
    const body = await req.json();
    variant = String(body.variant || "");
    email = String(body.email || "").trim().toLowerCase();
    consent = body.consent === true;
    data = body.fields && typeof body.fields === "object" ? body.fields : {};
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!VARIANTS.has(variant) || !isValidEmail(email) || !consent) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const to = process.env.NEWSLETTER_NOTIFY;
  if (!process.env.RESEND_API_KEY || !process.env.NEWSLETTER_FROM || !to) {
    console.error("[connect] not configured");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const safe = (s: string) => String(s || "—").replace(/</g, "&lt;").slice(0, 2000);
  const rows = Object.entries(data)
    .map(([k, v]) => `<p style="margin:2px 0"><b>${safe(k)}:</b> ${safe(v)}</p>`)
    .join("");

  // Consent log: server record (timestamp + accepted text).
  console.info("[connect-consent]", JSON.stringify({ variant, email, at: new Date().toISOString() }));

  try {
    await sendEmail(
      to,
      `Connect (${variant}) — ${email}`,
      `<div style="font-family:Helvetica,Arial,sans-serif">
        <p><b>Type:</b> ${variant === "brand" ? "Brand / Manufacturer" : "Sales rep / Agent"}</p>
        <p><b>Email:</b> ${safe(email)}</p>
        ${rows}
        <p style="color:#5C6669">Consent accepted · ${new Date().toISOString()}</p>
      </div>`
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[connect] send failed", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
