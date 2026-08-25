# Search Queries for Job Scraper

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first. Shipped country-agnostic CLIs include `linkedin-search` and `freehire-search`; Danish demos and any skill you add with `/add-portal` are included the same way. You do **not** need a matching `site:` line below for those CLIs to run.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails. `firecrawl-search search --domain naukri.com`/`--domain foundit.in` was tried live and found to return **category listing pages**, not individual job postings (see `.agents/skills/firecrawl-search/url-reference.md`) — don't use it as a Naukri/FoundIt-specific replacement for the WebSearch fallback below. If `FIRECRAWL_API_KEY` is set, it's still useful for an unscoped open-web `search`, and `detail <url>` remains the right tool for recovering a specific posting that returned empty (see Step 2 below).

## Search Sites

Primary:
- **linkedin.com/jobs** - LinkedIn job listings
- **naukri.com** - Naukri job board (India)
- **foundit.in** - FoundIt job board (India)

Secondary (company career pages via Google):
- Direct Google searches with `site:` filters for known target companies (e.g., Microsoft, ThoughtWorks, EPAM)

## Query Categories

Queries are grouped by priority. Each query should be combined with your location terms (e.g. your city, region, or metro area) where the site supports it.

### Priority 1: AI and Applied-AI Roles

These match your strongest and most desired career direction.

```
site:linkedin.com/jobs "AI Engineer" "Hyderabad"
site:linkedin.com/jobs "Applied AI Engineer" "India"
site:linkedin.com/jobs "Generative AI Engineer" "India"
site:linkedin.com/jobs "LLM Engineer" "India"
site:linkedin.com/jobs "AI Platform Engineer" "India"
site:naukri.com "Software Engineer AI" "Hyderabad"
```

### Priority 2: .NET and Full-Stack Roles

These match your domain expertise.

```
site:naukri.com ".NET Engineer" "Hyderabad"
site:naukri.com "Backend Engineer" "C#" "Mumbai"
site:naukri.com "Full Stack Engineer" "Angular" "Hyderabad"
site:naukri.com "Full Stack Developer" "C#" "Mumbai"
site:linkedin.com/jobs "C# Developer" "India"
site:linkedin.com/jobs "ASP.NET Core Developer" "India"
site:linkedin.com/jobs "Application Developer" ".NET" "India"
```

### Priority 3: Software, Platform, and Developer-Tooling Roles

Adjacent roles you could pivot into.

```
site:linkedin.com/jobs "Software Engineer" "India"
site:linkedin.com/jobs "Platform Engineer" "India"
site:linkedin.com/jobs "Product Engineer" "India"
site:linkedin.com/jobs "Python Engineer" "India"
site:linkedin.com/jobs "GitHub Copilot" "India"
site:naukri.com "Angular" "TypeScript" "Hyderabad"
site:naukri.com "Python" "GenAI" "Bengaluru"
```

### Priority 4: Broader Technical / Consulting

Wider net for general technical roles.

```
site:naukri.com "GenAI Developer" "Hyderabad"
site:linkedin.com/jobs "AI Developer" "Mumbai"
site:naukri.com "Technical Consultant" "AI" "Bengaluru"
site:linkedin.com/jobs "Cloud Engineer" "Azure" "India"

## Keyword Strategy

Use exact terms from the posting when the candidate's experience supports them. Prioritize:

`C#`, `.NET`, `ASP.NET`, `Entity Framework`, `SQL Server`, `REST APIs`, `Angular`, `TypeScript`, `Python`, `Git`, `Docker`, `Azure`, `CI/CD`, `Microservices`, `GenAI`, `LLMs`, `Prompt Engineering`, `GitHub Copilot`, and `MCP`.

Do not add a keyword solely for search visibility when it cannot be supported by the candidate profile or CV.

## Target Companies

Prioritize roles at product and engineering-led organizations where .NET, Angular, developer tooling, and applied AI overlap: Microsoft, Oracle, ServiceNow, Salesforce, Atlassian, NVIDIA, EPAM, Thoughtworks, Persistent, GlobalLogic, LTIMindtree, Razorpay, PhonePe, Jio Platforms, BrowserStack, CRED, and well-funded AI startups. This is a preference signal, not an exclusion filter.
```

## Location Filter

When evaluating results, verify the job location is within reasonable commute distance from your home. Define acceptable areas:
- Hyderabad, Telangana (first priority)
- Mumbai, Maharashtra (second priority)
- Bengaluru, Karnataka (third priority)
- Pune, Maharashtra (optional)
- Remote roles open to candidates in India

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries
