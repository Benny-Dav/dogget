---
name: prd-generator
description: >
  Generate comprehensive, well-structured Product Requirements Documents (PRDs) from user input.
  Use this skill whenever the user asks to create a PRD, product requirements document, product spec,
  feature spec, requirements doc, or says things like "write up the requirements for...",
  "document this feature", "I need a PRD for...", "spec out this product", or "help me plan this feature".
  Also trigger when the user describes a product idea and asks for documentation, planning artifacts,
  or wants to formalize loose product thinking into a structured document. Even if the user just says
  "I have a product idea" and wants help organizing it, this skill is likely the right fit.
  Output is a polished .docx PRD file ready for stakeholder review.
---

# PRD Generator

Generate professional Product Requirements Documents from product ideas, feature descriptions, or rough notes. The output is a polished `.docx` file with consistent formatting, ready for stakeholder review.

## When to Use

- User wants to create a PRD, product spec, or feature spec
- User has a product idea and wants to formalize it
- User needs to document requirements for a feature or product
- User uploads rough notes/briefs and wants a structured PRD
- User says "spec this out" or "write up the requirements"

## Workflow Overview

1. **Gather Context** — Understand what the user wants to build
2. **Fill Gaps** — Ask targeted questions to complete the picture
3. **Generate PRD** — Produce a structured, comprehensive document
4. **Deliver** — Output as a formatted `.docx` file

---

## Step 1: Gather Context

Start by understanding the user's product idea. Extract as much as possible from what they've already shared before asking questions. Look for:

- **Product/feature name** — What is this thing called?
- **Problem statement** — What problem does it solve? Who has this problem?
- **Target users** — Who are the primary and secondary users?
- **Proposed solution** — What does the user envision?
- **Key features** — What are the must-have capabilities?
- **Success metrics** — How will we know this worked?
- **Constraints** — Timeline, technical limitations, budget, dependencies?
- **Context** — Is this a new product, a feature within an existing product, an API, a redesign?

If the user uploads files (briefs, notes, slides, previous docs), read them first and extract all relevant information before asking questions.

## Step 2: Fill Gaps with Smart Questions

Don't ask a long checklist of questions. Instead:

- Identify the 2-4 most critical gaps in the information provided
- Ask focused questions that unlock the most value
- Suggest reasonable defaults where possible ("I'll assume this is targeting B2B SaaS users unless you tell me otherwise")
- Make it easy for the user — offer options rather than open-ended questions when possible

The goal is to get enough information to write a strong first draft without exhausting the user. A good PRD can be iterated on; perfectionism at the intake stage slows things down.

If the user says something like "just write it" or "use your best judgment", proceed with reasonable assumptions and flag them clearly in the document.

## Step 3: Generate the PRD

Read the docx skill before generating:

```
Read /mnt/skills/public/docx/SKILL.md
```

Then generate a `.docx` PRD using the structure below. Adapt the structure to the product — not every section needs equal depth, and some sections can be omitted for simpler features.

### PRD Structure

