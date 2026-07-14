---
name: merge-next
description: Use when merging or synchronizing Dialtone staging into next, including direct next branch maintenance that must preserve merge history.
---

# Merge Staging Into Next

## Goal

Merge current `origin/staging` into current `next` with a CLI merge commit, preserve both branches' history, regenerate merge-sensitive artifacts before approval, and validate before any optional push.

**Retirement condition:** When `next` has been merged back into `staging` and the weekly staging-to-next synchronization stops, delete this skill, its `.claude/skills/merge-next/` peer, and this skill's routing, parity, and eval entries.

## Trigger

- `$merge-next`
- "merge staging into next"
- "sync next with staging"
- Direct maintenance of the long-lived `next` branch.

## Required Context

- `git status --short --branch`
- Current `origin/next` and `origin/staging` refs.
- The list of files that conflict during the merge.
- `.agents/resources/package-map.md`
- `.agents/resources/agent-tooling-parity.md`

## Constraints

- Stop before changing branches when the worktree contains tracked or untracked changes. Do not stash, discard, stage, or rewrite user work.
- Do not create a PR or squash this merge. The historical relationship between `staging` and `next` must be preserved.
- Use CLI merge commands and keep the repository in a merge state through conflict resolution, migration, and thumbnail regeneration.
- Resolve only merge-introduced problems. Report pre-existing failures separately.
- Do not create, update, assign, or transition Jira issues.
- User approval is required before creating the merge commit.
- Do not push automatically. Push only after validation and explicit user approval.

## Workflow

1. Confirm the worktree is clean. Stop if `git status --short --branch` lists any changed or untracked files after the branch line.
2. Update both remote refs and fast-forward local `next`:

   ```bash
   git fetch origin next staging
   git checkout next
   git pull --ff-only origin next
   ```

3. Start the CLI merge without committing, then immediately record the original conflict list:

   ```bash
   git merge --no-commit --no-ff origin/staging
   git diff --name-only --diff-filter=U > /tmp/dialtone-merge-next-conflicts.txt
   ```

4. Resolve changelogs first with `python3 scripts/resolve-changelog-conflicts.py`, then resolve remaining files by retaining compatible changes from both branches. Prefer released package versions from `staging`, regenerate `pnpm-lock.yaml` after taking the `staging` side, and retain `next` documentation and logical-property conventions where they differ.
5. Stage resolved merge files and verify that `git diff --name-only --diff-filter=U` is empty and no conflict markers remain.
6. While the repository is still in the merge state, preview and apply the color-stop migration:

   ```bash
   node scripts/merge-migrate-color-stops.mjs --merge-from origin/staging --dry-run --verbose
   echo "y" | node scripts/merge-migrate-color-stops.mjs --merge-from origin/staging --verbose
   ```

7. Resolve any overlap files reported by the migration, then stage its tracked changes with `git add -u`.
8. Run one forced, dependency-aware thumbnail regeneration, then stage only the generated PNGs:

   ```bash
   pnpm nx run dialtone-documentation:thumbs -- --force
   git add apps/dialtone-documentation/docs/.vuepress/public/assets/images/components
   git diff --cached --stat -- \
     apps/dialtone-documentation/docs/.vuepress/public/assets/images/components
   ```

9. Present the conflict-resolution summary, the staged diff for originally conflicted files, and the thumbnail generation result and artifact count. Wait for user confirmation before committing. Do not continue until approval is explicit.
10. Create the default merge commit:

    ```bash
    git commit --no-edit
    ```

11. Fix only merge-introduced lint problems in a separate, convention-compliant commit after receiving approval for those changes.
12. Run production, Storybook, documentation, test, and lint validation:

    ```bash
    pnpm nx run dialtone:build
    pnpm nx run dialtone-vue:build-storybook
    pnpm nx run dialtone-documentation:build
    pnpm nx run dialtone:test:all
    pnpm nx run dialtone:lint:all
    ```

13. Report pass, fail, and pre-existing results. Ask for explicit permission before running:

    ```bash
    git push origin next
    ```

## Done When

- The merge commit preserves `staging` and `next` history.
- All original conflicts and their resolutions are reported.
- The migration and forced dependency-aware thumbnail target run before user approval and commit.
- Full validation results distinguish merge-introduced from pre-existing failures.
- The branch is pushed only if the user explicitly approved it; otherwise it remains local.

## Verification

- `git diff --name-only --diff-filter=U` returns no files before commit.
- `pnpm nx run dialtone-documentation:thumbs -- --force` exits successfully before commit.
- `git show --cc HEAD` reflects the approved conflict resolutions after commit.
- Build, Storybook, docs, test, and lint command exits are recorded.
- `git status --short --branch` is reported before any push request.

## References

- `.agents/resources/package-map.md`
- `.agents/resources/agent-tooling-parity.md`
- `apps/dialtone-documentation/thumbs/README.md`
- `.github/COMMIT_CONVENTION.md`
