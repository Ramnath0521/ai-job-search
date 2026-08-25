#!/usr/bin/env bun
// Self-contained CLI wrapping the Firecrawl hosted API (api.firecrawl.dev).
// Unlike the other portal skills in this repo, Firecrawl is not a job-board API —
// it is a general web-search + JS-rendering scrape service. It fills two gaps:
//   1. `search` reaches job boards that have no dedicated CLI here (Naukri, FoundIt, ...)
//      by searching the open web scoped to a domain via --domain.
//   2. `detail <url>` renders and returns markdown for ANY url, including
//      client-side-rendered pages (Workday, Ashby, Greenhouse-embedded SPAs) that
//      WebFetch/other portal CLIs return empty on.
// Requires FIRECRAWL_API_KEY (free tier available at firecrawl.dev).

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"
import { baseUrl } from "./helpers.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

const ALIAS: Record<string, string> = { q: "query", n: "limit" }

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith("-")) {
      ;(flags._ as string[]).push(a)
      continue
    }
    const name = a.replace(/^-+/, "")
    const key = ALIAS[name] ?? name
    const next = argv[i + 1]
    let value: string | boolean = true
    if (next !== undefined && !next.startsWith("-")) {
      value = next
      i++
    }
    if (key === "domain" || key === "exclude-domain") {
      const acc = Array.isArray(flags[key]) ? (flags[key] as string[]) : []
      if (typeof value === "string") acc.push(value)
      flags[key] = acc
    } else {
      flags[key] = value
    }
  }
  return flags
}

type FlagValue = string | boolean | string[] | undefined

function stringFlag(raw: FlagValue): string | undefined {
  return typeof raw === "string" ? raw : undefined
}

function stringList(raw: FlagValue): string[] {
  return Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : []
}

const HELP = `firecrawl-cli — general web search + JS-rendering scrape via Firecrawl

USAGE
  bun run src/cli.ts search -q "<query>" [flags]
  bun run src/cli.ts detail <url> [--format json|plain] [--wait-for <ms>]

SEARCH FLAGS
  --query, -q <text>      Search query (required). Combine keywords + location
                           yourself, e.g. -q "AI Engineer Hyderabad".
  --domain <host>         Scope to a domain (repeatable), e.g. --domain naukri.com
                           --domain foundit.in. Maps to includeDomains.
  --exclude-domain <host> Exclude a domain (repeatable). Maps to excludeDomains.
  --country <code>        2-letter country bias, e.g. --country IN.
  --limit, -n <n>         Max results. Default 10.
  --scrape-content        Also render+return each hit's full page as markdown
                           (more accurate, costs more Firecrawl credits per result).
  --format <fmt>          json (default) | table | plain.

DETAIL (scrape one page)
  <url>                   Any URL. Renders JS, returns clean markdown — use this
                           when a job posting's detail page came back empty from
                           WebFetch or another portal CLI (common on Workday,
                           Ashby, Greenhouse-embedded, and similar SPA-based ATS).
  --wait-for <ms>          Extra render wait before capture. Default 0 (Firecrawl
                           already waits for the page to settle); raise it (e.g.
                           2000) for pages that load content on a delay.
  --format <fmt>          json (default) | plain.

EXAMPLES
  bun run src/cli.ts search -q "AI Engineer Hyderabad" --domain naukri.com --limit 10 --format table
  bun run src/cli.ts search -q "Software Engineer .NET Bengaluru" --domain foundit.in --format table
  bun run src/cli.ts detail "https://jobs.example.wd1.myworkdayjobs.com/Careers/job/..." --format plain

Requires FIRECRAWL_API_KEY (export it, or set it in the shell profile before
running). Get a key at https://www.firecrawl.dev/app/api-keys — free tier
available. Base URL is swappable via FIRECRAWL_API_URL for a self-hosted
instance. Current base: ${baseUrl()}
`

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  if (cmd === "search") {
    const query = stringFlag(flags.query)
    if (!query) {
      process.stderr.write(JSON.stringify({ error: "search requires --query/-q", code: "NO_QUERY" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: SearchOpts = {
      query,
      limit: flags.limit ? Math.max(1, parseInt(flags.limit as string, 10)) : 10,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
      includeDomains: stringList(flags.domain),
      excludeDomains: stringList(flags["exclude-domain"]),
      country: stringFlag(flags.country),
      scrapeContent: flags["scrape-content"] === true,
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const url = (flags._ as string[])[1]
    if (!url) {
      process.stderr.write(JSON.stringify({ error: "detail requires a <url>", code: "NO_URL" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const waitFor = flags["wait-for"] ? Math.max(0, parseInt(flags["wait-for"] as string, 10)) : 0
    const opts: DetailOpts = { url, format: fmt === "plain" ? "plain" : "json", waitFor }
    return runDetail(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    process.stderr.write(
      JSON.stringify({
        error: e instanceof Error ? e.message : String(e),
        code: "INTERNAL_ERROR",
      }) + "\n",
    )
    process.exit(1)
  })