```
Title Page
  - Document title: "PRD: [Product/Feature Name]"
  - Author, date, version, status (Draft/In Review/Approved)

1. Overview
   1.1 Purpose — Why this document exists and what it covers
   1.2 Problem Statement — The problem being solved, with context
   1.3 Proposed Solution — High-level description of the solution

2. Goals & Success Metrics
   2.1 Objectives — What this product/feature aims to achieve
   2.2 Key Results — Measurable outcomes (KPIs, targets)
   2.3 Non-Goals — What this explicitly does NOT aim to do (reduces scope creep)

3. Users & Personas
   3.1 Target Users — Primary and secondary user segments
   3.2 User Personas — 1-3 brief personas with needs and pain points
   3.3 User Stories / Jobs to Be Done — Key user stories in standard format

4. Requirements
   4.1 Functional Requirements — What the system must do
       - Organized by feature area or user flow
       - Each requirement has an ID (e.g., FR-001), description, and priority (P0/P1/P2)
   4.2 Non-Functional Requirements — Performance, security, scalability, accessibility
   4.3 Data Requirements — What data is needed, stored, processed
   4.4 Integration Requirements — APIs, third-party services, existing systems

5. User Experience
   5.1 Key User Flows — Step-by-step flows for primary use cases
   5.2 Wireframes / Mockups — Placeholder note or description of key screens
   5.3 Edge Cases — Important edge cases and how they should be handled

6. Technical Considerations
   6.1 Architecture Notes — High-level technical approach (if known)
   6.2 Dependencies — Systems, teams, or services this depends on
   6.3 Technical Risks — Known technical challenges or unknowns

7. Launch Plan
   7.1 Milestones — Key phases and dates (if known)
   7.2 Release Strategy — Phased rollout, beta, feature flags, etc.
   7.3 Go/No-Go Criteria — What must be true before launch

8. Open Questions
   - Unresolved decisions or areas needing further research
   - Flagged assumptions that need validation

9. Appendix (optional)
   - Glossary, references, research links, competitive analysis
```

### Writing Guidelines

- **Be specific over vague.** "Users can filter search results by date, category, and status" beats "Users can filter search results."
- **Prioritize ruthlessly.** Every functional requirement gets a priority: P0 (must have for launch), P1 (important, soon after launch), P2 (nice to have).
- **Flag assumptions.** If you're filling in gaps with reasonable assumptions, mark them clearly: *"[Assumption: targeting mobile-first experience based on user segment]"*
- **Keep it scannable.** Use tables for requirements lists. Use short paragraphs. Stakeholders skim.
- **Write for the audience.** Engineers read the requirements and technical sections. PMs and leadership read the overview and goals. Design reads the UX section. Write each section for its audience.
- **Include non-goals.** Explicitly stating what's out of scope prevents misunderstandings.

### Formatting Guidelines

- Use a clean, professional style with consistent heading hierarchy
- Use tables for requirements (ID | Description | Priority | Notes)
- Use numbered sections for easy reference in discussions
- Include a table of contents
- Set document properties: title, author, date
- Use a professional color scheme for headings (dark blue or similar)

## Step 4: Deliver

1. Generate the `.docx` file using the docx skill's best practices
2. Copy to `/mnt/user-data/outputs/`
3. Present the file to the user with a brief summary of what's in it
4. Offer to iterate: "Want me to adjust any section, add more detail somewhere, or change the scope?"

---

## Adapting to Scale

Not every PRD needs every section at full depth. Match the document to the product:

| Scale | Example | Approach |
|-------|---------|----------|
| **Small feature** | Add dark mode toggle | 1-2 pages. Overview, requirements table, edge cases. Skip personas and launch plan. |
| **Medium feature** | New notification system | 3-5 pages. Full structure but concise. Brief personas, focused requirements. |
| **Large product** | New product line | 8-15 pages. Full structure with depth. Multiple personas, detailed requirements, architecture notes, phased launch plan. |
| **API / Platform** | Developer API | Focus on technical requirements, data models, integration specs. Lighter on UX. |

Gauge the scale from the user's description and adjust accordingly. When in doubt, start medium and offer to expand.

---

## Handling Uploaded Files

If the user uploads files (meeting notes, briefs, existing docs, competitor screenshots):

1. Read all uploaded files first
2. Extract every relevant detail — names, features, constraints, dates, user segments
3. Use this as the foundation; ask only about genuine gaps
4. Reference the source material where appropriate ("Per the brief, the target launch is Q3")

---

## Tips for Great PRDs

- The best PRDs are opinionated — they make clear recommendations, not just list options
- Non-goals are as valuable as goals; they prevent scope creep and align teams
- User stories ground abstract requirements in real behavior
- Open questions show intellectual honesty and prevent false confidence
- Requirements IDs (FR-001) make it easy to reference in tickets, design reviews, and standups
