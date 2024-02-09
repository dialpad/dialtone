# Contributing

Thanks for your interest in contributing to Dialtone! Please take a moment to review this document before submitting a pull request.

## Overview

### What is Dialtone?

Dialtone is a design system by Dialpad comprised of CSS components, [Vue components](https://dialtone.dialpad.com/vue), utility classes, visual assets, documentation and examples which strives to:

- Create a consistent design language between all Dialpad products.
- Create a suite of well-documented, flexible and intuitive UI components that are easy for designers, developers and users to use.
- Document and promote accessible development and design across Dialpad.

### What is a contribution?

A contribution is any proposal, design, code, or documentation completed by someone not on the core Dialtone team, and released through Dialtone for other people to use. It can be created by anyone who'd like to help make Dialtone better.

Types of contributions:

- **Fix:** fixes a technical defect, documentation typo, or Figma symbol defect.
- **Enhancement:** extends an existing style or component without changing the underlying architecture or behavior.
- **New feature:** adds something new, like a component.

### What belongs in Dialtone?

There are a couple important considerations when thinking about contributing to Dialtone. The first is to remember that Dialtone strives to offer styles, components, or patterns intended to be shared by multiple teams or features. Generally, one-off or first-time elements (i.e. snowflakes) aren't a great fit, though there may be the occasional exception.

The second is to check with the Dialtone team (in the #dialtone Dialpad channel) to ensure the contribution isn't already requested, planned, or even complete. You may also see our [Jira backlog](https://dialpad.atlassian.net/jira/software/c/projects/DLT/boards/548/backlog) for upcoming work, and our [Jira timeline](https://dialpad.atlassian.net/jira/software/c/projects/DLT/boards/548/timeline) for our long term quarterly roadmap.

### Roles

- **Contributor:** Has the ability to create PRs and merge their change into `staging` after at least one approving review.
- **Maintainer:** A trusted contributor with the ability to release Dialtone.
- **Admin:** Has the ability to change any configuration on the Dialtone repository and release Dialtone. Usually for members of the Dialtone team.

## How to contribute

### Feature request

To request a new Dialtone feature or enhancement, submit a [feature request](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10975&pid=12508) to our Jira.

### Bug report

If you would like to report a bug, please post it in the #dialtone Dialpad channel. We will assist you in determining whether it is a Dialtone bug. Please give us a working example of the bug on a private beta or deploy preview link. A branch we can checkout is also helpful. If we have determined that this is a bug in Dialtone, then you may create a [bug report](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508) on Jira for the bug. We will get to fixing the bug in the future, or you can fix the bug yourself by [Making a Pull Request](#making-a-pull-request)

### Making a pull request

Before submitting a pull request, make sure to communicate what you wish to change to the Dialtone team. The easiest way to do this is via the #dialtone Dialpad channel. It's possible your change is already being worked on, has already been fixed, or maybe we just need to discuss the best solution to the problem. This prevents you from having to re-write your entire change, or even having to scrap it entirely.

After you have discussed your change with the Dialtone team, follow these steps to submit it:

1. See [README.md](../README.md) for instructions on how to initially clone and run the project.
2. First make sure you are on the `staging` branch with `git checkout staging`, and that it is up to date with `git pull`.
3. Create a personal branch to make your change off of `staging` with `git checkout -b my-change-branch`. We use kebab-case for branch names.
4. Make and commit your changes. Note our commit message conventions in [COMMIT_CONVENTION.md]. If you have only a single commit on your branch, then your git commit message must follow the conventions. If you have multiple commits on your branch, then the github PR title must follow the commit message conventions. Your change will be automatically linted on commit.
5. Push your branch to remote. `git push -u origin my-change-branch`.
6. Create a pull request into the `staging` branch, reviewers will be automatically added and notified of your PR.
7. Once your changes have been approved, you may squash merge your branch into `staging`.

Once your change is in `staging` it will go live with the next Dialtone release. Releases are done on demand by the Dialtone team, and are done fairly regularly. If you need your change to be released promptly, please ask in the #dialtone Dialpad channel.

## Coding guidelines

### Naming conventions

All Dialtone CSS classes available to users are prefixed with `d-`.

```less
.d-input {}
.d-stack8 {}
```

### Tokens

Tokens are the values that make up the design system. Colors, sizing, spacing and typography are valid tokens, and are output as variables in the Dialtone CSS. Tokens are defined in the dialtone-tokens package and are always prefixed with dt. Example: `var(--dt-color-black-100)`. See [Dialtone Tokens](../packages/dialtone-tokens/README.md) for more information.

#### Utility classes

Utility classes are named in the following format `d-[PROPERTY_ACRONYM]-[VALUE]`.

```less
.d-ai-center {} // align-items: center
.d-c-pointer {} // cursor: pointer
```

#### Component classes

Component class names use the [Block Element Modifier (BEM)](http://getbem.com/naming/) naming standard.

```less
.d-banner {} // Block
.d-banner__dialog {} // Element
.d-banner--success {} // Modifier
```

### Immutable utility classes

All of our utility classes are set to `!important`. This is because they are designed to be immutable, and `!important` is the best way we have of achieving immutability in CSS. Utility classes should only be applied at the application level and not within dialtone vue components.

### CSS vars

We use CSS vars, also known as [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) in our component classes for better reusability. We should use tokens to apply values to properties within our CSS classes unless a relevant token does not exist. For example, we should use `var(--dt-color-black-100)` instead of `#000000` or `var(--dt-space-400)` instead of `0.8rem`.

Here we set the `--avatar--size` CSS var to the `--dt-size-450` token, and set both the width and the height to reference this variable.

```less
.d-avatar {
    --avatar--size: var(--dt-size-450);
    width: var(--avatar--size);
    height: var(--avatar--size);
}
```

Now in variation `d-avatar--sm`, we just set `--avatar--size`. Width and height will be set for you.

```less
.d-avatar--sm {
  --avatar--size: var(--dt-size-400);
}
```

### Linting

Our code is linted by:

- [stylelint](https://stylelint.io).
- [lesshint](https://github.com/lesshint/lesshint).
- [eslint](https://eslint.org).
- [markdownlint](https://github.com/DavidAnson/markdownlint).

Configuration can be found in:

- [stylelint.config.cjs](../stylelint.config.cjs), [.stylelintignore](../.stylelintignore)
- [.lesshintrc.cjs](../.lesshintrc.cjs)
- [.eslintrc.cjs](../.eslintrc.cjs), [.eslintignore](../.eslintignore)
- [.markdownlintrc](apps/dialtone-documentation/.markdownlintrc), [.markdownlintignore](apps/dialtone-documentation/.markdownlintignore)

Your code will be linted automatically on commit.

- **Lint manually:** `nx lint dialtone`
- **With autofix:** `nx lint:fix dialtone`

Note that we use lesshint only for the utilities folder and stylelint for everything else. Due to some unsupported syntax limitations we cannot use stylelint on our utilities folder.

### Folder structure

Here are some important directories to know within the Dialtone repository

- `lib/build`: All source code and assets for the Dialtone library.
- `lib/dist`: The compiled bundle will be output here upon `nx build dialtone-css`.
- `lib/build/fonts`: Fonts we wish to bundle with Dialtone (woff2 format).
- `lib/build/less`: LESS files defining our styles. they are processed and transpiled to CSS on build.
- `lib/build/svg`: Contains only spot illustrations. Icons are stored in the dialtone-icons package. See [adding icons and illustrations](https://dialtone.dialpad.com/about/contributing.html#adding-icons-and-illustrations) for instructions on how to add icons into Dialtone.

For folder structure of the doc site, see the [VuePress section](#vuepress) of this document.

### Testing

Any changes you make to Dialtone CSS that is used in Dialtone Vue components will be tested in our percy visual tests when you create a pull request. Other than that please manually test your changes on the Dialtone documentation site as well.

### A11y standards

Dialtone adopts the [WCAG 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/glance/) Web Content Accessibility Guidelines.

## Commit Message Convention

Dialtone uses [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) to have commit messages that can be used as part of the [semantic release process](RELEASING.md). For more information, see [COMMIT_CONVENTION.md].

### Git Hooks

To enforce your commit message on the release branches (`production`, `staging`, `alpha` and `beta`) are correct according to the Conventional Commits specification, there is a `commit-msg` git hook that will be invoked by `git commit`.
`pre-commit` git hook will lint your code.

## Versioning

Dialtone follows [SemVer](https://semver.org/) for versioning and the commit message convention used in the project is aligned with SemVer by describing the features, fixes, and breaking changes made in commit messages.

## How we manage work

We use Jira to manage our work and you can visit the [Dialtone board and backlog](https://dialpad.atlassian.net/jira/software/c/projects/DLT/boards/548/backlog) assuming you are an authenticated Dialpad employee. Below we will define how we use our Jira board so team members and external contriubutors are all on the same page.

### Issue Types

#### Dev Story

A "Dev Story" is a small portion of work estimated and completed by the development team.

#### Design Story

A "Design Story" is a small portion of work estimated and completed by the design team.

#### Proposal

Proposals can be submitted by anyone with access to the jira board. Each proposal will be discussed in a grooming meeting with the Design System team and if accepted will be turned into a story (or multiple).

#### Epic

Epics are a collection of multiple stories, and always have a start and end length of one quarter. They should map to our quarterly OKRs. If a single feature will take multiple quarters to complete it should be split up into separate quarterly epics. If a story does not belong in any epic it can be put into the "Future work" epic, which holds all "uncategorized" stories.

#### Bug

A Bug is an unintentional defect in code that we have written that does not need any intended functionality to change in order to fix it. Bugs are not assigned a story point estimate.

#### Spike

The spike type refers to a "technical spike" in which we are not actually writing any code but instead performing research to find the best solution to our problem. Upon completion of a spike a resulting story will be created and groomed. Spikes are not assigned a story point estimate.

#### Subtasks

Subtasks are only created within a sprint after it has started and are individual technical tasks that need to be completed for the story to be finished. It may not make sense to split simpler stories into subtasks, for example if there would only be 1 task. By creating subtasks it prevents certain work from being forgotten and potentially allows multiple developers to work on different parts of the same story. It is possible for multiple developers to be working on the same story but it should only be possible for one developer to work on an individual subtask.

### Estimation

We estimate on an 8 point fibonacci scale of complexity during our grooming sessions. We only estimate work that gives explicit business value, so that means that only "Dev Stories" and "Design Stories" are estimated. Every sprint we should only be allocating story points for about 70% of developer work time. The other 30% is allocated to everything else a developer has to do: participate in meetings, fix bugs, support users, research technical spikes, review etc...

### Prioritization

Each Jira ticket has a priority which can be defined as the following:

- **urgent**: we immediately pull it into the current sprint and begin working on it.
- **high**: is quite important but not so important it is immediately pulled into the sprint.
- **medium**: of moderate importance, the default priority level, the majority of our stories will probably be this.
- **low**: not a priority, it is unlikely we will pull these into a sprint unless they are very low effort, or become a higher priority at a later time.

Just because an item is high priority does not necessarily mean it will be pulled into the sprint before a medium item. The priority is how much business value this particular task will provide, however the rank (sort order) of the backlog is the order in which items will be pulled into the sprint. The rank is determined manually by the product owner (@braddialpad / @francisrupert in this case) and can be based on factors other than just priority, effort for example.

#### Order / Rank

In the backlog we always try to keep our jira items sorted in this order from top to bottom:

- Bugs
- Spikes
- Stories / Proposals

Within each of these categories, items marked 'backlog' should always be above items marked 'needs definition'. The top items of 'needs defintion' are next to be groomed, and the top items of 'backlog' are next to be pulled into the sprint. Once a story is assigned to someone it can be moved to 'todo' status.

Proposals are mixed in and ranked with stories as they will eventually be turned into stories.

### Component Categories

"Components" are a feature of Jira that allows you to categorize your tickets in any way you wish. We use these to categorize our tickets in the long term. Unlike epics, components never have a start or end date. Multiple components can be applied to a single ticket. Try to use just one if you can, but if necessary multiple can be used.

- `[Component]`: this story changes all components or multiple components.
- `[Dropdown(or any component name)]`: this story includes change to only the dropdown component. Exclude Dt prefix and use [title case](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case) format.
- `[Utility]`: this story includes changes to a single or multiple utility classes.
- `[Docs]`: this story only changes the documentation site or the storybook, it does not affect anything in our published library.
- `[Figma]`: this is work specific to figma
- `[Style]`: a css/less change that does not change a specific component or utility class.
- `[Tokens]`: a change specific to Dialtone tokens.
- `[Icons]`: a change specific to the Dialtone icons repo.
- `[Storybook]`: a problem specific to the dialtone vue storybook documentation.
- `[Architecture]`: a change to technical architecture such as GHA, gulp, webpack, npm, docsite config etc.

### What about outside contributions?

If you are developer contributing to Dialtone but are not on the Dialtone team your work will be added to the Dialtone board as normal and groomed with the Dialtone team. The main difference is that we will not be including your story in a Dialtone team sprint. The Dialtone ticket can be pulled into your own team's sprint, or just updated within our backlog if you prefer.

## Tooling

### VuePress

[VuePress](https://v2.vuepress.vuejs.org/) Vue-powered static site generator, is used as a static site generator for our documentation site.
VuePress's root folder is within the folder `docs` in the Dialtone repository.
Here are some short descriptions of the folders within `docs` and what they are responsible for:

- `docs/.vuepress`: This is where all VuePress-specific files are placed.
  - `baseComponents`: These are components that might be reused across the documentation site.
  - `exampleComponents`: These are example components to be used in the `docs/components` section.
  - `public`: Contains public assets like images.
  - `styles`: Contains VuePress specific styling files.
    - `palette.scss`: This file should be used to override VuePress specific values like breakpoints and to unset undesired margins, paddings, etc... It has higher priority than any other styling file.
  - `theme`: Contains customized dialtone vuepress theme configurations, layouts and components.
    - `components`:  Contains Theme specific components like Navbar, Sidebar, etc.
    - `layouts`: Contains Theme specific [Layouts](https://vuepress.github.io/reference/theme-api.html#layouts).
  - `views`: Contains complex views that couldn't be created with Markdown only.
  - `client.js`: Contains VuePress [client configuration](https://vuepress.github.io/advanced/cookbook/usage-of-client-config.html).
  - `config.ts`: Contains VuePress [global configuration](https://vuepress.github.io/reference/config.html).
- `docs/_data`: Contains json files with data to populate tables, examples and the sidebar items.
- `doc/about`: Contains templates for the "About" section of the website. (About dialtone, Contributing).
- `docs/assets`: Contains doc site specific LESS/CSS and Fonts **Note:** the css and fonts folders within `docs/assets` are output by the Dialtone build and any manual changes will be overwritten.
  - `less/overrides.less`: This file should be used to override styling on documentation site, if you need to unset specific value, please add it to `docs/.vuepress/styles/palette.scss`.
  - `less/hljs-dialpad.less`: Contains code blocks styling rules.
- `docs/components`: Contains templates for the "Components" section of the website. (Form inputs, Avatar, Banner etc).
- `docs/design`: Contains templates for the "Design" section of the website. (Colors, Icons, etc).
- `docs/getting-started`: Contains templates for the "Getting started" section of the website. (Installation, Usage).
- `docs/utilities`: Contains templates for the "Utilities" section of the website. (Utility classes).

We use markdown frontmatter to add metadata to the pages, and we have several functions to extract such data and manipulate it.
Here's an overview of important properties and the values they need/can have:

- title `(required)`: Used as the page title, and also as the component name for [Components overview page].
- shortTitle `(optional)`: This property is used to fix linking issues on [Components overview page] when the title is different from the component name.
- description `(optional)`: Used as the page subtitle and in the page metadata.
- status `(optional)`: CSS Component status, used to display a badge on [Components overview page] and
also to define the component status on [Components status page],
  - Status options available: `['wip', 'planned', 'new', 'ready', null]`
  if status is not defined, the component will have a "N/A" CSS status on [Components status page].
- thumb `(optional)`: Boolean to define if the component in [Components overview page] will have a thumbnail
  - ***Note:*** The thumbnail must exist on `/docs/.vuepress/public/assets/images/components` and the name should be the `component title` in kebab-case in `png` format. e.g. `Button Group` component -> button-group.png
- storybook `(optional)`: It can be a storybook URL or a status.
  - Status options available: `['wip', 'planned', null]`
  if storybook is not defined, the component will have a "N/A" Vue status on [Components status page].
- figma `(optional)`: It can be a figma URL or a status.
  - Status options available: `['wip', 'planned', null]`
  if figma is not defined, the component will have a "N/A" Figma status on [Components status page].
- no_preview `(optional)`: If defined, the page will have no preview section at the top.

### Gulp

[Gulp](https://gulpjs.com/) is the task runner we use to build Dialtone. It's configuration can be found in `.gulpfile.js`. The following tasks are handled within the gulp build

- Compilation, minification and output of LESS to CSS.
- Processing svg files for themability, and outputting them as vue files.
- Bundling and output of fonts.
- Caching for faster local build performance.

### GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is what we use for our CI/CD solution. All GHA workflows are in the `.github/workflows` directory. Currently, we use GitHub Actions for the following:

- Deploying to `production` `.github/workflows/deploy.yml`, See [RELEASING](RELEASING.md) for instructions on how to do this.
- Linting our LESS files on pull request `.github/workflows/lint-pr.yml`.
- Validating commit messages `.github/workflows/lint-commit-message.yml`, see [COMMIT_CONVENTION.md] for our commit message conventions.

[Components overview page]: https://dialtone.dialpad.com/components/
[Components status page]: https://dialtone.dialpad.com/components/status/
[COMMIT_CONVENTION.md]: /.github/COMMIT_CONVENTION.md
