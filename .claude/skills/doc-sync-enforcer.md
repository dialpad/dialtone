---
name: doc-sync-enforcer
description: Review maintained contributor guidance against an explicit Git diff. Report candidates and current review decisions; apply updates only within existing task authorization.
---

# Documentation review

Use the shared workflow in [.agents/resources/doc-sync.md](../../.agents/resources/doc-sync.md). Its single map, command, explicit comparison modes, review outcomes and freshness rules apply to both clients. Read that workflow before review; do not infer review completion from a touched document or session cache.

Run manually through `/doc-sync-enforcer` or use the advisory report supplied by the existing push/PR adapter. Identify the intended comparison and run the explicit command when another repository or boundary is needed. Record current decisions in the readiness report; apply prose changes only within existing authorization. The adapter grants no permission and makes no blocking decision.

The edit tracker remains for its other consumers. This workflow does not need its cache or create completion markers. Preserve frontmatter and human-authored sections, and update `last_updated` when corpus prose changes.
