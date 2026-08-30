# Skills Engine & Domain Playbooks Specification

The Wizard Skills Engine provides a declarative, auditable mechanism to equip the autonomous agent with specialized enterprise analytical playbooks, statistical routines, and corporate data definitions without modifying the core codebase.

---

## 1. Skill Architecture & The Declarative Specification

A Wizard Skill is defined purely in Markdown (`SKILL.md`) with structured YAML frontmatter. Unlike raw Python scripts that execute unchecked, skills provide structured guidance that the Planner model integrates into reasoned plans:

```markdown
---
name: "financial-dcf-valuation"
description: "Discounted Cash Flow (DCF) modeling, WACC calculation, and sensitivity tables."
tags: ["finance", "valuation", "dcf", "wacc"]
version: "1.2.0"
author: "Corporate Analytics Team"
---

# Financial DCF Modeling Guidelines

## Analytical Methodology
1. **Free Cash Flow to Firm (FCFF)**: Compute `EBIT * (1 - Tax Rate) + D&A - CapEx - Delta NWC`.
2. **Terminal Value**: Apply both Gordon Growth (`g = 2.5%`) and Exit Multiple (`EV/EBITDA`) approaches.
3. **Sensitivity Matrix**: Generate a 2D table varying WACC (+/- 100bps) against Terminal Growth Rates.

## Required Plotting Standards
- Render valuation waterfall charts using Plotly interactive bars.
- Enforce thousand-separator formatting (`$#,##0`) on all financial tables.
```

---

## 2. Hard Security Boundary: No Unchecked Executables

Enterprise security mandates that external skills cannot introduce arbitrary code execution vectors:

```diagram
                          ┌──────────────────────────┐
                          │    wizard skills add     │
                          │   (Remote GitHub URL)    │
                          └────────────┬─────────────┘
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │  Static Security Scanner │
                          │  - Inspects file types   │
                          │  - Scans AST syntax      │
                          └────────────┬─────────────┘
                                       │
                 ┌─────────────────────┴─────────────────────┐
                 │                                           │
                 ▼                                           ▼
      [Any .py, .sh, .exe, .so]                  [Pure SKILL.md Markdown]
                 │                                           │
                 ▼                                           ▼
         [REJECTED OUTRIGHT]                         [STAGED FOR REVIEW]
   "Skills cannot contain binaries"               Pin commit hash & Prompt User
```

1. **Strict Filetype Allowlist**: Any skill directory containing executable binaries or raw scripts (`.py`, `.sh`, `.ps1`, `.exe`, `.so`, `.dll`) is **immediately rejected** at import time.
2. **Execution via Worker Isolation**: Python snippets in a skill are treated as illustrative reference text. When generating analysis code, the Worker model authors fresh code that is independently scanned by CodeGuard and executed within the sandboxed runtime.

---

## 3. Three-Tier Scope Hierarchy

Skills resolve hierarchically with deterministic precedence:

| Tier | File Location | Scope | Precedence |
|---|---|---|:---:|
| **Project Tier** | `.wizard/skills/<skill-name>/` | Current project/workspace directory only. | **1 (Highest)** |
| **User Tier** | `~/Library/Application Support/Wizard/skills/` | Across all sessions on this workstation. | **2** |
| **Built-In Tier** | `<wizard-install>/skills/` | Pre-bundled system analytical playbooks. | **3 (Base)** |

If a project-level skill shares a name with a built-in skill, the project version cleanly overrides the system default while surfacing a shadow notice in `wizard skills list`.

---

## 4. Discovery & Semantic Retrieval

During the **Observe & Plan** stage, Wizard's control plane queries the Skill Catalog:
1. **Lexical & Embedding Retrieval**: Matches user query intent against skill descriptions, tags, and semantic bodies.
2. **Zero-Latency Ingestion**: Candidate skill instructions are injected solely into the Manager's planning context, ensuring worker coding loops are not burdened with redundant context.
3. **Explicit Provenance Attribution**: When a skill shapes an analysis plan, the event stream logs an `AppliedSkillEvent`, surfacing the exact skill name, version, and cited methodology in the final response.

---

## 5. Skill Promotion & Recurring Pattern Capture

Wizard autonomously detects recurring analytical workflows:
- **Recurring Question Detection**: When similar inquiries are formulated across multiple sessions, Wizard offers to consolidate the successful execution trajectory into a new draft skill.
- **Recovery Pattern Synthesis**: If a complex data anomaly (e.g. unconventional date formats in legacy ERP dumps) was successfully diagnosed and resolved through self-healing, Wizard can save the self-correction recipe as a project skill.
- **One-Click Promotion**: Users can click **Save as Skill** directly from the UI canvas on any completed analysis turn.
