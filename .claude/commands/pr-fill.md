# /pr-fill - Generate and Update Dialtone PR Description

## Usage

```text
/pr-fill [PR_NUMBER or PR_URL] [DESCRIPTION]
```

## Description

Generates a filled PR description based on the Dialtone PR template (.github/pull_request_template.md) and uses `gh` CLI to update the PR. If no PR number is provided, assumes the current branch has an open PR. If no description is provided, analyzes git diff and commit messages to auto-populate sections.

Sections that cannot be completed are left as placeholders for manual completion. Irrelevant sections should be removed (e.g. CSS checklist when there are no CSS changes).

## Implementation

When this command is used, Claude should:

1. **Extract PR information:**
   - If PR URL provided: Extract PR number from URL
   - If PR number provided: Use it directly
   - If no argument provided: Find PR for current branch using `gh pr view --json number`

2. **Fetch PR details (if updating existing PR):**
   - Get PR diff: `gh pr diff <PR_NUMBER>`
   - Get PR commits: `gh pr view <PR_NUMBER> --json commits`
   - Get changed files and their contents

3. **Analyze the changes:**
   - Get commit messages
   - Get list of changed files
   - Get git diff summary

4. **Auto-detect change type from:**
   - Commit message prefixes (feat:, fix:, docs:, etc.)
   - File patterns (Vue components, CSS, documentation)
   - New vs modified files

5. **Resolve Jira ticket:**
   - Check the oldest commit message on the branch for `DLT-\d+` pattern
   - Check the branch name for patterns like `feat/DLT-123-description`
   - Check recent commits for `DLT-\d+` pattern
   - If no ticket found, create one via `mcp__atlassian__createJiraIssue`:
     1. Get cloud ID from `mcp__atlassian__getAccessibleAtlassianResources`
     2. Create issue with `projectKey: "DLT"`, `issueTypeName: "Task"`, and a summary derived from the PR changes
   - If Jira MCP unavailable, use `NO-JIRA`
   - Format as: `[DLT-XXX](https://dialpad.atlassian.net/browse/DLT-XXX)`

6. **Validate and set PR title:**
   - Must follow commitlint format (see CLAUDE.md Commit Convention)
   - If the current PR title does not match, derive the correct title from the oldest commit message or the changes
   - Update with `gh pr edit <PR_NUMBER> --title "<VALIDATED_TITLE>"`

7. **Generate template with smart defaults:**
   - Auto-check appropriate change type boxes
   - Include relevant checklist sections based on file changes
   - Pre-populate sections where possible
   - In the description section, describe the changes in a summarized way, no need to list every file changed

8. **Detect cross-package impact:**
   When changes span multiple packages, add a "Cross-Package Impact" section noting affected packages and downstream effects per the dependency graph (`tokens --> CSS --> Vue --> docs / MCP / language-server`).

9. **Suggest doc-janitor cleanup:**
   Before generating the PR body, check for stale work artifacts (PLAN-*.md, SESSION_*.md, *.backup, etc.) in the working tree. If any are found, suggest running `/doc-janitor` to clean them up before opening the PR. Do not block — just inform the user and continue.

10. **Flag documentation artifacts:**
    Check all 6 documentation artifacts are updated (see CLAUDE.md Documentation Pipeline). Add a "Documentation Artifacts" section listing which are relevant to the changes. Mark artifacts already updated with a checkmark and those needing attention with a flag.

11. **Strip Co-Authored-By lines:**
    Before writing the final PR body, remove any `Co-Authored-By:` lines from the generated content. These must never appear in PR descriptions.

12. **Update the PR:**
    - Use `gh pr edit <PR_NUMBER> --body "<DESCRIPTION>"` to update
    - Confirm update: `gh pr view <PR_NUMBER> --json title,body,url`
    - Display success message with PR URL

## File Pattern Detection

- `*.vue` or `packages/dialtone-vue*` --> Include Vue checklist
- `*.css`, `*.less`, or `packages/dialtone-css` --> Include CSS checklist
- New component files --> Include new component checklist
- Documentation files --> Focus on documentation sections

## Template Sections to Auto-Fill

- PR Title (commitlint format, from oldest commit), Type of Change, Jira Ticket (linked URL)
- Description (summarized changes), Cross-Package Impact (if multi-package)
- Documentation Artifacts (flagging what needs updates), Relevant checklists (based on file changes)

## Example Output Structure

```markdown
# feat(tooltip): DLT-123 add new tooltip component

## Obligatory GIF (super important!)
![Obligatory GIF](path/to/gif)

## :hammer_and_wrench: Type Of Change
- [x] Feature

## :book: Jira Ticket
[DLT-123](https://dialpad.atlassian.net/browse/DLT-123)

## :book: Description
Add a new tooltip component to Dialtone with configurable placement,
arrow positioning, and accessible keyboard interactions.

## :package: Cross-Package Impact

Changes span the following packages:

| Package | Changes | Downstream Impact |
|---|---|---|
| dialtone-css | New tooltip styles | Vue tooltip component depends on these styles |
| dialtone-vue | New tooltip component | Documentation site and MCP server need updates |

Dependency flow: tokens --> **CSS** --> **Vue** --> docs/MCP/language-server

## :page_facing_up: Documentation Artifacts

| Artifact | Status | Notes |
|---|---|---|
| Vue source | Updated | New component added |
| Tests | Updated | Unit tests included |
| Storybook stories | Updated | Stories for all variants |
| Component docs JSON | Updated | Props and events documented |
| VuePress docs | Needs attention | Component page not yet created |
| MCP server data | Needs attention | New component not yet registered |

## :bulb: Context

<!--- Why did we make these changes? What problem(s) do they solve? -->

## :pencil: Checklist

For all PRs:

- [x] I have ensured no private Dialpad links or info are in the code or pull request description (Dialtone is a public repo!).
- [x] I have reviewed my changes.
- [x] I have added all relevant documentation.
- [x] I have considered the performance impact of my change.

For all Vue changes:

- [x] I have added / updated unit tests.
- [ ] I have validated components with a screen reader.
- [ ] I have validated components keyboard navigation.

For all CSS changes:

- [x] I have used design tokens whenever possible.
- [ ] I have considered how this change will behave on different screen sizes.
- [ ] I have visually validated my change in light and dark mode.
- [ ] I have used gap or flexbox properties for layout instead of margin whenever possible.

If new component:

- I am exporting any new components or constants:
  - [x] from the index.js in the component directory.
  - [x] from the index.js in the root (`packages/dialtone-vue`).
- [x] I have added the styles for the new component to the `packages/dialtone-css` package.
- [x] I have created a page for the new component on the documentation site in `apps/dialtone-documentation`.
- [x] I have added the new component to `common/components_list.js`
- [x] I have created a component story in storybook
- [x] I have created story / stories for any relevant component variants in storybook
- [x] I have created a docs page for the component in storybook.
- [x] I have checked that changing all props/slots via the UI in storybook works as expected.

## :crystal_ball: Next Steps

<!--- Future changes needed after merging, especially follow-up tasks after release. -->

## :camera: Screenshots / GIFs

<!--- Add if necessary (deploy previews may suffice) -->

## :link: Sources

<!--- Add links to external reference material -->
```
