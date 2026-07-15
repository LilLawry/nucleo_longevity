# Núkleo — guida attivazione (passo-passo)

Tre cose accendono il progetto. Sono tutte azioni sui TUOI account: nessuno può
farle al posto tuo. Ordine consigliato: 1 → 2 → 3.

---

## 1) Google Search Console — per farti TROVARE (~10 min)
1. Vai su https://search.google.com/search-console
2. Accedi col tuo Google → "Aggiungi proprietà" → scegli **Dominio** → scrivi
   `nucleolongevity.com`
3. Ti dà un record **TXT**. Copialo.
4. Vai su Vercel → https://vercel.com/dashboard → progetto → **Settings → Domains**
   (o **DNS** se gestisci il DNS lì) → aggiungi un record **TXT** e incolla il valore
   → Salva.
5. Torna su Search Console → **Verifica**.
6. Dentro: menu **Sitemap** → incolla `https://www.nucleolongevity.com/sitemap.xml`
   → **Invia**.
7. (Bonus) menu **Controllo URL** → incolla la scheda NMN → **Richiedi indicizzazione**.

---

## 2) Resend — per far funzionare newsletter + lead magnet (~15 min)
Serve a raccogliere le email (oggi il form dà errore perché mancano le chiavi).
1. Vai su https://resend.com → accedi.
2. **API Keys** (https://resend.com/api-keys) → **Create API Key** → copia il valore
   (inizia con `re_...`). È `RESEND_API_KEY`.
3. **Audiences** (https://resend.com/audiences) → crea un'audience → copia il suo
   **Audience ID**. È `RESEND_AUDIENCE_ID`.
4. Dominio email: **Domains** (https://resend.com/domains) → verifica
   `nucleolongevity.com` (aggiungi i record DNS che ti dà, su Vercel DNS).
5. Vai su Vercel → progetto → **Settings → Environment Variables** e aggiungi 4 variabili
   (Production + Preview):

   | Nome | Valore |
   |---|---|
   | `RESEND_API_KEY` | la chiave `re_...` |
   | `RESEND_AUDIENCE_ID` | l'ID audience |
   | `NEWSLETTER_FROM` | `Nucleo Longevity <ciao@nucleolongevity.com>` |
   | `NEWSLETTER_SECRET` | una stringa lunga casuale (te ne ho data una in chat) |

6. Vercel → **Deployments** → ultimo deploy → **Redeploy**. Fatto: il form ora funziona.

---

## 3) Comparatore — offerte reali (quando vuoi monetizzare)
NON serve scraping: i dati te li dà il venditore via feed affiliato.
1. Iscriviti a un programma:
   - **Amazon Associati** (facile, anche persona fisica): https://programma-affiliazione.amazon.it
   - **Awin**: https://www.awin.com/it
   - **Tradedoubler**: https://www.tradedoubler.com
2. Fatti approvare per i merchant che vendono le molecole (integratori).
3. Scarica il loro **product feed** (CSV/XML): ha prezzo, EAN, immagine (con diritti)
   e il tuo link affiliato.
4. Compila due file (template in `sample-data/comparator/`):
   - `content/comparator/merchants.csv`
   - `content/comparator/offers.csv`
   (schema completo in `content/comparator/README.md`).
5. Metti `affiliate = true` su un merchant SOLO se hai un contratto firmato con lui.
6. Commit → il sito ripubblica → offerte reali live, il badge "demo" sparisce da solo.

> Preferisci non compilare a mano? Mandami UN feed CSV di un merchant approvato e
> te lo converto io nel formato giusto.

### Prima di incassare davvero
Un sito che guadagna commissioni in modo continuativo = attività d'impresa →
serve **partita IVA** (di solito regime forfettario). Parlane con un
**commercialista** prima del primo incasso affiliato. `LEGAL/TAX REVIEW REQUIRED`.

---

## Cosa è già fatto (lato codice, live)
- 42 molecole, database, report card (lead magnet), pagina Evidence/analisi.
- Comparatore "Dove acquistare" con ranking per prezzo, disclosure onesta,
  redirect sicuro `/go/[id]`, dati da CSV.
- Pagina trasparenza `/confronto` (linkata da footer e da ogni tabella offerte).
- SEO tecnico: sitemap, canonical, hreflang, schema, 41 schede indicizzabili.
