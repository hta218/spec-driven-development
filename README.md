# Spec-Driven Development (SDD)

A methodology and set of conventions for teams where AI agents write most of the code.

## The problem

AI coding agents are productive but opaque. A feature built by one agent (or dev) becomes a black box for the next. The codebase grows faster than anyone can read it, and when something needs to change, nobody knows which files are safe to touch, what the original intent was, or where the boundaries of a feature end.

Code is too much to read. Specs become the source of truth.

SDD inverts the typical workflow: you write a markdown spec first, the agent implements from it, and the spec stays updated as the feature evolves. Any dev or agent can understand any feature by reading one spec folder.

## Who this is for

Engineering teams using AI coding agents (Cursor, Claude Code, Copilot, Windsurf, or similar) who want a shared convention so that features stay understandable across authors and over time.

## Repo structure

- `CONVENTIONS.md` — The core spec format, rules, and methodology. Start here.
- `SETUP.md` — How to adopt SDD in an existing or new project.

## Quick start

1. Read `CONVENTIONS.md` to understand the spec format and rules.
2. Read `SETUP.md` to adopt SDD in your project.

That's it. There's nothing to install.

## Philosophy

- **Specs describe intent and boundaries, not implementation details.** How something works lives in code. Why it exists and what it must not break lives in the spec.
- **The original prompt is sacred.** The exact prompt or requirement that started a feature must be preserved verbatim. It's the source of truth for why a feature exists.
- **Each dev uses their own agent and workflow.** SDD doesn't dictate which AI agent or framework you use. It only requires that specs follow the same convention.
- **Start minimal, iterate the format based on real usage.** Don't over-engineer the spec structure up front. Let your team's actual pain points shape the conventions.

## Contributing

Contributions and feedback are welcome via GitHub issues. If something in the conventions doesn't hold up in practice, open an issue describing your use case.

## License

MIT
