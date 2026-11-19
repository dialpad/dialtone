# Local gates

How prep reads check results. Check selection, commands and which checks write files are in `.agents/resources/validation.md`; do not copy them here.

Run the rows for the touched packages only (`SKILL.md` step 2) and never the full monorepo suite. CI runs most tests and almost no lint, so lint every touched package. Run from the repo root, on the final head, after fixes.

## Choosing what to run

- Report-only: run only rows marked `no` or `output`. Mark any other row "not run" with the marker as the reason (for example "not run: may rewrite icon keywords"). Where a row has a read-only form and a CI form, use the read-only form; if its prerequisite build output is missing, or older than the changed sources it is built from, that is "not run" too.
- Every run: compare `git status --porcelain` before and after; if it changed, report what changed and record `tree=dirty`.
- Author: any row may run. A tracked file that changed is a finding to keep or fix, not something to leave behind unnoticed.
- Author, before any row marked `themes`: list untracked and ignored files under `packages/dialtone-tokens/themes/` with `git ls-files -o -- packages/dialtone-tokens/themes/`, and copy them outside the repo or commit them first. That build runs `git clean -fx themes/`, and the status comparison only reports the loss after the files are gone.
- A package with no lint or test row is "no gate".
- The CSS lint gate is the Stylelint command with fixing off. `nx run dialtone-css:lint` can pass with fixable violations still on disk.

## Reading results

- A lint finding in a file the diff does not touch is a note, not a failed gate.
- A test that fails in a file the diff does not touch and fails the same way at `$BASE` is pre-existing: name it as a note.
- When `dialtone-tokens` or `dialtone-css` changes a public token or class, also run the `dialtone-vue` test as a downstream check.
- A package not in the map: read its `package.json` scripts and run its `lint` and `test` if present. Skip any script that writes (`--fix`) and run the underlying checker without it.
- A renamed script test lists the old path too; skip paths that no longer exist.
- If the dependency install is missing or fails, say so and mark the gates "not run". Do not work around a failed install.
- Builds, `build-storybook` and visual tests are CI's job, except the builds the map names. Run any other build only when a changed public export or token needs it to prove a downstream package still compiles, and say why.
- Root `package.json`, `pnpm-lock.yaml`, `nx.json` or `common/` changes: run the test of each package whose dependencies changed; if none can be named, "not run: CI unit tests cover it".

## Markdown and script lint for `AGENTS.md` and `.agents/**`

Markdown is compared with its copy at `$BASE` and fails only on new findings; the rest of `.agents/` already has findings on `staging`. ESLint fails on errors only; existing warnings are notes. `FILES` is the scoped file list from `SKILL.md` step 1, one path per line.

```sh
export pnpm_config_verify_deps_before_run=false   # pnpm 11 otherwise installs first and can rewrite pnpm-lock.yaml
: "${BASE:?set BASE to the recorded base SHA}" "${FILES:?set FILES to the scoped file list}"
CHANGED=$(printf '%s\n' "$FILES" | grep -E '^(AGENTS\.md|\.agents/)' | while IFS= read -r f; do [ -f "$f" ] && printf '%s\n' "$f"; done)
JS=$(printf '%s\n' "$CHANGED" | grep -E '\.(js|mjs|cjs)$')
[ -n "$JS" ] && printf '%s\n' "$JS" | tr '\n' '\0' | xargs -0 pnpm exec eslint
{ pnpm exec prettier --version && pnpm exec markdownlint --version; } >/dev/null 2>&1 \
  || echo "not run: prettier or markdownlint unavailable"
printf '%s\n' "$CHANGED" | grep -E '\.md$' | while IFS= read -r f; do
  now=$(pnpm exec prettier --check --single-quote "$f" >/dev/null 2>&1; echo $?)
  was=$(git show "$BASE:$f" 2>/dev/null | pnpm exec prettier --check --single-quote --stdin-filepath "$f" >/dev/null 2>&1; echo $?)
  # Exit 2 is a prettier error, not a formatting difference.
  { [ "$now" = 2 ] || [ "$was" = 2 ]; } && echo "not run: prettier errored on $f"
  [ "$now" = 1 ] && [ "$was" = 0 ] && echo "new prettier failure: $f"
  # Compare findings without file names and positions, so a moved line is not new.
  norm() { sed -E 's/^[^ ]*:[0-9]+(:[0-9]+)? //' | sort; }
  pnpm exec markdownlint "$f" 2>&1 | norm >"${TMPDIR:-/tmp}/mdl-now"
  git show "$BASE:$f" 2>/dev/null | pnpm exec markdownlint --stdin 2>&1 | norm >"${TMPDIR:-/tmp}/mdl-was"
  # The file name goes to printf as data, never into a sed or awk program.
  comm -23 "${TMPDIR:-/tmp}/mdl-now" "${TMPDIR:-/tmp}/mdl-was" \
    | while IFS= read -r line; do printf 'new markdownlint finding in %s: %s\n' "$f" "$line"; done
done
```

No output from the markdown loop and no ESLint errors means pass. A "not run" line means the gate was not run.
