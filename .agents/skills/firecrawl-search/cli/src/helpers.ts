// Data source: the Firecrawl hosted API (api.firecrawl.dev), a general-purpose
// web search + scrape service. Unlike freehire/linkedin-search this is NOT a
// job-board-specific API — it searches the open web and renders arbitrary pages
// (including JS-heavy ones) into clean markdown. Requires a Firecrawl API key.
// Base URL is swappable via FIRECRAWL_API_URL for a self-hosted instance.

export const DEFAULT_BASE_URL = "https://api.firecrawl.dev"

/** API base URL: FIRECRAWL_API_URL (self-hosted) or the hosted default. */
export function baseUrl(): string {
  const raw = (process.env.FIRECRAWL_API_URL ?? "").trim()
  return (raw || DEFAULT_BASE_URL).replace(/\/+$/, "")
}

/** The API key, read once. Callers must check this is non-empty before use. */
export function apiKey(): string {
  return (process.env.FIRECRAWL_API_KEY ?? "").trim()
}

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA = "firecrawl-search-skill/1.0"

/** The shared API response envelope: {success, data, error}. */
export interface Envelope<T> {
  success: boolean
  data?: T
  error?: string
  creditsUsed?: number
}

/**
 * POST a JSON body to a Firecrawl endpoint and return the parsed envelope.
 * Retries 429/5xx (transient server states) with backoff; a connection failure
 * fails fast with a clear message rather than hanging the caller.
 */
export async function apiPost<T>(path: string, body: unknown): Promise<Envelope<T>> {
  const key = apiKey()
  if (!key) {
    throw new Error(
      "FIRECRAWL_API_KEY is not set. Get a key at https://www.firecrawl.dev/app/api-keys (free tier available) and export it before running this CLI.",
    )
  }
  const url = `${baseUrl()}${path}`
  const maxRetries = 5
  let delay = 500

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let response: Response
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "User-Agent": UA,
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(90000), // scrape/search can legitimately take tens of seconds on JS-heavy pages
      })
    } catch (e) {
      throw new Error(`could not reach the Firecrawl API at ${baseUrl()} (${e instanceof Error ? e.message : String(e)})`)
    }

    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Firecrawl API request failed: ${response.status} ${response.statusText}`)
      }
      await sleep(delay + Math.floor(Math.random() * 500))
      delay = Math.min(delay * 2, 8000)
      continue
    }

    const parsed = (await response.json().catch(() => null)) as Envelope<T> | null
    if (response.status === 401 || response.status === 403) {
      throw new Error(parsed?.error || "Firecrawl API rejected the request — check FIRECRAWL_API_KEY")
    }
    if (!response.ok) {
      throw new Error(parsed?.error || `Firecrawl API request failed: ${response.status} ${response.statusText}`)
    }
    if (!parsed) throw new Error("Firecrawl API returned an unparseable response body")
    return parsed
  }
  throw new Error("Firecrawl API request failed after retries")
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** One /v2/search web result, the fields this skill reads. */
export interface FirecrawlWebResult {
  title?: string
  description?: string
  url: string
  markdown?: string
}

/** A search result in the portal-skill contract shape (same shape as other portals). */
export interface JobResult {
  id: string // the result URL, doubling as the detail-lookup key (no separate slug system)
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
  description: string | null
}

/**
 * Reshape a Firecrawl web-search hit into the contract search-result shape.
 * Firecrawl doesn't know "company" or "location" as structured fields — this is
 * a general web search, not a job-board API — so those stay null here; the
 * `detail`/scrape step (or the description snippet) is where that gets filled in.
 */
export function toResult(r: FirecrawlWebResult): JobResult {
  return {
    id: r.url,
    title: r.title || "(untitled)",
    company: null,
    location: null,
    date: null,
    url: r.url,
    description: r.markdown || r.description || null,
  }
}

/** A scraped page: the detail result this skill's `detail` command returns. */
export interface ScrapeResult {
  url: string
  title: string | null
  description: string | null
  markdown: string | null
  statusCode: number | null
}

export interface FirecrawlScrapeData {
  markdown?: string
  metadata?: {
    title?: string
    description?: string
    sourceURL?: string
    statusCode?: number
  }
}

export function toScrapeResult(url: string, data: FirecrawlScrapeData): ScrapeResult {
  return {
    url: data.metadata?.sourceURL || url,
    title: data.metadata?.title || null,
    description: data.metadata?.description || null,
    markdown: data.markdown || null,
    statusCode: data.metadata?.statusCode ?? null,
  }
}
