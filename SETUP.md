# Setting Up Spec-Driven Development

A practical adoption guide for teams with existing or new projects.

**Audience**: Engineers onboarding their team to SDD.
**Time to functional setup**: ~2 hours on day 1.

---

## Prerequisites

- Your team uses AI coding agents (Claude Code, Cursor, Copilot, Windsurf, etc.)
- Project is tracked in git
- Team wants a shared convention for features built by agents

---

## Step 1: Create the .specs/ Folder

Create a `.specs/` folder at your project root:

```
your-project/
  .specs/
  src/
  package.json
  ...
```

This is where all feature specs live, regardless of your source code structure. It works with any project layout: monorepo, multi-package, flat, whatever. The `.specs/` folder is always at the root, always separate from your code.

---

## Step 2: Create Your First Feature Spec

Each feature gets its own folder inside `.specs/`, using this naming pattern:

```
.specs/{index}--{kebab-case-title}--{YYYY-MM-DD}/
```

Double dashes are the separators. Examples:

```
.specs/001--user-authentication--2026-01-15/
.specs/002--billing-webhooks--2026-01-22/
.specs/003--export-to-csv--2026-02-03/
```

Each feature folder contains up to three files:

| File | Required | Purpose |
|------|----------|---------|
| `README.md` | Yes | Status, owner, dates, original prompt, brief summary |
| `plan.md` | Yes | Agent-generated implementation plan, related files/folders, under 500 lines |
| `work-logs.md` | Optional | Timeline of work sessions |

**The original prompt is the most important part.** Paste it verbatim in `README.md`. Don't paraphrase, don't clean it up. Future agents and teammates need to see what was actually asked for.

Use the templates in [CONVENTIONS.md](./CONVENTIONS.md) for each file.

Don't try to spec the entire codebase on day one. Write specs for your 2-3 most active features as examples. Coverage grows from there.

---

## Step 3: Configure Your AI Agents

Add rules so agents know to check `.specs/` before working on any feature. The rules are agent-agnostic; same content, different delivery file.

**For Claude Code (`CLAUDE.md` or `AGENTS.md`):**

```markdown
## Spec-Driven Development

Before working on any feature:
1. Check .specs/ for existing feature specs
2. READ the feature's README.md to understand the original intent
3. READ the feature's plan.md to understand scope and related files
4. Only touch files listed in the plan

After working:
5. Update work-logs.md with what was done
6. Update plan.md if the approach changed
7. Never modify the "Original Prompt" section
```

**For Cursor (`.cursor/rules/*.mdc`):**

```markdown
---
description: Spec-Driven Development workflow
globs: "**/*"
---

Before working on any feature:
1. Check .specs/ for existing feature specs
2. READ the feature's README.md to understand the original intent
3. READ the feature's plan.md to understand scope and related files
4. Only touch files listed in the plan

After working:
5. Update work-logs.md with what was done
6. Update plan.md if the approach changed
7. Never modify the "Original Prompt" section
```

For other agents: same rules, placed in whatever instruction file they read.

---

## Step 4: Team Workflow

The core loop is: spec first, code second, update spec after.

**Starting a new feature:**
Create the spec folder before writing any code. The spec doesn't have to be perfect, but the folder and `README.md` should exist, and the original prompt should be pasted in before any agent touches the implementation.

**Picking up someone else's feature:**
Read their spec folder first. `README.md` tells you what was wanted and why. `plan.md` tells you what files are in scope. `work-logs.md` (if present) tells you what's been done. Then continue.

**Modifying an existing feature:**
Read the spec, make your changes, update `plan.md` if scope changed, add an entry to `work-logs.md`. Never edit the "Original Prompt" section in `README.md`.

This workflow doesn't require buy-in from everyone on day one. One engineer adopting it creates specs that everyone else benefits from when they touch those features.

---

## Bootstrapping Strategy

The goal is working coverage fast, not perfect coverage eventually.

| Milestone | Action |
|-----------|--------|
| Day 1 | Create `.specs/`, adopt CONVENTIONS.md, write first 1-2 feature specs |
| Week 1 | All new features start with a spec folder |
| Week 2 | Active features being modified get retroactive specs |
| Week 4 | Retrospective: which parts of the spec are useful? Adjust. |
| Ongoing | Coverage grows organically through normal development |

Don't block existing work waiting for full coverage. Coverage reaches around 80% within a quarter through normal development churn. The spec system earns its value every time someone picks up a feature they didn't write.
