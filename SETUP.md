# Setting Up Spec-Driven Development

A practical adoption guide for teams with existing or new projects.

**Audience**: Senior engineers onboarding their team to SDD.
**Time to functional setup**: ~2 hours on day 1.

---

## Prerequisites

- Your team uses AI coding agents (Claude Code, Cursor, Copilot, Windsurf, etc.)
- Project is tracked in git
- Team is willing to enforce conventions via CI

---

## Step 1: Directory Structure

Adopt feature-based co-location. Each feature module gets a `SPEC.md` alongside its code:

```
src/
  features/
    auth/
      SPEC.md
      auth.service.ts
      auth.controller.ts
      __tests__/
    billing/
      SPEC.md
      billing.service.ts
      ...
SYSTEM.md
CONVENTIONS.md
```

The spec lives **with the code**, not in a separate `/specs/` or `/docs/` directory. This keeps `git log` showing spec and code changes together, and PRs that touch code without touching the spec become visually obvious in review.

Add a top-level `SYSTEM.md` for architecture overview and feature index (see Step 5).

---

## Step 2: Create Your First Specs

Don't try to spec the entire codebase retroactively. That's a large effort nobody will finish.

Write 2-3 specs for your most active or important features as examples. The owning dev writes them, not AI generating from existing code. Specs capture **intent**, not implementation.

Use the template from [CONVENTIONS.md](./CONVENTIONS.md).

**Going forward:**
- New features must have a spec before implementation starts
- Modified features must have their spec updated before modification starts

---

## Step 3: Configure Your AI Agents

Add agent rules so all agents on your team follow the same SDD workflow. The rules are agent-agnostic — same content, different delivery file.

**For Claude Code (`CLAUDE.md` or `AGENTS.md`):**

```markdown
## Spec-Driven Development Rules

Before modifying ANY file in src/features/{X}/:
1. READ src/features/{X}/SPEC.md
2. Extract Boundaries — these are the ONLY files you may touch
3. Extract Invariants — these are constraints you MUST NOT violate
4. Plan changes — validate plan doesn't violate Invariants

After modifying:
5. UPDATE the Changelog in SPEC.md with date, author, summary
6. If changes require touching files OUTSIDE Boundaries:
   → STOP. Flag to human. Propose spec update.
7. If Invariants may have changed:
   → STOP. Flag for human review. Do NOT auto-update Invariants.
```

**For Cursor (`.cursor/rules/*.mdc`):**

```markdown
---
description: Spec-Driven Development workflow for feature modifications
globs: src/features/**/*
---

Before modifying ANY file in src/features/{X}/:
1. READ src/features/{X}/SPEC.md
2. Extract Boundaries — these are the ONLY files you may touch
3. Extract Invariants — these are constraints you MUST NOT violate
4. Plan changes — validate plan doesn't violate Invariants

After modifying:
5. UPDATE the Changelog in SPEC.md with date, author, summary
6. If changes require touching files OUTSIDE Boundaries:
   → STOP. Flag to human. Propose spec update.
7. If Invariants may have changed:
   → STOP. Flag for human review. Do NOT auto-update Invariants.
```

**For other agents (Copilot, Windsurf, etc.):**

Place the same rules in whatever instruction file your agent reads. The content is identical — only the delivery mechanism changes.

---

## Step 4: CI Enforcement

### Tier 1 (day 1): Spec presence check

Any PR touching `src/features/{X}/**` must also touch `src/features/{X}/SPEC.md`.

```bash
#!/bin/bash
# ci/check-spec.sh
# Fails if feature code changed but SPEC.md wasn't updated

CHANGED_FEATURES=$(git diff --name-only origin/main...HEAD \
  | grep '^src/features/' \
  | cut -d'/' -f1-3 \
  | sort -u)

EXIT_CODE=0
for feature_dir in $CHANGED_FEATURES; do
  if ! git diff --name-only origin/main...HEAD | grep -q "^${feature_dir}/SPEC.md"; then
    echo "ERROR: ${feature_dir}/ was modified but ${feature_dir}/SPEC.md was not updated"
    EXIT_CODE=1
  fi
done

exit $EXIT_CODE
```

Wire this into your CI pipeline (GitHub Actions, GitLab CI, etc.) as a required check.

### Tier 2 (week 2): Spec linter

Add a linter that validates required sections exist in each `SPEC.md` and that the Boundaries file list matches actual files in the directory. A simple grep-based script works fine at this stage.

### Tier 3 (later): AI review bot

An AI-assisted bot reads the diff plus spec and flags inconsistencies. Optional, but high signal-to-noise once your specs are mature.

---

## Step 5: Write SYSTEM.md

Create a top-level `SYSTEM.md` with:

- High-level architecture overview (data flow, key infrastructure, deployment topology)
- Feature index: one-line description per feature module
- Cross-cutting concerns: shared utilities, auth middleware, error handling, observability

Example feature index section:

```markdown
## Feature Index

| Feature | Description |
|---------|-------------|
| auth | JWT-based authentication and session management |
| billing | Subscription lifecycle and payment processing via Stripe |
| notifications | Email and push delivery with retry logic |
```

Maintain this manually until you hit roughly 15 features, then auto-generate the index by parsing `SPEC.md` files.

---

## Bootstrapping Strategy

The goal is working coverage fast, not perfect coverage eventually.

| Milestone | Action |
|-----------|--------|
| Day 1 | Write `CONVENTIONS.md` (or adopt this repo's), add CI check, write 2-3 example specs |
| Week 1 | All actively touched features get specs as they're modified |
| Week 2 | Add spec linter to CI |
| Week 4 | Retrospective: which sections are useful? Adjust the template. |
| Ongoing | New features always start with a spec. Coverage grows organically. |

Don't block existing work waiting for full coverage. The CI check gates new changes, not past ones. Coverage reaches ~80% within a quarter through normal development churn.
