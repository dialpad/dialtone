---
name: dialtone-lookup
description: Look up Dialtone documentation, components, tokens, utilities, and icons before making design-system decisions. Use when the user asks about Dialtone APIs, docs guidance, component usage, tokens, utilities, icons, or implementation patterns.
---

# Dialtone Lookup

## Goal

Ground Dialtone decisions in installed-version lookup data before editing or recommending API usage.

## Trigger

- Questions about Dialtone components, props, events, slots, examples, tokens, utility classes, icons, or docs guidance.
- Work that introduces or changes component usage, token usage, utility classes, icons, or public documentation patterns.
- Before implementing a UI or docs change where Dialtone conventions are uncertain.

## Required Context

- User question or target component/token/utility/icon/docs topic.
- `.agents/resources/dialtone-lookup.md`
- Changed source files when the lookup is part of implementation or review.

## Constraints

- Prefer the local `./node_modules/.bin/dialtone` CLI for version-sensitive docs, component, token, utility, and icon lookup.
- Use the configured Dialtone MCP server as a supplement when CLI output is insufficient or unavailable.
- Do not guess component APIs, token names, or utility classes when lookup tools can answer.
- Do not treat lookup results as authoritative over changed local source.
- Do not add private Dialpad context to lookup queries, commits, or PRs.

## Workflow

1. Identify whether the question is documentation guidance, component API, token, utility, icon, or mixed.
2. Load `.agents/resources/dialtone-lookup.md`.
3. Use the local Dialtone CLI first for installed-version evidence.
4. Use the Dialtone MCP server only when CLI output is insufficient, unavailable, or when a protocol tool is already the better fit.
5. Read changed source files before editing.
6. Summarize the lookup evidence and any source verification used.

## Done When

- The answer or implementation cites the lookup source used, such as MCP tool name or CLI command.
- Any source edits are verified against local files.
- Missing or failing lookup tools are reported with the fallback used.

## Verification

- `./node_modules/.bin/dialtone --help`
- `node .agents/evals/run-skill-contract-evals.mjs`

## References

- `.agents/resources/dialtone-lookup.md`
