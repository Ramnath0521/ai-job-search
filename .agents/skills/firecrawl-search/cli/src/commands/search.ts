import { apiPost, toResult, writeError, type FirecrawlWebResult, type JobResult } from "../helpers.js"

const SEARCH_PATH = "/v2/search"

export interface SearchOpts {
  query: string
  limit: number
  format: "json" | "table" | "plain"
  includeDomains: string[]
  excludeDomains: string[]
  country?: string
  scrapeContent: boolean // when true, ask Firecrawl to render+return markdown for each hit (costs more credits)
}

function buildBody(opts: SearchOpts): Record<string, unknown> {
  const body: Record<string, unknown> = {
    query: opts.query,
    limit: opts.limit,
    sources: [{ type: "web" }],
  }
  if (opts.includeDomains.length) body.includeDomains = opts.includeDomains
  if (opts.excludeDomains.length) body.excludeDomains = opts.excludeDomains
  if (opts.country) body.country = opts.country
  if (opts.scrapeContent) {
    body.scrapeOptions = { formats: [{ type: "markdown" }], onlyMainContent: true }
  }
  return body
}

function shortDate(_r: JobResult): string {
  return "—" // Firecrawl web search does not return a posting date
}

interface Column {
  header: string
  width: number
  cell: (r: JobResult) => string
}

function renderTable(rows: JobResult[]): string {
  if (rows.length === 0) return "No results."
  const columns: Column[] = [
    { header: "TITLE", width: 46, cell: (r) => r.title },
    { header: "URL", width: 60, cell: (r) => r.url },
    { header: "DATE", width: 10, cell: shortDate },
  ]
  const row = (cells: string[]) => cells.map((c, i) => c.slice(0, columns[i].width).padEnd(columns[i].width)).join("  ")
  const header = row(columns.map((c) => c.header))
  const body = rows.map((r) => row(columns.map((c) => c.cell(r))))
  return [header, "-".repeat(header.length), ...body].join("\n")
}

function renderPlain(rows: JobResult[]): string {
  if (rows.length === 0) return "No results."
  const block = (r: JobResult) => [r.title, `  ${r.url}`, r.description ? `  ${r.description.slice(0, 200)}` : ""].filter(Boolean).join("\n")
  return rows.map(block).join("\n\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const env = await apiPost<{ web?: FirecrawlWebResult[] }>(SEARCH_PATH, buildBody(opts))
    if (!env.success || !env.data) {
      writeError(env.error || "Firecrawl search returned no data", "SEARCH_FAILED")
      return 1
    }
    const rows = (env.data.web ?? []).map(toResult)

    if (opts.format === "table") {
      process.stdout.write(renderTable(rows) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(renderPlain(rows) + "\n")
    } else {
      process.stdout.write(JSON.stringify({ meta: { count: rows.length }, results: rows }, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}
