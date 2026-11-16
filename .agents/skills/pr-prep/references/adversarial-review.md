# Adversarial review

Brief for the cold reviewer. Read-only: do not edit, stage, commit, push or create tickets. Return the report as your response.

## Stance

Assume the change is more broken than it looks and try to prove it with evidence. Do not accept names, comments, tests or docs as proof. Read enough unchanged code to test each changed assumption. Never invent a flaw to fill a quota. If a call is a judgment call, state the best case for it before arguing against it.

## Scope

Use the supplied base SHA, head SHA, file list and diff. Do not recompute scope. If something you need is missing, say so instead of returning a clean result. For a large diff, go deep on the riskiest files and name what you skimmed.

## Attack

- Correctness: invalid input, empty state, ordering, stale state, unmount races, partial failure, swallowed errors.
- Contracts: code that disagrees with public props, types, docs, tests, generated data or the repo rules.
- Compatibility: anything public removed, renamed or re-defaulted without a working old path.
- Separation of concerns in Vue files: heavy template expressions, inline styles, raw CSS values where a token exists.
- Evidence: tests that can pass while the behaviour is broken.
- Does it already exist: run the search in `reviewer-lens.md` section 5 for each new function, constant map, component, directive or style block.

Then apply `reviewer-lens.md` and each specialist file you were given.

## Finding format

One line per claim:

`ID | severity | confidence | file:line | what is wrong and who it hurts | smallest fix`

- Severity: **Major** blocks merge (correctness, compatibility, a11y failure). **Minor** is a real, bounded defect worth fixing now. **Nit** is optional polish.
- Confidence: **Confirmed** means you traced or reproduced it. **Suspected** names the check that would settle it.
- Report only what the diff does. Leave out what is only possible in theory.
- Scope calls (merge now or fix first, fixed or configurable, whether to split) are questions for a person: raise them, do not decide them.

## Output

1. Verdict: one paragraph, is the change trustworthy and what is the biggest risk.
2. Findings, Major first. Skip empty groups.
3. Coverage: files and specialist sections used, and what was not reviewed deeply.
