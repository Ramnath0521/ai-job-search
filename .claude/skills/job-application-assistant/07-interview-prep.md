---
framework_version: 1.0.0
---

# Interview Preparation Guide

## STAR Format

Structure answers as: **Situation** (context), **Task** (your responsibility), **Action** (what you did), **Result** (outcome).

Keep answers to 1-2 minutes. Be specific. End with what you learned or would do differently.

## Ready-Made STAR Examples

### 1. Multi-Agent SDLC Framework (AI Architecture & Leadership)
**S:** Our team needed a scalable way to integrate AI assistance across the full SDLC — code reviews, requirement engineering, and workflow analysis — without creating a brittle one-off tool.
**T:** As the architect, I was responsible for designing and delivering a reusable, extensible multi-agent framework that the entire team could adopt.
**A:** Designed a 35+ agent, 21-skill multi-agent framework with role-based agents (developer, tester, product owner), built actor-critic and judge patterns for quality gating, and integrated it into repo-wide `.github` automation so all SDLC activities benefit automatically.
**R:** The framework is now actively used across the team for automated reviews, coding guideline enforcement, and requirement engineering. It has been recognised as a flagship AI engineering initiative and contributed to my Siemens LEAD Award.
**Use for:** "Tell me about a complex system you designed", "Leadership/initiative", "How do you work with AI/GenAI?"

---

### 2. Source Code Knowledge Graph (Python & Architecture Analysis)
**S:** Our codebase had 1,884 files spread across C# and TypeScript with no efficient way to trace dependencies, assess blast radius of changes, or enforce architecture standards.
**T:** I needed to build a tool from scratch that could parse and index the entire codebase into a queryable graph structure, usable by developers and AI agents.
**A:** Built a Python/SQLite knowledge graph indexing ~30K nodes and ~37K edges. Exposed 9 MCP tools and a 5-view dashboard for blast-radius analysis, workflow tracing, and architecture health scoring. Iterated from v0.13 to v0.17.1 across 37+ iterations, reducing max method size by 74% and bringing the architecture score to 97/100.
**R:** Developers now use the tool to make confident change decisions. It also feeds our AI agents with verified structural context, reducing hallucinated code suggestions.
**Use for:** "Problem-solving and persistence", "Technical deep-dive on a project", "Tell me about a tool you built"

---

