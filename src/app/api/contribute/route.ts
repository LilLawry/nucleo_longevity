import { NextResponse } from "next/server";
import { isValidEmail, sendEmail } from "@/lib/newsletter";

export const runtime = "nodejs";

const TYPES = new Set(["esperto", "professionista", "partner"]);

export async function POST(req: Request) {
  let name = "", email = "", type = "", message = "", links = "";
  try {
    const d = await req.json();
    name = String(d.name || "").trim().slice(0, 120);
    email = String(d.email || "").trim().toLowerCase();
    type = String(d.type || "").trim();
    message = String(d.message || "").trim().slice(0, 4000);
    links = String(d.links || "").trim().slice(0, 500);
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  if (!name || !isValidEmail(email) || !TYPES.has(type) || message.length < 10) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const to = process.env.NEWSLETTER_NOTIFY;
  if (!process.env.RESEND_API_KEY || !process.env.NEWSLETTER_FROM || !to) {
    console.error("[contribute] not configured");
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    await sendEmail(
      to,
      `🤝 Candidatura Nucleo (${type}): ${name}`,
      `<div style="font-family:Helvetica,Arial,sans-serif">
        <p><b>Tipo:</b> ${type}</p>
        <p><b>Nome:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Link:</b> ${links || "—"}</p>
        <p><b>Messaggio:</b><br/>${message.replace(/</g, "&lt;").replace(/\n/g, "<br/>")}</p>
      </div>`
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contribute] send failed", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
