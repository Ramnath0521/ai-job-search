# Template: lato-raleway-modern

- **Type:** CV
- **Source extension:** .tex
- **Engine/toolchain:** xelatex (custom class uses `fontspec` + bundled font files; requires xelatex or lualatex, not pdflatex)
- **Page limit:** 2 page(s)
- **Fonts:** Lato (headline/name/labels) + Raleway (body/dates/bullets) — bundled in `fonts/lato/` and `fonts/raleway/`, same font pair as the `cover.cls` cover-letter template, so a CV and cover letter from this framework read as a matched visual set
- **Class/packages:** custom `resume.cls` (loads `fontspec`, `fontawesome5`, `titlesec`, `enumitem`, `xcolor`); not a standard TeX Live/MiKTeX class

## Compile command

    cd cv && xelatex -interaction=nonstopmode main_<company>_<role>.tex

## Style rules

- Single accent color (deep indigo `#1F3A5F`) used for the name, section headings, section rules, entry titles, and company/institution lines — keep it to this one accent, do not introduce a second color.
- Name renders in two weights (first name light `Lato-Hai`, last name lighter `Lato-Lig`) at 32pt, centered, with a role tagline directly beneath in Raleway-Medium — **write a fresh one-line tagline per application** (e.g. "AI Engineer specializing in GenAI-Assisted SDLC Automation" vs ".NET Full-Stack Engineer with GenAI-Assisted Delivery Experience") matching the target role; this is the single highest-leverage differentiation point between CVs and must never be left as a generic copy across applications.
- Contact row uses FontAwesome icons (`\faEnvelope`, `\faMobile`, `\faLinkedin`) separated by `\quad\textbar\quad`, centered, under the name block, above a full-width thin rule (`\color{rule}\hrule`).
- Every `\section{}` automatically gets a colored rule beneath it via `titlesec`'s after-code hook — do not add manual `\hrule`/`\rule` under section headings, the class already does it.
- Professional Experience / Education entries use `\entryheader{Title}{Date range}` (title left, date right-aligned in the same line via two minipages) followed by `\entrysub{Company \textbullet\ Location}`, then a `tightemize` bullet list, then `\entryspace` before the next entry.
- Core Competencies use `\skillcat{Category}{comma-separated items}` — one per line, 5-7 categories, in the posting's own terminology where truthfully applicable (same rule as the stock template).
- No italics anywhere: the bundled Raleway/Lato weights do not include italic faces, and forcing `\itshape` degrades silently to upright with a font-shape warning. Use color or weight (bold `Lato-Bol` via `\skillcat`'s label) to create emphasis instead.
- No small caps: section headings are NOT `\scshape` (the bundled static font instances have no smallcaps feature) — they are plain `Lato-Bol` at 12.5pt. Do not reintroduce `\scshape`.
- Escape `&` as `\&` and `%` as `\%` as usual for LaTeX; a literal unescaped `&` breaks the compile with "Misplaced alignment tab character."

## Known pitfalls

- FontAwesome icon glyphs (`\faEnvelope` etc.) extract as garbled/PUA characters under `pdftotext` — this is expected and matches the stock moderncv template's own icon behavior (already documented as harmless ATS noise in `05-cv-templates.md`), not a defect introduced by this template. The literal email and phone number print as plain text beside the icons either way, so ATS still reads the actual contact details.
- If a bold or italic variant of a Raleway/Lato weight is invoked that has no bundled font file, XeLaTeX silently substitutes the regular weight and prints a `Font shape ... undefined` warning rather than failing. This is silent content degradation, not a compile error — watch the compile log for these warnings and remove the unsupported markup (see "No italics" / "No small caps" above) rather than ignoring the warning.
- Page 2 can end up very sparse if a role's content (Core Competencies + bullets) is trimmed too aggressively — this template's typography is airier than moderncv banking, so it uses more vertical space per line. Budget slightly more content per section than the stock template's page-budget table suggests, or use `\enlargethispage{2-3\baselineskip}` on a late section for a near-miss, consistent with the stock guidance's cutting/rescue rules.
