# Firecrawl API reference

The endpoints, parameters, and response shapes this skill depends on. Base URL
defaults to `https://api.firecrawl.dev` and is overridable via the
`FIRECRAWL_API_URL` env var (for a self-hosted Firecrawl instance).

## Authentication

**Required.** Every request needs `Authorization: Bearer <FIRECRAWL_API_KEY>`.
Unlike `linkedin-search` and `freehire-search`, Firecrawl is not a free
unauthenticated read — get a key at https://www.firecrawl.dev/app/api-keys
(a free tier exists) and export `FIRECRAWL_API_KEY` before running this CLI.
A missing key is caught client-side with a clear message; a rejected key
(401/403) surfaces the API's own error text.

**Live-verified 2026-08-25** with a real API key:

| Endpoint | Purpose | Verified |
|----------|---------|----------|
| `POST /v2/search` | Open web search, optionally with each hit's page rendered to markdown | ✅ `--domain naukri.com` returned real, relevant results |
| `POST /v2/scrape` | Render one URL (JS included) and return markdown + metadata | ✅ Recovered a full posting from an Ashby SPA that a plain fetch only returned the title for; correctly confirmed two genuinely-closed Workday postings as closed rather than returning an ambiguous empty result |

## `POST /v2/search`

Request body:

```jsonc
{
  "query": "AI Engineer Hyderabad",     // required, max 500 chars
  "limit": 10,
  "sources": [{ "type": "web" }],
  "includeDomains": ["naukri.com"],      // optional, from --domain (repeatable)
  "excludeDomains": ["linkedin.com"],    // optional, from --exclude-domain
  "country": "IN",                       // optional, from --country
  "scrapeOptions": {                     // only sent when --scrape-content is set
    "formats": [{ "type": "markdown" }],
    "onlyMainContent": true
  }
}
```

Response: `{ success, data: { web: [{ title, description, url, markdown? }] }, creditsUsed, id }`.
The skill's `search` command reads `data.web` and maps each hit to the shared
portal-result shape (`toResult` in `cli/src/helpers.ts`). Firecrawl's web search
does not return a structured company/location/date — only a title, URL, and a
description snippet (or full markdown if `scrapeOptions` was requested) — so
`company`, `location`, and `date` are always `null` in this skill's results.
That is a real difference from `linkedin-search`/`freehire-search`, which parse
those out of a job-board-specific schema; Firecrawl is a general search engine,
not a job API.

`scrapeOptions` roughly doubles the credit cost per result (a scrape per hit,
not just a search) — the CLI leaves it off by default (`--scrape-content` to
opt in) so a routine search stays cheap.

## `POST /v2/scrape`

Request body:

```jsonc
{
  "url": "https://example.com/job/123",
  "formats": [{ "type": "markdown" }],
  "onlyMainContent": true,
  "waitFor": 0,        // from --wait-for; extra ms to wait for client-side rendering
  "timeout": 60000
}
```

Response: `{ success, data: { markdown, metadata: { title, description, sourceURL, statusCode } } }`.
The skill's `detail <url>` command maps this to `{ url, title, description,
markdown, statusCode }` (`toScrapeResult` in `cli/src/helpers.ts`).

This is the endpoint that matters for the JS-rendering gap: Firecrawl executes
the page's JavaScript before capturing content, so client-side-rendered ATS
pages (Workday `myworkdayjobs.com`, Ashby `jobs.ashbyhq.com`, some
Greenhouse-embedded pages) that come back empty from a plain HTTP fetch
generally render correctly here. It is not a fix for auth-gated pages
(LinkedIn's full-description login wall stays gated) or for a dead/removed
posting (a 404 is still a 404, just rendered).

## Rate limits and retries

Firecrawl enforces per-plan rate limits; a 429 or 5xx is retried with
exponential backoff + jitter (max 5 attempts, `cli/src/helpers.ts`). A 401/403
(bad or missing key) is not retried — it fails immediately with the API's own
error text. A connection failure (DNS/timeout) also fails fast rather than
retrying, consistent with the other portal skills' graceful-degradation
contract: an unreachable API should degrade this source quickly, not hang the
caller.

## Credits

Firecrawl is a paid API past its free tier (search and scrape both consume
credits; `scrapeOptions` on search multiplies cost by result count). Treat this
skill as a **fallback and supplementary source**, not the primary portal — the
free `linkedin-search`/`freehire-search` CLIs should still do the bulk of
`/scrape`'s work.
