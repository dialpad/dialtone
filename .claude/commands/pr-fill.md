# /pr-fill - Generate and Update Dialtone PR Description

## Usage

```
/pr-fill [PR_NUMBER or PR_URL] [DESCRIPTION]
```

## Description

Generates a filled PR description based on the Dialtone PR template (.github/pull_request_template.md) and uses the `gh` CLI to update the actual PR. If no PR number is provided, it assumes the current branch has an open PR. If no description is provided, it analyzes git diff and commit messages to auto-populate relevant sections.

Sections that cannot be completed are left as placeholders for manual completion (e.g. "Screenshots / GIFs" and "Sources"). Sections that are not relevant to the change should be removed, for example if there were no CSS changes, the CSS checklist should be removed.

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

5. **Generate template with smart defaults:**
   - Use oldest commit message as PR title (preserve existing if present)
   - Auto-check appropriate change type boxes
   - Include relevant checklist sections based on file changes
   - Pre-populate sections where possible
   - Extract Jira ticket URL from oldest commit message
   - In the description section, describe the changes in a summarized way, no need to list every file changed

6. **Update the PR:**
   - Use `gh pr edit <PR_NUMBER> --body "<DESCRIPTION>"` to update
   - Confirm update: `gh pr view <PR_NUMBER> --json title,body,url`
   - Display success message with PR URL

## File Pattern Detection

- `*.vue` or `packages/dialtone-vue*` → Include Vue checklist
- `*.css`, `*.less`, or `packages/dialtone-css` → Include CSS checklist
- New component files → Include new component checklist
- Documentation files → Focus on documentation sections

## Template Sections to Auto-Fill

- PR Title (from oldest commit message in that branch)
- Type of Change (auto-checked based on detection)
- Description (summarized changes)
- Jira ticket URL (from oldest commit message)
- Relevant checklists (based on file changes)

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
Add a new tooltip component to Dialtone.

## :bulb: Context

<!--- Describe the purpose of the changes -->
<!--- Why did we make these changes? -->
<!--- What problem(s) do they solve? -->

## :pencil: Checklist

<!--- Tick or place an `x` in all of the checkboxes that apply -->
<!--- Remove checkboxes that do not apply -->

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

<!--- There are lots of things to remember when adding a new component to the system! This is so you don't forget any of them. -->

- I am exporting any new components or constants:
  - [x] from the index.js in the component directory.
  - [x] from the index.js in the root (either `packages/dialtone-vue2` or `packages/dialtone-vue3`).
- [x] I have added the styles for the new component to the `packages/dialtone-css` package.
- [x] I have created a page for the new component on the documentation site in `apps/dialtone-documentation`.
- [x] I have added the new component to `common/components_list.js`
- [x] I have created a component story in storybook
- [x] I have created story / stories for any relevant component variants in storybook
- [x] I have created a docs page for the component in storybook.
- [x] I have checked that changing all props/slots via the UI in storybook works as expected.

## :crystal_ball: Next Steps

<!--- Describe any future changes that need to be made after merging the PR, especially any follow up tasks after release. -->

## :camera: Screenshots / GIFs

<!--- Add these if necessary. Since we have deploy previews for every PR it may not always be. -->
<!--- Link any screenshots / GIFs below -->

## :link: Sources

<!--- Add any links to external reference material -->
```