### 3. Formula Builder Feature — 30-Day Delivery (Full-Stack + Customer Focus)
**S:** A key customer needed a formula-builder feature and the deadline was tight — 30 days from concept to release.
**T:** I was responsible for building the feature end-to-end (frontend Angular, backend C#/.NET) and validating it against customer workflows before release.
**A:** Built a 3-day POC first, validating ~95% of customer workflows to de-risk the full build. Then delivered the complete feature on schedule, achieving 90% customer acceptance — exceeding the 80% target — and saving 27 person-days through the POC approach.
**R:** The feature shipped on time and was well received by the customer. The POC-first approach is now a standard practice on the team.
**Use for:** "Delivering under pressure", "Customer-facing delivery", "Agile/fast-paced delivery"

---

### 4. Large-Scale Rebranding Migration (Zero-Downtime, 100% Test Coverage)
**S:** The product underwent a full rebranding which required migrating application binaries, services, serialization, templates, and 300+ test assets — with zero tolerance for downtime.
**T:** I led the migration effort, responsible for planning, executing, and validating every component in the migration scope.
**A:** Created a systematic migration plan covering all layers, automated the bulk of the migration, and maintained 100% test coverage throughout. Coordinated closely with QA to ensure zero-downtime deployment.
**R:** Delivered 2 weeks ahead of schedule with zero downtime and 100% test coverage. All 300+ automated tests migrated and passing.
**Use for:** "Risk management", "Quality and testing", "Meeting deadlines/working under pressure"

---

### 5. Self-Upgrading AI Knowledge Base (System Design — Advanced)
**S:** AI agents were relying on stale context and producing hallucinated outputs because the underlying knowledge base had no mechanism to detect or remediate drift.
**T:** Design a production-grade self-upgrading system that keeps AI knowledge fresh, traceable, and safe to roll back.
**A:** Designed a 4-phase system: drift detection, freshness scoring, citation provenance tracking, and governed promotion with rollback strategy. Built a 17-test deterministic evaluation harness to objectively measure knowledge quality before and after upgrades.
**R:** The system significantly reduced stale AI context and hallucinated outputs. The evaluation harness gives the team an objective, repeatable quality bar for all future knowledge updates.
**Use for:** "System design interview", "Dealing with ambiguity and undefined problems", "Applied AI engineering experience"

---

## Common Tough Questions

### "You don't have [specific skill/experience]."
> Acknowledge the gap directly, then bridge: "You're right — I haven't used [X] professionally, but I've worked extensively with [adjacent skill] which shares [key concept]. I ramp up quickly — at Siemens I went from Graduate Trainee to winning the LEAD Award in under 2 years, and I have 313+ commits since joining. I'm confident I can close that gap fast."

### "You only have 2 years of experience."
> "Those 2 years were unusually dense — I built and delivered a 35-agent AI framework, a knowledge graph indexing 30K nodes, a customer-facing feature achieving 90% acceptance, and a zero-downtime migration, all while earning the Siemens LEAD Award for Emerging Excellence. Quality and impact matter more than calendar time."

### "Where do you see yourself in 5 years?"
> "I want to be a Senior or Lead AI/Full-Stack Engineer, driving architectural decisions on AI-integrated systems. I'm especially interested in how AI is reshaping the SDLC and enterprise software — I want to be at the forefront of that, not just as an individual contributor but as someone who elevates the teams around me."

### "What's your biggest weakness?"
> "I can be too deep in the details when a broader view would be more efficient. I've been actively working on this — I now set explicit 'zoom-out' checkpoints for myself when I'm mid-build, and I've found that talking to stakeholders earlier (not just at delivery) actually makes the end result better."

### "Why are you leaving Siemens?"
> "Siemens has been an excellent start to my career and I'm proud of what I've delivered there. I'm now looking for a role in [Hyderabad/Mumbai/Bengaluru or remote India] where I can continue growing technically, specifically in applied AI and full-stack development, and where I can take on broader engineering ownership with clear career progression."

### "What are your compensation expectations?"
> "Based on the scope of the role, my experience, and current market expectations, I am targeting 11 to 15 LPA. I am open to discussing the complete package and the role's growth opportunity, especially for a position where I can contribute to applied AI, developer tooling, or modern full-stack engineering."

### "Why this company specifically?"
> Customize per company. Must reference: specific projects, company values, market position, or team structure. Never give a generic answer. Research LinkedIn, company blog, and recent news before each interview.

## Questions You Should Ask Interviewers

### About the Role
- "What does a typical week look like in this role?"
- "What would success look like in the first 6 months?"
- "What's the biggest challenge the team is facing right now?"
- "How much of the work is greenfield vs. maintenance?"

### About the Team
- "How big is the team, and how do you divide work?"
- "What does the development/project lifecycle look like, from idea to production?"
- "How do you onboard new team members?"

### About Tech & Growth
- "What's your current tech stack and are there plans to evolve it?"
- "Is there room to grow into more architectural or strategic decisions?"
- "How does the team stay current with AI/GenAI tooling?"
- "What's the appraisal cycle and what does the career ladder look like?"

### About Culture (use these to prevent disappointment)
- "How would you describe the team culture?"
- "What does professional development look like here?"
- "What's the balance between new development and maintenance work?"
- "What do people who thrive here have in common?"

## Phone/Video Interview Tips
- Have STAR examples written out (use this file)
- Keep a glass of water nearby
- Smile when speaking (it changes your tone)
- Ask for clarification if a question is vague
- It's OK to take 5 seconds to think before answering
- End with: "Is there anything else you'd like to know about my background?"

## After the Application (Best Practice)

### Follow-Up Etiquette
- **Don't call to "stand out"** or to learn more about the role post-submission — this risks a negative impression
- If the employer specified a timeline, respect it and wait
- If no timeline was given and significant time has passed (2+ weeks), a brief follow-up email is acceptable
- If you have genuinely new, relevant information to share, a short follow-up is fine

### Thank-You Notes
- When you receive any update (interview invitation, rejection, or status update), send a brief thank-you message
- Express appreciation for their time and the process
- Keep it short (2-3 sentences)

## Roleplay Guidelines
When the user asks for interview practice:
1. Ask which role/company to simulate
2. Start with easy warm-up questions ("Tell me about yourself")
3. Progress to role-specific technical questions (C#/.NET for .NET roles; GenAI/agents for AI roles)
4. Include 1-2 behavioral questions using the competencies from the job posting
5. End with a tough question or curveball
6. After each answer, give brief feedback: what worked, what to sharpen
7. Suggest which STAR example above would work best for each question
