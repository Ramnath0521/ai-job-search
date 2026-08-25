---
name: firecrawl-search
version: 1.0.0
description: >
  Use this skill to search the open web for job postings on boards without a
  dedicated portal CLI (e.g. Naukri, FoundIt), or to fetch/render a specific job
  posting URL that returned empty from another fetch method — particularly
  client-side-rendered (JavaScript SPA) ATS pages like Workday, Ashby, or
  Greenhouse-embedded listings. Trigger phrases: search Naukri, search FoundIt,
  this posting won't load, the page came back empty, render this job page,
  scrape this URL, JS-rendered job page.
context: fork
enabled: true  # requires FIRECRAWL_API_KEY (paid API past the free tier) — export it before use
allowed-tools: Bash(bun run .agents/skills/firecrawl-search/cli/src/cli.ts *)
---

# Firecrawl Search Skill

Wraps the [Firecrawl](https://www.firecrawl.dev) hosted API — a general-purpose
web search + JS-rendering scrape service — for two purposes this repo's other
portal skills don't cover:

1. **Search boards with no dedicated CLI.** `search-queries.md` names Naukri and
   FoundIt as primary sources, but neither has a portal-specific CLI in this
   repo (unlike LinkedIn and the freehire aggregator) — today they only get
   reached via a `WebSearch` fallback with no structured extraction. This skill
   gives `/scrape` a real `search --domain naukri.com` / `--domain foundit.in`
   path instead.
2. **Render pages that come back empty.** Some ATS platforms serve their job
   description via client-side JavaScript (Workday `*.myworkdayjobs.com`, Ashby
   `jobs.ashbyhq.com`, some Greenhouse-embedded pages). A plain `WebFetch` or an
   HTML-scraping portal CLI sees only the pre-render shell and returns nothing —
   during `/rank` and `/apply` evaluation, that gets marked `expired` even
   though the posting is live. `firecrawl-search detail <url>` executes the
   page's JS before capturing content and generally recovers these.

## ⚠️ Requires a Firecrawl API key (paid past the free tier)

Unlike `linkedin-search` and `freehire-search`, this is **not** a free
unauthenticated read. Get a key at
[firecrawl.dev/app/api-keys](https://www.firecrawl.dev/app/api-keys) (a free
tier exists, enough for light use) and:

```bash
export FIRECRAWL_API_KEY="fc-..."
```

Treat it as a **supplementary source**: the free portal CLIs should still
carry most of the load; reach for this when they come up empty or to widen
coverage to a board they don't touch.

**Live-verified 2026-08-25** against the real API:
- `detail <url>` correctly rendered two Workday postings that had returned
  empty during a prior `/rank` run — both turned out to be genuinely closed
  ("This job is no longer available" / "The page you are looking for doesn't
  exist"), which is itself useful: a confirmed answer instead of an ambiguous
  empty fetch that gets misread as "maybe still open, tooling just failed."
- `detail <url>` on an Ashby-hosted posting (`jobs.ashbyhq.com`) that a plain
  `WebFetch` had only returned the page title for recovered the **full**
  posting text (112 lines) at the default `--wait-for 0` — no extra render
  wait needed in that case, though a slower-loading SPA might still benefit
  from `--wait-for 2000`-`5000`.
- `search --domain naukri.com`/`--domain foundit.in` returned **category
  listing pages**, not individual job postings — see `url-reference.md` for
  the full caveat. Use `linkedin-search`/`freehire-search` for real individual
  postings; reach for `firecrawl-search search` for an **unscoped** open-web
  query, not as a Naukri/FoundIt-specific tool, until a `crawl`/`map` follow-up
  step is built to turn a category page into individual job leads.

## When to use this skill

- Search a job board that has no dedicated CLI (Naukri, FoundIt, or any other
  domain) via `search --domain <host>`.
- Recover a posting's content when another fetch attempt returned nothing — try
  `detail <url>` before concluding a listing is dead.
- General open-web job search when you want results from across many boards at
  once rather than one portal at a time.

## Commands

### Search the web (optionally scoped to a domain)

```bash
bun run .agents/skills/firecrawl-search/cli/src/cli.ts search -q "<query>" [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — **required.** Combine keywords and location
  yourself (Firecrawl search has no separate location parameter), e.g.
  `-q "AI Engineer Hyderabad"`.
- `--domain <host>` — scope to a site (repeatable), e.g. `--domain naukri.com`.
  Omit for an unscoped open-web search.
- `--exclude-domain <host>` — exclude a site (repeatable).
- `--country <code>` — 2-letter country bias, e.g. `--country IN`.
- `--limit <n>` / `-n <n>` — max results. Default 10.
- `--scrape-content` — also render+return each hit's full page as markdown.
  More accurate (lets you judge fit from the snippet alone), but costs
  meaningfully more Firecrawl credits per result — reserve it for a small,
  already-narrowed result set rather than a first broad pass.
- `--format json|table|plain` — default `json`.

**Firecrawl's search does not return structured job fields** — no company,
location, or posting date, just a title, URL, and description snippet (or full
markdown with `--scrape-content`). This is a real difference from
`linkedin-search`/`freehire-search`: treat search hits here as leads to
individually confirm with `detail`, not ready-to-rank job records.

### Fetch/render one URL

```bash
bun run .agents/skills/firecrawl-search/cli/src/cli.ts detail <url> [--format json|plain] [--wait-for <ms>]
```

`<url>` is any URL — there is no portal-specific slug system here, unlike
`freehire-search detail <slug>`. Use this as the retry step when a posting URL
returned empty content elsewhere:
- `--wait-for <ms>` — extra render wait before capture, for pages that load
  content on a delay after the initial JS render settles (default 0; Firecrawl
  already waits for the page to reach a stable state on its own).
- `--format json|plain` — default `json`.

## Usage examples

```bash
# Naukri search, human-readable
bun run .agents/skills/firecrawl-search/cli/src/cli.ts search -q "AI Engineer Hyderabad" --domain naukri.com --limit 10 --format table

# FoundIt search
bun run .agents/skills/firecrawl-search/cli/src/cli.ts search -q "Software Engineer .NET Bengaluru" --domain foundit.in --format table

# Recover a Workday posting that WebFetch returned empty
bun run .agents/skills/firecrawl-search/cli/src/cli.ts detail "https://company.wd1.myworkdayjobs.com/Careers/job/City/Title_R12345" --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, feeding a `/rank` scoring pass |
| `table` | Quick human-readable scanning of `search` results |
| `plain` | Reading one `detail` result's full rendered content |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and
the process exits with code `1`.

## Notes

- Data is from Firecrawl's hosted API — an API key is required (see above). The
  base URL is swappable via `FIRECRAWL_API_URL` for a self-hosted Firecrawl
  instance.
- Fetch retries 429/5xx with exponential backoff + jitter (max 5 attempts). A
  401/403 (bad/missing key) fails immediately with the API's own error text,
  never retried. A connection failure (API unreachable) also fails fast —
  consistent with this repo's other portal skills' graceful-degradation
  contract: an outage degrades this source quickly instead of hanging `/scrape`.
- Not a fix for everything: an auth-gated page (LinkedIn's full-description
  login wall) stays gated, and a genuinely removed posting is still a 404 —
  Firecrawl only recovers content that exists but was rendered client-side.
- See `url-reference.md` in this directory for exact request/response shapes.
