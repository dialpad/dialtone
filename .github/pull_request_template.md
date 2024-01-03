# PR Title

<!--- Feel free to remove any unused sections -->

## Obligatory GIF (super important!)

<!--- go to giphy.com, pick a gif, click share, copy gif link, paste within the () brackets below. -->

![Obligatory GIF](path/to/gif)

## :hammer_and_wrench: Type Of Change

<!--- Tick or place an `x` for the type of change. Should match the type in the commit message / PR title
in https://github.com/dialpad/dialtone/blob/staging/.github/COMMIT_CONVENTION.md -->

These types will increment the version number on release:

- [ ] Fix
- [ ] Feature
- [ ] Performance Improvement
- [ ] Refactor

These types will not increment the version number, but will still deploy to documentation site on release:

- [ ] Documentation
- [ ] Build system
- [ ] CI
- [ ] Style (code style changes, not css changes)
- [ ] Test
- [ ] Other (chore)

## :book: Description

<!--- Describe specifically what the changes are -->

## :bulb: Context

<!--- Describe the purpose of the changes -->
<!--- Why did we make these changes? -->
<!--- What problem(s) do they solve? -->

## :pencil: Checklist

<!--- Tick or place an `x` in all of the checkboxes that apply -->
<!--- Remove checkboxes that do not apply -->

For all PRs:

- [ ] I have ensured no private Dialpad links or info are in the code or pull request description (Dialtone is a public repo!).
- [ ] I have reviewed my changes.
- [ ] I have added all relevant documentation.
- [ ] I have considered the performance impact of my change.

For all Vue changes:

- [ ] I have added / updated unit tests.
- [ ] I have made my changes in Vue 2 and Vue 3. Note: you may sync your changes from Vue 2 to Vue 3 (or vice versa) using the `./scripts/dialtone-vue-sync.sh` script.
- [ ] I have validated components with a screen reader.
- [ ] I have validated components keyboard navigation.

For all CSS changes:

- [ ] I have used design tokens whenever possible.
- [ ] I have considered how this change will behave on different screen sizes.
- [ ] I have visually validated my change in light and dark mode.
- [ ] I have used gap or flexbox properties for layout instead of margin whenever possible.

If new component:

<!--- There are lots of things to remember when adding a new component to the system! This is so you don't forget any of them. -->

- [ ] I am exporting any new components or constants from the index.js in the component directory.
- [ ] I am exporting any new components or constants from the index.js in the root (either `packages/dialtone-vue2` or `packages/dialtone-vue3`).
- [ ] I have added the styles for the new component to the `packages/dialtone-css` package.
- [ ] I have created a page for the new component on the documentation site in `apps/dialtone-documentation`.
- [ ] I have added the new component to `common/components_list.cjs` in `packages/dialtone-vue2` and `packages/dialtone-vue3`
- [ ] I have created a component story in storybook
- [ ] I have created story / stories for any relevant component variants in storybook
- [ ] I have created a docs page for the component in storybook.
- [ ] I have checked that changing all props/slots via the UI in storybook works as expected.

## :crystal_ball: Next Steps

<!--- Describe any future changes that need to be made after merging the PR, especially any follow up tasks after release. -->

## :camera: Screenshots / GIFs

<!--- Add these if necessary. Since we have deploy previews for every PR it may not always be. -->
<!--- Link any screenshots / GIFs below -->

## :link: Sources

<!--- Add any links to external reference material -->
