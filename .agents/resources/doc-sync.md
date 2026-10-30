# Dialtone documentation review

Use this shared workflow from Codex doc-sync-check, Claude doc-sync-enforcer and PR readiness. Default mode is report-only. The advisory report identifies candidates; it does not verify prose or require a documentation edit.

## Mapping and comparison

[source-docs-map.json](source-docs-map.json) is the maintained source-to-reference authority. It uses exact repository paths and directory prefixes (ending in `/`), stable IDs, selected target sections and reasons. Recognized families follow the package-map areas plus explicit root/tooling paths. Recognized paths without a mapping are reported for disposition; unrelated paths stay quiet. Add a maintained target or explain the gap instead of forcing an unrelated prose change.

Run the [read-only command](../../scripts/check-doc-review.mjs) with one explicit boundary:

```sh
node scripts/check-doc-review.mjs --base origin/staging --head HEAD --merge-base
node scripts/check-doc-review.mjs --base <commit> --head <commit> --direct
node scripts/check-doc-review.mjs --staged
node scripts/check-doc-review.mjs --worktree
```

Use merge-base for branch/PR changes. Direct compares exactly the two endpoints, including upstream-only changes in reverse. Staged compares HEAD to the index; worktree compares the index to tracked working files. Run both when both contain changes. Only `--worktree --include-untracked` selects nonignored untracked paths; other reports list them outside the boundary. No ignored files or external symlink targets are read.

`--format json` reports supplied/resolved commits, effective base, target context, changes, candidates, missing targets and unmapped paths. The checked-out map is the declared mapping authority; target presence resolves in the chosen head tree, index or worktree. Read only targets reported as `present`, from that same context: use `git show <resolved-head>:<target>` for committed mode, `git show :<target>` for `--staged`, and the filesystem (for example `cat -- <target>`) for `--worktree`. Do not read `symlink-not-read` targets or follow their links. Recheck target state if the worktree changes before reading. Do not read from an unrelated checkout. Exit 0 means reporting completed, including review-needed findings; exit 2 means invalid/unavailable input or an operational error. Neither means documentation is correct. The command never fetches, checks out, stages, stashes or edits files.

## Review decisions

Read the selected source diff, affected reference sections and owning requirements. Record the comparison mode/resolved base/head, mapping ID, inspected source/prose locations, outcome and concrete reason in the readiness report. A public-safe summary can go in the PR description; keep private details and local scratch paths out.

- **reviewed:** explain what was updated or why existing prose is accurate.
- **not-relevant:** explain why this change does not affect that explanation.
- **review-needed:** review is absent, the target is missing or prose conflicts with source.

A touched file, date or session marker clears nothing. At each readiness pass rerun the report and compare relevant source, prose and map changes with the previous decision. Re-read affected sections before retaining the decision. Rebase equivalence must be checked and the boundary updated; commit-ID changes alone do not invalidate every decision. There is no automated decision reader or receipt database.

## Applying updates

Respect existing task authorization; ask before applying updates when that scope has not already been authorized. Ground edits in source, preserve human content/frontmatter, and update `last_updated` for changed corpus prose. Report updated, unchanged and still-questionable sections. Generated-output checks and release selection remain separate.

## Client adapters

Codex runs this workflow through doc-sync-check and pr-prep. Claude uses doc-sync-enforcer and its existing PreToolUse adapter for recognizable push/PR commands. The adapter reports local origin/staging...HEAD with merge-base, staged changes and tracked worktree changes separately. It does not infer another repository from complex shell commands; run the command explicitly with that checkout/boundary when needed. Missing refs and other errors remain visible. It supplies advisory context without a permission decision; it does not use a session cache or completion markers. The edit tracker remains for other consumers.

When references are renamed, deleted or superseded, update their mappings and the contributor topic routes deliberately. Missing or symlink targets remain review-needed. This workflow does not mandate a blocking hook, CI policy, periodic audit, packaged retrieval or changes to every reference.
