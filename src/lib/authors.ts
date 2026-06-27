/**
 * Author registry for E-E-A-T. Authorship stays editorial/anonymous on purpose
 * (independence), but is still attributable and transparent: a real team with
 * stated competences + a link to the About page. That combination is what lets
 * a YMYL health site build trust and rank without exposing a personal identity.
 */
export interface Author {
  key: string;
  name: string;
  role: { it: string; en: string };
  bio: { it: string; en: string };
  /** Optional avatar in /public, e.g. "/authors/team.jpg" */
  avatar?: string;
  /** External profiles for sameAs (added once public) */
  links?: string[];
}

export const AUTHORS: Record<string, Author> = {
  redazione: {
    key: "redazione",
    name: "Redazione Nucleo",
    role: {
      it: "Analisi indipendente · settore longevity",
      en: "Independent analysis · longevity sector",
    },
    bio: {
      it: "Team editoriale indipendente con competenze in biochimica, medicina e comunicazione scientifica, affiancato da un professionista con esperienza di vendita internazionale nel settore degli integratori e della longevità. Manteniamo l'anonimato per preservare l'indipendenza editoriale: ogni analisi è revisionata da almeno due membri prima della pubblicazione e cita le fonti PubMed in chiaro.",
      en: "An independent editorial team with backgrounds in biochemistry, medicine and science communication, alongside a professional with international sales experience in the supplements and longevity sector. We stay anonymous to preserve editorial independence: every analysis is reviewed by at least two members before publication and cites its PubMed sources openly.",
    },
  },
};

export function getAuthor(key?: string): Author {
  return (key && AUTHORS[key]) || AUTHORS.redazione;
}
