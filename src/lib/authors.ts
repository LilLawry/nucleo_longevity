/**
 * Author registry for E-E-A-T. Each analysis references an author by key
 * (frontmatter `autore`). Real, attributable authorship is what lets a YMYL
 * health site rank — fill these in with genuine details.
 */
export interface Author {
  key: string;
  name: string;
  role: { it: string; en: string };
  bio: { it: string; en: string };
  /** Optional avatar in /public, e.g. "/authors/lorenzo.jpg" */
  avatar?: string;
  /** External profiles for sameAs (LinkedIn, X, personal site) */
  links?: string[];
}

export const AUTHORS: Record<string, Author> = {
  redazione: {
    key: "redazione",
    name: "Redazione Nucleo",
    role: { it: "Team editoriale", en: "Editorial team" },
    bio: {
      it: "Team con formazione in biochimica, medicina e comunicazione scientifica. Ogni analisi è revisionata da almeno due membri prima della pubblicazione.",
      en: "A team with backgrounds in biochemistry, medicine and science communication. Every analysis is reviewed by at least two members before publication.",
    },
  },
  // TODO: sostituisci con i tuoi dati reali (foto in /public/authors/…)
  lorenzo: {
    key: "lorenzo",
    name: "Lorenzo Gennai",
    role: { it: "Fondatore · Ricerca longevity", en: "Founder · Longevity research" },
    bio: {
      it: "Studio e seleziono la letteratura sulla longevità per renderla leggibile e onesta. Condivido qui ciò che testo e analizzo in prima persona, con le fonti sempre in chiaro.",
      en: "I study and curate the longevity literature to make it readable and honest. I share here what I test and analyse first-hand, with sources always in the open.",
    },
    links: ["https://www.linkedin.com/"],
  },
};

export function getAuthor(key?: string): Author {
  return (key && AUTHORS[key]) || AUTHORS.redazione;
}
