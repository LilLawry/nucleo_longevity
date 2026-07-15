#!/usr/bin/env node
/**
 * One-shot: inject a practical, non-prescriptive `applications` list into each
 * molecule's frontmatter. Idempotent — skips files that already have it.
 */
import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content/molecules");

const APPS = {
  nmn: ["Taken as a morning capsule, often within a NAD⁺-support routine.", "Used in defined cycles with periodic reassessment, not indefinitely.", "Treated as an add-on to sleep, exercise and diet — which matter more."],
  "nicotinamide-riboside": ["Taken as a daily morning capsule, much like NMN.", "Often chosen over NMN on price, since the evidence is similar.", "Sometimes paired with TMG on theory, though that pairing isn't proven."],
  rapamicina: ["Used only under medical supervision — it is a prescription drug, not a supplement.", "In research, explored as intermittent low-dose rather than daily.", "Never self-experimented; off-label longevity use needs a physician."],
  metformina: ["A prescription drug dosed and monitored by a doctor.", "In the aging context, studied in the TAME trial rather than self-use.", "Not a casual 'longevity pill' — clinical indication comes first."],
  resveratrolo: ["Taken with a fatty meal to blunt the poor absorption a little.", "Often combined with pterostilbene, sold on better bioavailability.", "Cheap to try, but with weak human evidence."],
  spermidina: ["Taken as a standardised wheat-germ extract (~1–6 mg/day).", "Also raised simply by eating wheat germ, legumes and aged cheese.", "Treated as a long-game dietary habit, not a quick fix."],
  quercetina: ["Eaten in the diet (onions, capers, apples) as a flavonoid.", "As a supplement, sometimes taken with vitamin C for absorption.", "The senolytic D+Q protocol belongs in trials, not at home."],
  creatine: ["Added as ~3–5 g/day of plain monohydrate in water or a shake.", "Paired with resistance training, where its evidence is strongest.", "Kept simple: monohydrate rather than pricier 'advanced' forms."],
  "omega-3": ["Covered first by eating oily fish a couple of times a week.", "As a supplement, taken with a meal to aid absorption.", "High-dose prescription EPA is a specific medical case, not general use."],
  taurine: ["Supplemented at ~1–3 g/day in studies; also common in the diet.", "Treated as safe-to-try but unproven for aging in humans.", "Not a substitute for the basics of sleep and exercise."],
  fisetin: ["Eaten in small amounts in strawberries and apples.", "As a senolytic, used in intermittent high-dose research protocols only.", "Best treated as 'watch the trials' than a daily staple."],
  "urolithin-a": ["Taken as a defined dose (~500–1000 mg/day), since gut conversion varies.", "Aimed at muscle and mitochondrial support, often alongside training.", "Pomegranate and walnuts don't reliably produce the same amount."],
  berberine: ["Taken ~900–1500 mg/day split across meals due to poor absorption.", "Checked with a pharmacist first — it interacts with many drugs.", "Used for metabolic support, not as a 'natural Ozempic'."],
  collagen: ["Taken as ~2.5–10 g/day of hydrolysed peptides in a drink.", "Used consistently for skin/joint support; benefits fade if stopped.", "Treated as a cosmetic aid, not systemic rejuvenation."],
  curcumin: ["Chosen in an enhanced-absorption form (piperine or phospholipid).", "Taken with food, mainly for joint comfort and inflammation.", "Formulation matters more than the number on the label."],
  "vitamin-d": ["Dosed to a measured blood level rather than by guesswork.", "Typically ~800–2000 IU/day for maintenance, taken with a meal.", "Not mega-dosed on faith — excess is genuinely harmful."],
  "coenzyme-q10": ["Taken with a fatty meal (~100–300 mg/day) for absorption.", "Most reasonable in heart failure or statin-related muscle aches, with a doctor.", "Ubiquinol is marketed as better-absorbed, with variable support."],
  glycine: ["Taken ~3 g before bed for sleep quality.", "Also the glycine half of the experimental GlyNAC combination.", "Cheap and gentle, not a transformative aging intervention."],
  nac: ["Taken ~600–1800 mg/day as a glutathione precursor.", "Has real medical uses (paracetamol antidote, mucus) beyond wellness.", "The anti-aging framing is more speculative than its drug uses."],
  glynac: ["Used as the glycine + NAC pair studied in older adults.", "Dosing follows trial protocols; over-the-counter products vary.", "Promising but not independently replicated — treat as experimental."],
  magnesium: ["Taken as glycinate/citrate (~200–400 mg elemental), often in the evening.", "Aimed at correcting a real shortfall, not mega-dosing.", "Oxide is cheap but poorly absorbed and more laxative."],
  "vitamin-k2": ["Taken as MK-7 (~90–200 µg/day), often alongside vitamin D.", "Must not be changed by anyone on warfarin without medical advice.", "Judged on markers; hard-outcome evidence is still limited."],
  melatonin: ["Used at a low dose (~0.5–1 mg) at the right time for jet lag or sleep timing.", "Timing matters more than amount; most bottles are overdosed.", "A circadian signal, not a sedative or proven anti-aging antioxidant."],
  ashwagandha: ["Taken as a standardised root extract (~300–600 mg/day) for short periods.", "Aimed at stress and sleep, not longevity.", "Watched for the rare liver-safety signal; avoided in pregnancy."],
  egcg: ["Best had simply as green tea, which avoids the extract risk.", "If using an extract, taken with food and kept below high daily limits.", "Concentrated EGCG carries a rare liver-injury risk the tea doesn't."],
  sulforaphane: ["Obtained from broccoli sprouts or a myrosinase-active extract.", "Product potency varies a lot — the actual yield matters.", "An Nrf2 activator idea; human trials are small and specific."],
  "alpha-lipoic-acid": ["Taken ~300–600 mg/day, mainly relevant to diabetic nerve symptoms.", "Can add to the glucose-lowering effect of diabetes medication.", "Aging claims are extrapolated from mechanism, not outcomes."],
  "hyaluronic-acid": ["Applied topically in a serum on damp skin, then sealed with moisturiser.", "Also taken orally (~120–240 mg/day) for skin hydration in trials.", "Injectable use (fillers) is a medical procedure, professionals only."],
  "calcium-akg": ["Taken as ~1 g/day of the Ca-AKG form used in the cited study.", "Evidence rests on one small biological-age trial — treat as early.", "Also adds calcium toward daily intake."],
  pterostilbene: ["Taken ~50–125 mg/day, often bundled with NMN/NR.", "Watched for a possible LDL rise at higher doses.", "Better absorbed than resveratrol, but with far less human data."],
  apigenin: ["Present in parsley, chamomile and celery.", "As a supplement, the CD38/NAD⁺ rationale is largely preclinical.", "One to watch rather than bank on; absorption is low."],
  "l-theanine": ["Taken ~100–200 mg, often with caffeine for calm focus.", "Also used before bed for relaxation without sedation.", "A gentle, low-risk 'nice to have', not a longevity active."],
  "l-citrulline": ["Taken ~6–8 g pre-workout, or ~3–6 g/day for blood-pressure support.", "Check pre-workout labels — many under-dose it.", "Caution alongside blood-pressure or ED medication (additive effect)."],
  astaxanthin: ["Taken ~4–12 mg/day, usually a natural (algae) source, with food.", "Aimed at skin and eye support; evidence is small and early.", "A supporting antioxidant, oversold as a systemic anti-aging pill."],
  "lions-mane": ["Taken ~1–3 g/day of a fruiting-body extract.", "Check the product is real mushroom, not 'mycelium on grain'.", "Cognitive claims are early; treat as experimental."],
  "tmg-betaine": ["Taken ~500–1000 mg to 'offset' NAD-precursor methylation (a theory).", "Or ~1.5–6 g/day where homocysteine lowering is the goal.", "Watched for a possible LDL rise at higher doses."],
  ergothioneine: ["Obtained mainly from mushrooms in the diet.", "Supplement doses aren't standardised, since evidence is associational.", "A 'watch this space' longevity candidate, not a proven one."],
  pqq: ["Taken ~10–20 mg/day, often bundled with CoQ10.", "The 'new mitochondria' pitch is mostly preclinical.", "Treat the CoQ10 combo as marketing until outcomes say otherwise."],
  zinc: ["Taken ~8–15 mg/day to correct a shortfall, or short-term lozenges for colds.", "Not mega-dosed long-term — high zinc causes copper deficiency.", "Balanced with copper if supplementing above the upper limit."],
  "vitamin-c": ["Easily met from diet; supplements above absorption are largely excreted.", "Gram-level 'immune' doses mostly don't prevent colds.", "Topical vitamin C is a separate, skin-specific use."],
  "lithium-low-dose": ["Not self-dosed: any lithium use belongs under medical supervision with blood tests.", "Population signals are interesting but not a basis for supplements.", "Included here to caution, not to recommend."],
  polynucleotides: ["Delivered as in-clinic injectable treatments by professionals.", "Marketed for skin biostimulation; independent evidence is thin.", "A medical/aesthetic procedure, not an at-home product."],
  // topical / skincare
  "sunscreen-spf": ["Applied every morning as the last step, reapplied through the day.", "Chosen broad-spectrum SPF 30+ in a texture you'll actually re-use.", "The foundation of any anti-aging routine — before any serum."],
  retinoids: ["Applied at night, starting 2–3×/week and building tolerance.", "Always followed by daily sunscreen the next morning.", "Introduced slowly to limit dryness; avoided in pregnancy without advice."],
  niacinamide: ["Used in a morning or evening serum, under moisturiser.", "Around 2–5% — comfortable and easy to combine with other actives.", "Pairs well with sunscreen for tone and barrier support."],
  "vitamin-c-topical": ["Applied in the morning, under sunscreen, for antioxidant support.", "Stored away from light/air; discarded if it turns brown (oxidised).", "L-ascorbic acid ~10–20%, or a gentler derivative for sensitive skin."],
  ceramides: ["Used in a moisturiser, ideally with cholesterol and fatty acids.", "Layered over hydrating serums to seal in water.", "A go-to for dry, tight or barrier-stressed skin."],
  panthenol: ["Found in soothing moisturisers and after-sun/barrier products.", "Layered anytime for comfort; very hard to react to.", "A supporting humectant, not a standalone anti-aging active."],
  aha: ["Used a few evenings a week, per the product's instructions.", "Followed by daily sunscreen, since AHAs raise sun sensitivity.", "Lactic acid for sensitive skin; start low and infrequent."],
  "pha-lactobionic": ["Chosen as a gentler exfoliant for sensitive or reactive skin.", "Used more often than strong AHAs thanks to milder action.", "Still paired with daily sunscreen."],
  "peptides-topical": ["Applied in a serum morning and/or night, easy to layer.", "Judged by the specific peptide, not a generic 'peptides' claim.", "A gentle add-on, not a replacement for retinoids or SPF."],
  bakuchiol: ["Applied ~0.5–1% by people who can't tolerate retinoids.", "Used morning or night; gentler and less irritating than retinol.", "Reasonable for sensitive skin, but not a proven retinoid equal."],
  centella: ["Used in 'cica' soothing creams and serums for comfort.", "Layered to calm temporarily sensitised or dry skin.", "Judged on the standardised actives, not the buzzword."],
  "vitamin-e-topical": ["Applied alongside vitamin C, where the pair works better.", "Acts as an antioxidant and emollient in moisturisers.", "A supporting player, not a lead active."],
};

let done = 0, skipped = 0, missing = [];
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"))) {
  const slug = file.replace(/\.mdx$/, "");
  const apps = APPS[slug];
  const p = path.join(DIR, file);
  const text = fs.readFileSync(p, "utf8");
  const lines = text.split("\n");
  let end = -1;
  for (let i = 1; i < lines.length; i++) { if (lines[i].trim() === "---") { end = i; break; } }
  const fm = lines.slice(0, end).join("\n");
  if (fm.includes("applications:")) { skipped++; continue; }
  if (!apps) { missing.push(slug); continue; }
  const block = ["applications:", ...apps.map((s) => `  - ${JSON.stringify(s)}`)];
  lines.splice(end, 0, ...block);
  fs.writeFileSync(p, lines.join("\n"), "utf8");
  done++;
}
console.log(`applications injected: ${done} | skipped(existing): ${skipped}`);
if (missing.length) console.log("NO MAPPING for:", missing.join(", "));
