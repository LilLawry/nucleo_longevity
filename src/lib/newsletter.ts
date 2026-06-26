import crypto from "crypto";

/**
 * Newsletter / lead-capture helpers (Resend, DB-less).
 *
 * Double opt-in without a database: we sign the email with an HMAC token,
 * email a confirmation link, and only add the contact to the Resend audience
 * once the signed link is opened. Configure via env vars:
 *   RESEND_API_KEY      – Resend API key (server-only)
 *   RESEND_AUDIENCE_ID  – the audience/list to add confirmed contacts to
 *   NEWSLETTER_SECRET   – random string used to sign opt-in tokens
 *   NEWSLETTER_FROM     – e.g. "Nucleo Longevity <ciao@nucleolongevity.com>"
 */

export function isConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_AUDIENCE_ID &&
      process.env.NEWSLETTER_SECRET &&
      process.env.NEWSLETTER_FROM
  );
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

const b64url = (s: string) => Buffer.from(s).toString("base64url");
const unb64url = (s: string) => Buffer.from(s, "base64url").toString("utf8");

function sign(payload: string) {
  return crypto
    .createHmac("sha256", process.env.NEWSLETTER_SECRET as string)
    .update(payload)
    .digest("base64url");
}

/** token = base64url(email:lang:ts).signature */
export function makeToken(email: string, lang: string) {
  const payload = `${email}:${lang}:${Date.now()}`;
  return `${b64url(payload)}.${sign(b64url(payload))}`;
}

export function verifyToken(token: string, maxAgeMs = 1000 * 60 * 60 * 48) {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  // constant-time compare
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  )
    return null;
  const [email, lang, ts] = unb64url(body).split(":");
  if (!email || !ts) return null;
  if (Date.now() - Number(ts) > maxAgeMs) return null;
  return { email, lang: lang === "en" ? "en" : "it" };
}

async function resend(path: string, body: unknown) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend ${path} ${res.status}: ${text}`);
  }
  return res.json().catch(() => ({}));
}

export async function addContact(email: string) {
  return resend(`/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
    email,
    unsubscribed: false,
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  return resend(`/emails`, {
    from: process.env.NEWSLETTER_FROM,
    to,
    subject,
    html,
  });
}
