import { apiPost, toScrapeResult, writeError, type FirecrawlScrapeData, type ScrapeResult } from "../helpers.js"

const SCRAPE_PATH = "/v2/scrape"

export interface DetailOpts {
  url: string
  format: "json" | "plain"
  waitFor: number // ms to wait for client-side rendering before capturing content
}

function renderPlain(r: ScrapeResult): string {
  const lines = [r.title || "(untitled)", r.url]
  if (r.statusCode !== null) lines.push(`Status: ${r.statusCode}`)
  lines.push("", r.markdown || r.description || "(no content extracted)")
  return lines.join("\n")
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  try {
    const env = await apiPost<FirecrawlScrapeData>(SCRAPE_PATH, {
      url: opts.url,
      formats: [{ type: "markdown" }],
      onlyMainContent: true,
      waitFor: opts.waitFor,
      timeout: 60000,
    })
    if (!env.success || !env.data) {
      writeError(env.error || `could not scrape ${opts.url}`, "SCRAPE_FAILED")
      return 1
    }
    const result = toScrapeResult(opts.url, env.data)

    if (opts.format === "plain") {
      process.stdout.write(renderPlain(result) + "\n")
    } else {
      process.stdout.write(JSON.stringify(result, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SCRAPE_FAILED")
    return 1
  }
}
