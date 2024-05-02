# Contributing

Thanks for your interest in contributing to Dialtone Icons! Please take a moment to review this document before submitting a pull request.

## Overview

### What is Dialtone Icons?

Dialtone Icons is an icon repository which serves to store, pre-process and ship icons
to use either on [Dialtone-vue icon]
or standalone as SVG files.

[Check the Icon catalog.](https://dialtone.dialpad.com/design/icons/)

## Adding an icon

- In the [Icons Figma file] select and export each icon as SVG.
- Place the exported SVG file(s) in the appropriate folder category inside `./src/svg/`
- Add the name and keywords in the `keywords-icons.json` file. Add the keywords array as the value. e.g:

```js
{
   "arrows": {
     "arrow-left": ["arrow", "left", "direction"],
   //   ...
   }
   // ...
}
```

- Run `nx build dialtone-icons`
- Add, commit and push your changes.
- Open a pull request.
- Once approved it can be merged into staging and will go out in the next release.

[Learn more on How to craft an icon.](https://dialtone.dialpad.com/design/icons/#crafting-an-icon)

## Icon build process

Because our SVG's come from Figma, it's possible to have duplicated identifiers if we exported the icons as is.
So we're converting our icons into Vue components and using a common function called `getUniqueString()` from [dialtone common utils](../../../common/utils.js)
to prefix the identifiers of every icon with `dt-icon`, that way even if we have multiple instances of the same icon, they'll have different identifiers.

Generated Vue icons are output to the `src/icons/` folder when you do `nx build dialtone-icons`

## Coding guidelines

### Important Folders and Files

- `src/svg`: All the source SVG icon files.
- `keywords-icons.json`: Contains the categories on which icons are going to be included and the keywords to make the icons more discoverable while searching on [Dialtone icons documentation](https://dialpad.design/components/icon.html).
- `icons.json`: This file is auto generated and used to list all the icons in Storybook.

## Commit Message Convention

Dialtone icons uses [Conventional Commits specification] to have commit messages that can be used as part of the releasing. For more information, see [COMMIT_CONVENTION.md].

### Git Hooks

To enforce your commit message on the release branches (`production`, `staging`, `alpha` and `beta`) are correct according to the Conventional Commits specification, there is a `commit-msg` git hook that will be invoked by `git commit`.
`pre-commit` git hook will lint your code.

## Versioning

Dialtone icons follows [SemVer] for versioning and the commit message convention used in the project is aligned with SemVer by describing the features, fixes, and breaking changes made in commit messages.

## Tooling

### GitHub Actions

[GitHub Actions] is what we use for our CI/CD solution.
All GHA workflows are in the `.github/workflows` directory. Currently, we use GitHub Actions for the following:

- Deploying to `production` `.github/workflows/deploy.yml`, See [RELEASING.md] for instructions on how to do this.
- Linting our LESS files on pull request `.github/workflows/lint-pr.yml`.
- Validating commit messages and Pull Request tile `.github/workflows/lint-pr.yml`, see [COMMIT_CONVENTION.md] for our commit message conventions.

[RELEASING.md]: RELEASING.md
[COMMIT_CONVENTION.md]: /.github/COMMIT_CONVENTION.md
[GitHub Actions]: https://docs.github.com/en/actions
[SemVer]: https://semver.org/
[Conventional Commits specification]: https://www.conventionalcommits.org/en/v1.0.0/
[Dialtone-vue icon]: https://vue.dialpad.design/?path=/story/components-icon--default
[Icons Figma file]: https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT9-Icon-Library?type=design&node-id=10023-2864&mode=design&t=MvRnRubYryeiG1az-0
