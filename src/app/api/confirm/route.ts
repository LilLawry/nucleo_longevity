import { NextResponse } from "next/server";
import { CONSENT_TEXT, addContact, isConfigured, sendEmail, verifyToken } from "@/lib/newsletter";

export const runtime = "nodejs";

function welcomeHtml(guideUrl: string, lang: string) {
  const it = lang !== "en";
  const title = it ? "Benvenuto in Nucleo." : "Welcome to Nucleo.";
  const body = it
    ? "Iscrizione confermata. Ecco la tua guida alle molecole longevity, con i gradi di evidenza A–F e le fonti PubMed."
    : "Subscription confirmed. Here's your longevity molecules guide, with A–F evidence grades and PubMed sources.";
  const cta = it ? "Apri la guida" : "Open the guide";
  const sign = it
    ? "Riceverai una nuova analisi ogni due settimane. Niente hype, solo dati."
    : "You'll get a new analysis every two weeks. No hype, only data.";
  return `<!doctype html><html><body style="margin:0;background:#EEF1F1;font-family:Helvetica,Arial,sans-serif;color:#15191B">
  <div style="max-width:520px;margin:0 auto;padding:40px 28px">
    <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#11605F;font-weight:600;margin-bottom:28px">NUCLEO · LONGEVITY</div>
    <h1 style="font-size:26px;line-height:1.2;margin:0 0 14px">${title}</h1>
    <p style="font-size:15px;line-height:1.6;color:#5C6669;margin:0 0 28px">${body}</p>
    <a href="${guideUrl}" style="display:inline-block;background:#11605F;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 26px;border-radius:6px">${cta}</a>
    <p style="font-size:13px;line-height:1.6;color:#8A9295;margin:32px 0 0">${sign}</p>
  </div></body></html>`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const verified = verifyToken(token);

  if (!verified) {
    return NextResponse.redirect(new URL("/it/grazie?status=invalid", url.origin));
  }
  if (!isConfigured()) {
    return NextResponse.redirect(new URL(`/${verified.lang}/grazie?status=error`, url.origin));
  }

  try {
    await addContact(verified.email);
    const guideUrl = `${url.origin}/${verified.lang}/guida`;
    await sendEmail(
      verified.email,
      verified.lang === "en" ? "Your Nucleo longevity guide" : "La tua guida longevity Nucleo",
      welcomeHtml(guideUrl, verified.lang)
    );
    // Notify the site owner that a new lead came in (optional).
    if (process.env.NEWSLETTER_NOTIFY) {
      await sendEmail(
        process.env.NEWSLETTER_NOTIFY,
        `Nuovo lead Nucleo: ${verified.email}`,
        `<p style="font-family:Helvetica,Arial,sans-serif">Nuovo iscritto confermato (double opt-in).</p>
         <p style="font-family:Helvetica,Arial,sans-serif"><b>Email:</b> ${verified.email}<br/>
         <b>Lingua:</b> ${verified.lang}<br/>
         <b>Richiesta (consenso):</b> ${new Date(verified.ts).toISOString()}<br/>
         <b>Conferma:</b> ${new Date().toISOString()}</p>
         <p style="font-family:Helvetica,Arial,sans-serif;color:#5C6669"><b>Testo consenso accettato:</b><br/>${CONSENT_TEXT[verified.lang as "it" | "en"]}</p>
         <p style="font-family:Helvetica,Arial,sans-serif;color:#5C6669">È già in audience su Resend.</p>`
      ).catch((e) => console.error("[newsletter] notify failed", e));
    }
  } catch (err) {
    console.error("[newsletter] confirm failed", err);
    return NextResponse.redirect(new URL(`/${verified.lang}/grazie?status=error`, url.origin));
  }

  return NextResponse.redirect(new URL(`/${verified.lang}/grazie?status=ok`, url.origin));
}
