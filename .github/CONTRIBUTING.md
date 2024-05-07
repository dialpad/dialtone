# Contributing

Thanks for your interest in contributing to Dialtone! Please take a moment to review this document before submitting a pull request.

Dialtone exists as a monorepo containing multiple packages. Libraries are stored in the packages folder, and deployable documentation sites are stored in the apps folder. Currently the Dialtone Vue storybook documentation sites are stored in the same folder as their libraries due to a limitation of storybook, however this may change in the future as it makes more logical sense for them to be stored in the apps folder.

This contributing guide contains guidelines and processes that apply to all packages of the Dialtone monorepo. There are also contributing guides specific to each package, so make sure to also read the contributing guide for the package you are contributing to in addition to this one:

## Dialtone CSS

[CONTRIBUTING.md](../packages/dialtone-css/.github/CONTRIBUTING.md)

## Dialtone Tokens

[CONTRIBUTING.md](../packages/dialtone-tokens/.github/CONTRIBUTING.md)

## Dialtone Vue

[CONTRIBUTING.md](../packages/dialtone-vue3/.github/CONTRIBUTING.md)

## Dialtone Icons

[CONTRIBUTING.md](../packages/dialtone-icons/.github/CONTRIBUTING.md)

## Dialtone Documentation Site

[CONTRIBUTING.md](../apps/dialtone-documentation/.github/CONTRIBUTING.md)

## Overview

### What is Dialtone?

Dialtone is a design system by Dialpad comprised of CSS components and utility classes, [Vue components](https://dialtone.dialpad.com/vue), visual assets, documentation and examples which strives to:

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

## Making a Pull Request

### Before Submitting

Before submitting a pull request, make sure to communicate what you wish to change to the Dialtone team.
The easiest way to do this is via the #dialtone Dialpad channel.
It's possible your change is already being worked on, has already been fixed, or maybe we just need to discuss the best solution to the problem.
This prevents you from having to re-write your entire change, or even having to scrap it entirely.

The Dialtone library exists to serve multiple teams, so it is important to ensure that your PR does not introduce any unnecessary breaking changes.
Breaking changes will require extra steps that may prolong the submission review process.
If breaking changes are absolutely necessary for your use case, then you must communicate them to the Dialtone team in advance to allow for a smooth migration strategy for all dependant projects.

Examples of breaking include the following:

- **Changing or removing the component API**: renaming or removing props and emits, or changing their expected types

Examples of non-breaking changes:

- **Making new additions to the component API**: for example, adding a new prop to a component that triggers a different flow of behaviour or output, or adding a new emit event to detect specific changes.
- **Refactoring**: changing the internal code of a component without changing any external behaviour.

Some updates can unintentionally cause breaking changes, or cause changes to a component's output behaviour or functionality without necessary breaking it.
This is why it is important to evaluate the change carefully and asses its impact on existing usage.

Any new components or updates to existing components require the following:

- Unit tests covering the entire change.
- Storybook documentation including a live rendered component via controls and MDX. See [the documentation](https://dialtone.dialpad.com/vue/?path=/docs/docs-storybook-getting-started--docs)
- Component is accessible according to requirements.
  - Navigable by keyboard.
  - Read by a screen reader.
  - Minimum contrast ratio.
- Changes must be made for Vue 2 as well as Vue 3, `dialtone-vue2` and `dialtone-vue3` package folders respectively
- Unit tests are passing locally.
  - `nx test dialtone-vue2` or `nx test dialtone-vue3`
- Linters are passing locally.
  - `nx lint dialtone-vue2` or `nx lint dialtone-vue3`
- Library builds locally.
  - `nx build dialtone-vue2` or `nx build dialtone-vue3`
- Documentation builds locally.
  - `nx storybook:build dialtone-vue2` or `nx storybook:build dialtone-vue3`

### How to Submit

After you have discussed your change with the Dialtone team, follow these steps to submit it:

1. See [README.md](../README.md) for instructions on how to initially clone and run the project.
2. First make sure you are on the `staging` branch with `git checkout staging`, and that it is up-to-date with `git pull`.
3. Create a personal branch to make your change off of `staging` with `git checkout -b my-change-branch`. We use kebab-case for branch names.
4. Make and commit your changes. Note our commit message conventions in [COMMIT_CONVENTION.md].
5. Push your branch to remote. `git push -u origin my-change-branch`.
6. Create a pull request into the `staging` branch, reviewers will be automatically added and notified of your PR.
7. Set the label on your PR:

   - 'visual-test-ready' if your PR includes visual UI changes.
   - 'no-visual-test' if no UI changes.

8. If it's a Vue change, you need to update both dialtone-vue2 and dialtone-vue3 packages. You may sync your changes from Vue 2 to Vue 3 (or vice versa) using the `./scripts/dialtone-vue-sync.sh` script.
9. Once your changes have been approved, you may squash your branch into staging.

Once your change is in `staging` it will go live with the next Dialtone Vue release.
Releases are done on demand by the Dialtone team, and are done fairly regularly.

## Commit Message Convention

Dialtone uses [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) to have commit messages that can be used as part of the semantic release process. For more information, see [COMMIT_CONVENTION.md].

### A11y standards

Dialtone adopts the [WCAG 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/glance/) Web Content Accessibility Guidelines.

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

### GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is what we use for our CI/CD solution.
All GHA workflows are in the `.github/workflows` directory.
Currently, we use GitHub Actions to run a number of CI process releated to releasing, deploying, and running checks on PRs.

[COMMIT_CONVENTION.md]: ./COMMIT_CONVENTION.md
