# Migrating Nucleo to WordPress

The whole content library can be moved to WordPress whenever you want — you
never have to retype anything.

## 1. Generate a fresh export

```bash
npm run export:wp
```

This reads every molecule (`content/molecules/*.mdx`) and analysis
(`content/analisi/*.mdx`) and writes **`export/nucleo-wordpress-export.xml`**
— a standard WordPress import file (WXR).

## 2. Import into WordPress

1. In WordPress admin go to **Tools → Import**.
2. Under **WordPress**, click *Install Now*, then *Run Importer*.
3. Upload `nucleo-wordpress-export.xml`.
4. Assign the author (or create one) and click *Submit*.

You'll get:

- one post per molecule, in the **Molecules** category;
- one post per analysis and per language, in the **Analysis** category;
- the grade, class, evidence strength, regulatory type, PMIDs, etc. saved as
  **custom fields** (post meta, prefixed `nucleo_`) so a developer can later
  map them to a custom post type or ACF fields.

## Good to know

- **The Next.js site stays the source of truth.** This is a one-way migration
  aid, not a live sync — re-run `npm run export:wp` whenever you want a fresh
  file.
- Article bodies (Markdown/MDX) are converted to clean HTML; the first-person
  "field note" callouts become styled blockquotes with the `nucleo-field-note`
  / `nucleo-bottom-line` CSS classes, so you can style them in your theme.
- Both Italian and English versions of each analysis are exported as separate
  posts (slugs end in `-it` / `-en`); pair them with a multilingual plugin
  (Polylang or WPML) if you want language switching in WordPress.
- Images are not embedded in the XML. The 2D structure images live in
  `public/molecules/` — upload them to the WordPress media library if you move.
