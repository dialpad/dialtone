---
description: "Merge staging into next branch following the Dialtone Next Merge Guide. Use when the user asks to merge staging into next, sync next with staging, or references the merge guide."
---

# /merge-next - Merge staging into next

Executes the Dialtone Next Merge Guide: pulls both branches, merges staging into next, resolves conflicts, runs the color-stops migration, regenerates component thumbnails, commits, builds, and tests.

**Important:** This must be run via `git merge` on the CLI, NOT via a GitHub PR (which would squash and destroy historical references).

**Retirement condition:** When `next` has been merged back into `staging` and the weekly staging-to-next synchronization stops, delete this skill, its `.agents/skills/merge-next/` peer, and the peer's routing, parity, and eval entries.

## Workflow

### 1. Pull and merge

Confirm the worktree is clean before changing branches. Stop rather than stashing, staging, or discarding user work if any changed or untracked files are listed.

```bash
git status --short --branch
git checkout next
git pull --ff-only origin next
git fetch origin staging:staging   # update local staging ref without merging
git merge --no-commit staging
```

Save the list of conflicted files immediately (needed for the verification step later):

```bash
git diff --name-only --diff-filter=U > /tmp/merge-conflicted-files.txt
```

If there are no conflicts, skip to step 4.

### 2. Resolve CHANGELOG conflicts

Run the changelog resolution script first:

```bash
python3 scripts/resolve-changelog-conflicts.py
```

This handles CHANGELOG.json and CHANGELOG.md for the main packages. For any remaining CHANGELOG conflicts (e.g. dialtone-icons, eslint-plugin-dialtone) that the script missed, resolve manually:

- **CHANGELOG.md**: Keep both sides' entries, staging releases first (newest date first), then next prerelease entries, then shared history.
- **CHANGELOG.json**: Merge both version arrays, staging entries first, sorted by date descending. A quick Node script can help:

```js
// Extract HEAD and staging JSON from conflict markers, merge versions arrays,
// sort by date descending, write back.
```

Stage all resolved changelogs.

### 3. Resolve remaining conflicts

Apply these resolution strategies:

| Conflict type | Strategy |
| --- | --- |
| **package.json versions** | Take staging's released version (higher semver). Next will get its own prerelease versions on next release. |
| **pnpm-lock.yaml** | Accept staging's version (`git checkout --theirs pnpm-lock.yaml`), then regenerate with `pnpm install --no-frozen-lockfile`. |
| **Code conflicts** | Analyze both sides. Keep new features from both branches. Prefer next's naming conventions (e.g. `#startIcon` over `#icon`, logical properties over physical). Combine additive changes. |
| **Documentation conflicts** | Prefer next's fenced ` ```vue demo ` blocks over staging's `<code-example>` tags or `<code-well-header>` + `<code-example-tabs>` patterns. Minimize `<!-- @code -->` separators — only use when demo and code genuinely differ. Prefer static expanded markup over `v-for` loops. See `.claude/rules/documentation-writing.md` for full directive guidance. |
| **CSS conflicts** | Prefer next's logical properties (`max-inline-size` over `max-width`). Combine additive styles from both sides. |

Stage all resolved files. Verify no conflict markers remain:

```bash
git diff --name-only --diff-filter=U          # should be empty
git diff --cached --name-only | xargs grep -l '<<<<<<<'  # should find nothing
```

### 4. Run the color-stops migration script

**DO NOT commit yet.** The script needs the repo to be in a merge state.

Preview first:

```bash
node scripts/merge-migrate-color-stops.mjs --merge-from origin/staging --dry-run --verbose
```

Then run for real (pipe `y` to auto-confirm):

```bash
echo "y" | node scripts/merge-migrate-color-stops.mjs --merge-from origin/staging --verbose
```

Review any overlap files reported by the script, resolve them manually, then stage all tracked migration changes:

```bash
git add -u
```

### 5. Regenerate component thumbnails

**DO NOT commit yet.** Run one forced, dependency-aware regeneration so the weekly merge cannot reuse thumbnails captured from stale branch assets.

```bash
pnpm nx run dialtone-documentation:thumbs -- --force
git add apps/dialtone-documentation/docs/.vuepress/public/assets/images/components
```

Show the generated artifact count and stat for review:

```bash
git diff --cached --name-only -- apps/dialtone-documentation/docs/.vuepress/public/assets/images/components | wc -l
git diff --cached --stat -- apps/dialtone-documentation/docs/.vuepress/public/assets/images/components
```

If generation fails, stop. Do not continue to review or commit with stale or partial thumbnail output.

### 6. Verify conflict resolutions and generated artifacts

**DO NOT commit yet.** Present a resolution summary to the user for review.

1. Output a structured resolution summary listing every file that had conflicts and what was done:

```text
Conflict resolution summary:
- path/to/file.json: <what was chosen and why>
- path/to/other.vue: <what was combined from each side>
```

1. Show the diff for only the files that had conflicts:

```bash
cat /tmp/merge-conflicted-files.txt | xargs git diff --cached --
```

1. Report the thumbnail command result and the number of generated artifacts.

1. **Wait for user confirmation** before proceeding to commit. Do not continue until the user approves.

### 7. Commit the merge

```bash
git commit --no-edit
```

This uses the default merge commit message and triggers pre-commit hooks. Thumbnail generation should be a cache hit because the forced pass already ran against the final staged merge state.

After committing, `git show --cc HEAD` can be used to re-inspect only the conflict resolution decisions at any time.

### 8. Fix any lint issues introduced by the merge

Check for new lint issues and fix them. Common ones:

- Extra blank lines in `.mdx` files (MD012)
- Unused imports after conflict resolution

Commit fixes separately:

```bash
git add <fixed-files>
git commit -m "fix(<scope>): NO-JIRA fix lint issues from staging merge"
```

### 9. Build, test, and lint

Run the full production build:

```bash
pnpm nx run dialtone:build
```

Run the storybook and docsite builds and verify they complete successfully:

```bash
pnpm nx run dialtone-vue:build-storybook
pnpm nx run dialtone-documentation:build
```

Run all tests:

```bash
pnpm nx run dialtone:test:all
```

Run all linters:

```bash
pnpm nx run dialtone:lint:all
```

For any failures, determine if they are **pre-existing** (also fail on staging) or **introduced by the merge**. Only fix merge-introduced issues. Report pre-existing failures to the user.

### 10. Push

Do NOT push automatically. Report the results to the user and wait for confirmation before pushing.

```bash
git push origin next
```

## Notes

- Never create a PR for this merge. Always push the merge commit directly to `next`.
- The color-stops migration script is temporary for the staging-to-next migration period.
- The merge-next skills are temporary and must be deleted when their retirement condition is met.
- Pre-commit hooks may trigger icon rebuilds or other builds during the commit step. The thumbnail pass should use its local cache and skip fresh components.
