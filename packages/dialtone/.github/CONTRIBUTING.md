# Contributing

Thanks for your interest in contributing to Dialtone! Please take a moment to review this document before submitting a pull request.

## Overview

### What is Dialtone?

Dialtone is a design system by Dialpad comprised of CSS components, [Vue components](https://vue.dialpad.design/), utility classes, visual assets, documentation and examples which strives to:

- Create a consistent design language between all Dialpad products.
- Create a suite of well-documented, flexible and intuitive UI components that are easy for designers, developers and users to use.
- Document and promote accessible development and design across Dialpad.

Though part of the design system, Dialtone's Vue components are distributed as a separate package and therefore have their own [repository](https://github.com/dialpad/dialtone-vue) and contribution guidelines.

### What is a contribution?

A contribution is any proposal, design, code, or documentation completed by someone not on the core Dialtone team, and released through Dialtone for other people to use. It can be created by anyone who'd like to help make Dialtone better.

Types of contributions:

- **Fix:** fixes a technical defect, documentation typo, or Figma symbol defect.
- **Enhancement:** extends an existing style or component without changing the underlying architecture or behavior.
- **New feature:** adds something new, like a component.

### What belongs in Dialtone?

There are a couple important considerations when thinking about contributing to Dialtone. The first is to remember that Dialtone strives to offer styles, components, or patterns intended to be shared by multiple teams or features. Generally, one-off or first-time elements (i.e. snowflakes) aren't a great fit, though there may be the occasional exception.

The second is to check with the Dialtone team (in [#dialtone](https://dialpad.slack.com/messages/dialtone/)) to ensure the contribution isn't already requested, planned, or even complete. You may also see our [Jira board](https://switchcomm.atlassian.net/jira/software/projects/DT/boards/187/backlog) for upcoming work.

### Roles

- **Contributor:** Has the ability to create PRs and merge their change into `staging` after at least one approving review.
- **Maintainer:** A trusted contributor with the ability to release Dialtone.
- **Admin:** Has the ability to change any configuration on the Dialtone repository and release Dialtone. Usually for members of the Dialtone team.

## How to contribute

### Feature request

To request a new Dialtone feature or enhancement, submit a [feature request](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10901&pid=12428) to our Jira.

### Bug report

If you would like to report a bug, please post it in [#dialtone](https://dialpad.slack.com/messages/dialtone/). We will assist you in determining whether it is a Dialtone bug. Please give us a working example of the bug on a private beta or deploy preview link. A branch we can checkout is also helpful. If we have determined that this is a bug in Dialtone, then you may create a [bug report](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10878&pid=12428) on Jira for the bug. We will get to fixing the bug in the future, or you can fix the bug yourself by [Making a Pull Request](#making-a-pull-request)

### Making a pull request

Before submitting a pull request, make sure to communicate what you wish to change to the Dialtone team. The easiest way to do this is via the [#dialtone](https://dialpad.slack.com/messages/dialtone/) Slack channel. It's possible your change is already being worked on, has already been fixed, or maybe we just need to discuss the best solution to the problem. This prevents you from having to re-write your entire change, or even having to scrap it entirely.

After you have discussed your change with the Dialtone team, follow these steps to submit it:

1. See [README.md](../README.md) for instructions on how to initially clone and run the project.
2. First make sure you are on the `staging` branch with `git checkout staging`, and that it is up to date with `git pull`.
3. Create a personal branch to make your change off of `staging` with `git checkout -b my-change-branch`. We use kebab-case for branch names.
4. Make and commit your changes. Note our [commit message conventions](COMMIT_CONVENTION.md). If you have only a single commit on your branch, then your git commit message must follow the conventions. If you have multiple commits on your branch, then the github PR title must follow the commit message conventions. Your change will be automatically linted on commit.
5. Push your branch to remote. `git push -u origin my-change-branch`.
6. Create a pull request into the `staging` branch, reviewers will be automatically added and notified of your PR.
7. Once your changes have been approved, you may squash merge your branch into `staging`.

Once your change is in `staging` it will go live with the next Dialtone release. Releases are done on demand by the Dialtone team, and are done fairly regularly. If you need your change to be released promptly, please ask in the #dialtone slack channel.

## Coding guidelines

### Naming conventions

All Dialtone classes available to users are prefixed with `d-`.

```less
.d-input {}
.d-stack8 {}
```

Note that variables are not classes and do not follow this convention. For example: `@purple-300` (`LESS`) or `var(--dt-size-450)` (CSS Custom Property).

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

All of our utility classes are set to `!important`. This is because they are designed to be immutable, and `!important` is the best way we have of achieving immutability in CSS.

### CSS vars

We use CSS vars, also known as [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) in our classes for better reusability. We try to always use CSS vars, e.g. `var(--size-500)` over less vars `@su16` in our code, however we often use LESS vars to help generate CSS vars.

Here we set the `--avatar--size` CSS var to `12`, and set both the width and the height to reference this variable.
```less
.d-avatar {
    --avatar--size: var(--size-450);
    width: var(--avatar--size);
    height: var(--avatar--size);
}
```

Now in variation `d-avatar--sm`, we just set `--avatar--size`. Width and height will be set for you.

```less
.d-avatar--sm {
  --avatar--size: var(--size-400);
}
```

### Linting

Our code is linted by:

- [stylelint](https://stylelint.io).
- [lesshint](https://github.com/lesshint/lesshint).
- [eslint](https://eslint.org).
- [markdownlint](https://github.com/DavidAnson/markdownlint).

Configuration can be found in:

- [stylelint.config.js](../stylelint.config.js), [.stylelintignore](../.stylelintignore)
- [.lesshintrc.js](../.lesshintrc.js)
- [.eslintrc.js](../.eslintrc.js), [.eslintignore](../.eslintignore)
- [.markdownlintrc](../.markdownlintrc), [.markdownlintignore](../.markdownlintignore)

Your code will be linted automatically on commit.

- **Lint manually:** `npm run lint`
- **With autofix:** `npm run lint:fix`

Note that we use lesshint only for the utilities folder and stylelint for everything else. Due to some unsupported syntax limitations we cannot use stylelint on our utilities folder.

### Folder structure

Here are some important directories to know within the Dialtone repository

- `lib/build`: All source code and assets for the Dialtone library.
- `lib/dist`: The compiled bundle will be output here upon `npm run build`.
- `lib/build/fonts`: Fonts we wish to bundle with Dialtone (woff2 format).
- `lib/build/less`: LESS files defining our styles. they are processed and transpiled to CSS on build.
- `lib/build/svg`: SVGs used for icons and spot illustrations. See [adding icons](https://dialpad.design/about/contributing.html#adding-icons-and-illustrations) for instructions on how to add icons into Dialtone.

For folder structure of the doc site, see the [VuePress section](#vuepress) of this document.

### Testing

Because Dialtone is purely a CSS library we do not perform any automated testing. Please locally test your changes via `npm start` and visually verifying them.

### A11y standards

Dialtone adopts the [WCAG 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/glance/) Web Content Accessibility Guidelines.

## Commit Message Convention

Dialtone uses [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) to have commit messages that can be used as part of the [semantic release process](RELEASING.md). For more information, see [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md).

### Git Hooks

To enforce your commit message on the release branches (`production`, `staging`, `alpha` and `beta`) are correct according to the Conventional Commits specification, there is a `commit-msg` git hook that will be invoked by `git commit`.
`pre-commit` git hook will lint your code.

## Versioning

Dialtone follows [SemVer](https://semver.org/) for versioning and the commit message convention used in the project is aligned with SemVer by describing the features, fixes, and breaking changes made in commit messages.

## How we manage work

We use Jira to manage our work and you can visit the [Dialtone board and backlog](https://switchcomm.atlassian.net/jira/software/projects/DT/boards/187/backlog) assuming you are an authenticated Dialpad employee. Below we will define how we use our Jira board so team members and external contriubutors are all on the same page.

### Issue Types

#### Dev Story

A "Dev Story" is a small portion of work estimated and completed by the development team.

#### Design Story

A "Design Story" is a small portion of work estimated and completed by the design team.

#### Proposal

Proposals can be submitted by anyone with access to the jira board. Each proposal will be discussed in a grooming meeting with the Design System team and if accepted will be turned into a story (or multiple).

#### Epic

Epics are a collection of multiple stories. As compared to stories, scope is very flexible. Stories will be added and removed as necessary. Epics will likely be closely related with our quarterly OKRs but may not necessarily be a direct 1 to 1 mapping to them. For example you may have multiple epics to complete an OKR if it makes sense to do so. Epics should have a start and end date in order to assist us with long term roadmapping. If it does not make sense to give an epic a start and end date and it is an infinitely ongoing collection, then it likely should be a part of the [square bracket categories](#square-bracket-categories) below. Not all stories need to be in an epic.

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

Within each of these categories, items marked todo should always be above items marked needs definition. The top items of needs defintion are next to be groomed, and the top items of todo are next to be pulled into the sprint.

Proposals are mixed in and ranked with stories as they will eventually be turned into stories.

### Square bracket categories

We use these to categorize our work by preceding the title of the Jira ticket by one of the below tags. These are long running categories and unlike epics will never be "completed". Try to use just one if you can, but if necessary multiple can be used.

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

If you are developer contributing to Dialtone but are not on the Dialtone team your work will be added to the Dialtone board as normal and groomed with the Dialtone team. The main difference is that we will not be including your story in a Dialtone team sprint. The status of the ticket can just be updated directly in the backlog as you work. You may want to create a duplicate story on your own team board to include in your own team sprint. If you do so make sure to link to the existing Dialtone ticket and update the status of both of them.

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
- Validating commit messages `.github/workflows/lint-commit-message.yml`, see [COMMIT_CONVENTION](COMMIT_CONVENTION.md) for our commit message conventions.



[Components overview page]: https://dialpad.design/components/
[Components status page]: https://dialpad.design/components/status/
