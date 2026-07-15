# Nucleo Longevity — panoramica completa (per condividere il contesto)

> Documento pensato per essere incollato a un assistente (es. ChatGPT) che non
> può vedere il sito live, così da capire cos'è e proporre migliorie.

## Cos'è
**Nucleo Longevity** è un osservatorio editoriale indipendente sulle molecole
per la longevità. Concept unico: **"vivere più a lungo, invecchiare meglio —
dentro e fuori"**. Ogni molecola riceve un **voto A–F** basato solo
sull'evidenza clinica (PubMed), non sul marketing. Include sia molecole
**sistemiche** (integratori/farmaci che si prendono) sia attivi **topici**
(skincare che si applica): la skin-longevity è trattata come una faccia della
stessa longevity, non come sezione separata.

- Live: https://www.nucleolongevity.com
- Bilingue: **inglese (primario)** + italiano, con hreflang/canonical.
- Tono: clinico, editoriale, sobrio, anti-hype, E-E-A-T. Redazione anonima
  ("Redazione Nucleo") con dietro un professionista delle vendite del settore.

## Stack tecnico
- **Next.js 14 (App Router)** + TypeScript, **Tailwind**, deploy su **Vercel**
  (push su `main` → deploy produzione). NON è WordPress.
- Contenuti in **MDX/Markdown** nel repo (`content/`), letti con gray-matter.
- Font self-hosted (Hanken Grotesk / Newsreader serif / IBM Plex Mono).
- Libreria animazioni `motion` per l'hero.
- Newsletter via **Resend** (double opt-in, GDPR); analytics **Plausible**
  (predisposto).

## Vincolo estetico (non negoziabile)
Estetica "clinica/editoriale": **niente gradienti, glow, blur, glassmorphism,
ombre morbide, emoji nell'UI, loghi brand finti, font Inter**. Sì a: bordi
hairline 1px, radius minimo (2px), numeri tabulari, micro-label mono uppercase,
chip voto A–F sobri, citazioni PMID in stile nota, corpo serif editoriale.

## Struttura pagine (rotte)
- `/[lang]` — home (hero + stats + legenda evidenza + ingresso "Confronta
  prezzi" + ultime analisi + molecole + report card + metodo + newsletter)
- `/[lang]/database` — indice filtrabile delle **54 molecole** (ricerca, grado,
  classe, filtro **Dentro/Fuori** = sistemico/topico, ordinamento)
- `/[lang]/molecule/[slug]` — scheda molecola (vedi modello sotto)
- `/[lang]/prezzi` — hub comparatore prezzi (molecole con offerte, "da €X",
  prezzo/dose, filtri grado + prezzo max)
- `/[lang]/confronto` — pagina trasparenza "Come funziona il confronto"
- `/[lang]/report-card` — lead magnet: "La Pagella delle Molecole" (A–F,
  stampabile/PDF)
- `/[lang]/analisi` + `/[lang]/analisi/[slug]` — analisi lunghe (1 articolo: NMN)
- `/[lang]/method` — metodo di grading + dichiarazione d'indipendenza
- `/[lang]/connect` (+ /brands, /reps) — sezione B2B (advisory, no vendita)
- Pagine legali: chi-siamo, contatti, disclaimer, privacy, termini
- `/go/[id]` — redirect sicuro verso i venditori (allowlist, noindex, 302)
- SEO: `/sitemap.xml`, `/robots.txt`, `/rss.xml`, OG images per pagina

## Modello dati "molecola" (54 schede)
Ogni scheda ha: nome, alias, **classe**, uso principale, **grado A–F**, forza
evidenza (barra visiva), tipo regolatorio (integratore / farmaco da
prescrizione / topico), **bottom line** (sintesi in una frase), riassunto
dell'evidenza, **studi chiave** (titolo cliccabile → PubMed + "vedi tutti gli
studi"), meccanismo, sicurezza, contesto di dosaggio, **esempi di applicazione**
(pratici, non prescrittivi), nota dal campo (prima persona), molecole correlate,
data ultima revisione, stato editoriale, facet **domain** (sistemico/topico).
- Es. gradi: Rapamicina A, NMN/Creatina/Spermidina B, molti C, PDRN F.
- 12 attivi topici skincare (SPF grado A, retinoidi/niacinamide/vit C/ceramidi
  B, ecc.), con distinzione obbligatoria **ingrediente ≠ formulazione ≠
  prodotto finito** e nessun claim medico.

## Principi YMYL (rigore anti-rischio)
- Nessuno scraping. Fonti oneste: dove non ci sono PMID singoli verificati, i
  link portano a **ricerche PubMed mirate** (trasparenti), mai PMID inventati.
- Gradi conservativi, limiti sempre dichiarati, segnali di sicurezza in
  evidenza. Niente diagnosi/prescrizioni. Farmaci → "solo con supervisione
  medica".

## Comparatore prezzi ("Dove acquistare")
- Su ogni scheda + hub `/prezzi`. Confronta prezzo/disponibilità/€ per dose.
- **Ranking per prezzo, MAI per commissione.** Disclosure onesta.
- Dati oggi in **modalità DEMO** (offerte fittizie `example.com`); si caricano
  offerte reali via CSV (`content/comparator/offers.csv` + `merchants.csv`),
  mappati da **feed affiliati** (Awin/Tradedoubler/Amazon), non scraping.
- Redirect sicuro `/go/[id]`: allowlist domini, 302, noindex, click minimizzato
  (niente PII). Affiliazione dichiarata solo dove esiste contratto.

## Monetizzazione (in ordine)
1. Audience via SEO + newsletter (asset = lista email).
2. Comparatore con link affiliati (quando ci sono programmi reali).
3. B2B "Connect" (advisory brand↔distributori) e, più avanti, prodotto
   proprietario basato sui dati raccolti.

## SEO
Sitemap con 53 molecole indicizzabili + pagine chiave; schema.org
(MedicalWebPage, Substance, Breadcrumb, FAQ, ItemList); canonical + hreflang
(x-default = /en); noindex sulle pagine sottili e su `/go`.

## Stato: fatto vs da fare
- **Fatto (live):** tutto il sito, 54 molecole, database+filtri, comparatore
  (demo), report card, pagina trasparenza, SEO tecnico, export WordPress
  (portabilità).
- **Da fare (dipende dall'utente):** verificare dominio **Resend** + 4 env var
  su Vercel (newsletter); **Google Search Console** + invio sitemap (traffico);
  iscrizione a reti affiliate + caricamento **feed reali** nel comparatore;
  eventuale partita IVA prima di incassare; pass di verifica **PMID** reali
  quando PubMed è stabile.

## Dove un revisore esterno può aiutare
Priorità contenuti/traffico (nicchia longevity + skin-longevity in Italia),
struttura di internal linking, idee di lead magnet, strategia editoriale
(calendario analisi lunghe), keyword ad alta intenzione, e conversione della
newsletter — **senza** rompere il vincolo estetico clinico e i principi YMYL.
