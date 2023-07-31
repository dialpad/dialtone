# Contributing

Thanks for your interest in contributing to Dialtone Icons! Please take a moment to review this document before submitting a pull request.

## Overview

### What is Dialtone Icons?

Dialtone Icons is an icon repository which serves to store, pre-process and ship icons 
to use either on [Dialtone-vue icon] 
or standalone as SVG files

### What is a contribution?

A contribution is any proposal, design, code, or documentation completed by someone not on the core Dialtone team, and released through Dialtone icons for other people to use. 
It can be created by anyone who'd like to help make Dialtone icons better.

Types of contributions:

- **Fix:** fixes a technical defect, documentation typo, or Figma symbol defect.
- **Enhancement:** extends an existing style or component without changing the underlying architecture or behavior.
- **New feature:** adds something new, like an icon.

### Roles

- **Contributor:** Has the ability to create PRs and merge their change into `staging` after at least one approving review.
- **Maintainer:** A trusted contributor with the ability to release Dialtone icons.
- **Admin:** Has the ability to change any configuration on the Dialtone icons repository and release Dialtone icons. Usually for members of the Dialtone team.

## How to contribute

### Bug report

If you would like to report a bug, please post it in [#dialtone] 
We will assist you in determining whether it is a Dialtone icons bug. 
Please give us a working example of the bug on a private beta or deploy preview link. A branch we can checkout is also helpful. 
If we have determined that this is a bug in Dialtone icons, then you may create a bug report on Jira for the bug. 
We will get to fixing the bug in the future, or you can fix the bug yourself by [Making a Pull Request](#making-a-pull-request)

### Making a pull request

Before submitting a pull request, make sure to communicate what you wish to change to the Dialtone team. 
The easiest way to do this is via the [#dialtone] Slack channel. 
It's possible your change is already being worked on, has already been fixed, or maybe we just need to discuss the best solution to the problem. 
This prevents you from having to re-write your entire change, or even having to scrap it entirely.

After you have discussed your change with the Dialtone team, follow these steps to submit it:

1. See [README.md] for instructions on how to initially clone and run the project.
2. First make sure you are on the `staging` branch with `git checkout staging`, and that it is up-to-date with `git pull`.
3. Create a personal branch to make your change off of `staging` with `git checkout -b my-change-branch`. **We use kebab-case for branch names**.
4. Make and commit your changes. Note our [COMMIT_CONVENTION.md] (Your change will be automatically linted on commit). 
   - If you have only a **single commit** on your branch: your git commit message must follow the conventions. 
   - If you have **multiple commits** on your branch: the GitHub PR title must follow the commit message conventions.
5. Push your branch to remote. `git push -u origin my-change-branch`.
6. Create a pull request into the `staging` branch, reviewers will be automatically added and notified of your PR.
7. Once your changes have been approved, you may squash merge your branch into `staging`.

Once your change is in `staging` it will go live with the next Dialtone icons release. 
Releases are done on demand by the Dialtone team, and are done fairly regularly. 
If you need your change to be released promptly, please ask in the [#dialtone] Slack channel.

## Coding guidelines

### Important Folders and Files

- `src/svg`: All the source SVG icon files.
- `baseIconTemplate`: Used as base template to generate a unique identifier for the icons
- `icons.json`: Contains the categories on which icons are going to be included and the keywords to make the icons more discoverable while searching on [Dialtone icons documentation](https://dialpad.design/components/icon.html)
- `utils.js`: Singleton that's used at build time to generate the unique ID to every icon. 

## Commit Message Convention

Dialtone icons uses [Conventional Commits specification] to have commit messages that can be used as part of the [Releasing]. For more information, see [COMMIT_CONVENTION.md].

### Git Hooks

To enforce your commit message on the release branches (`production`, `staging`, `alpha` and `beta`) are correct according to the Conventional Commits specification, there is a `commit-msg` git hook that will be invoked by `git commit`.
`pre-commit` git hook will lint your code.

## Versioning

Dialtone icons follows [SemVer] for versioning and the commit message convention used in the project is aligned with SemVer by describing the features, fixes, and breaking changes made in commit messages.

## How we manage work

We use Jira to manage our work, and you can visit the [Dialtone board and backlog] assuming you are an authenticated Dialpad employee. 
Below we will define how we use our Jira board so team members and external contributors are all on the same page.

### Issue Types

#### Dev Story

A "Dev Story" is a small portion of work estimated and completed by the development team.

#### Design Story

A "Design Story" is a small portion of work estimated and completed by the design team.

#### Proposal

Proposals can be submitted by anyone with access to the jira board. Each proposal will be discussed in a grooming meeting with the Design System team and if accepted will be turned into a story (or multiple).

#### Epic

Epics are a collection of multiple stories. As compared to stories, scope is very flexible. Stories will be added and removed as necessary. 
Epics will likely be closely related with our quarterly OKRs but may not necessarily be a direct 1 to 1 mapping to them. 
For example: you may have multiple epics to complete an OKR if it makes sense to do so. 
Epics should have a start and end date in order to assist us with long term road-mapping.  
Not all stories need to be in an epic.

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

Just because an item is high priority does not necessarily mean it will be pulled into the sprint before a medium item. 
The priority is how much business value this particular task will provide, however the rank (sort order) of the backlog is the order in which items will be pulled into the sprint. 
The rank is determined manually by the product owner (@braddialpad / @francisrupert in this case) and can be based on factors other than just priority, effort for example.

#### Order / Rank

In the backlog we always try to keep our jira items sorted in this order from top to bottom:

- Bugs
- Spikes
- Stories / Proposals

Within each of these categories, items marked todo should always be above items marked needs definition. The top items of needs defintion are next to be groomed, and the top items of todo are next to be pulled into the sprint.

Proposals are mixed in and ranked with stories as they will eventually be turned into stories.

### What about outside contributions?

If you are developer contributing to Dialtone but are not on the Dialtone team your work will be added to the Dialtone board as normal and groomed with the Dialtone team. 
The main difference is that we will not be including your story in a Dialtone team sprint. 
The status of the ticket can just be updated directly in the backlog as you work. 
You may want to create a duplicate story on your own team board to include in your own team sprint. 
If you do so make sure to link to the existing Dialtone ticket and update the status of both of them.

## Tooling

### GitHub Actions

[GitHub Actions] is what we use for our CI/CD solution. 
All GHA workflows are in the `.github/workflows` directory. Currently, we use GitHub Actions for the following:

- Deploying to `main` `.github/workflows/deploy.yml`, See [RELEASING.md] for instructions on how to do this.
- Linting our LESS files on pull request `.github/workflows/lint-pr.yml`.
- Validating commit messages `.github/workflows/lint-commit-message.yml`, see [COMMIT_CONVENTION.md] for our commit message conventions.


[Readme.md]: ../README.md
[RELEASING.md]: RELEASING.md
[COMMIT_CONVENTION.md]: COMMIT_CONVENTION.md
[GitHub Actions]: https://docs.github.com/en/actions
[Dialtone board and backlog]: https://dialpad.atlassian.net/jira/software/c/projects/DLT/boards/548/backlog?view=detail&issueLimit=100
[SemVer]: https://semver.org/
[Conventional Commits specification]: https://www.conventionalcommits.org/en/v1.0.0/
[#dialtone]: https://dialpad.slack.com/messages/dialtone/ 
[Dialtone-vue icon]: https://vue.dialpad.design/?path=/story/components-icon--default